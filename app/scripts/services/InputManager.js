'use strict';

angular.module( 'cocjs' ).factory( 'InputManager', function( $log, MainView ) {

	var defaultControlMethods = {};
	var defaultKeysToControlMethods = {};
	var controlMethods = {};
	var availableControlMethods = 0;
	var cheatControlMethods = {};
	var availableCheatControlMethods = 0;
	var keysToControlMethods = {};
	var bindingMode = false;
	var bindingFunc = null;
	var bindingSlot = null;
	
	var InputManager = {};

	// Declaring some consts for clarity when using some of the InputManager methods
	InputManager.PRIMARYKEY = true;
	InputManager.SECONDARYKEY = false;
	InputManager.NORMALCONTROL = false;
	InputManager.CHEATCONTROL = true;
	InputManager.UNBOUNDKEY = -1;
	/**
	 * Mode toggle - keyboard events recieved by the input manager will be used to associated the incoming keycode
	 * with a new bound control method, removing the keycode from *other* bindings and updating data as appropriate.
	 * Displays a message indicating the player should do the needful.
	 * @param    funcName    BoundControlMethod name that they key is going to be associated with. Set by a button
	 *                        callback function generated in BindingPane
	 * @param    isPrimary    Specifies if the incoming bind will replace/set the primary or secondary bind for a control.
	 */
	InputManager.ListenForNewBind = function( funcName, isPrimary ) {
		if( isPrimary === undefined ) {
			isPrimary = true;
		}
		$log.debug( 'Listening for a new ' + (isPrimary ? 'Primary' : 'Secondary') + ' bind for ' + funcName );
		bindingMode = true;
		InputManager._bindingFunc = funcName;
		InputManager._bindingSlot = isPrimary;
		MainView.mainText.htmlText = '<b>Hit the key that you want to bind ' + funcName + ' to!</b>';
		// hide some buttons that will fuck shit up
		MainView.hideCurrentBottomButtons();
		InputManager.HideBindingPane();
	};
	/**
	 * Mode toggle - return to normal keyboard event listening mechanics. Shows the binding display again.
	 */
	InputManager.StopListenForNewBind = function() {
		bindingMode = false;
		bindingFunc = null;
		bindingSlot = null;
		MainView.showCurrentBottomButtons();
		InputManager.DisplayBindingPane();
	};
	/**
	 * Add a new action that can be associated with incoming key codes.
	 * This will mostly be static after first being initialized, this pattern was just easier to capture references
	 * to the required game functions without having to make the InputManager truely global or doing any namespacing
	 * shenanigans.
	 * The closure can be declared with the rest of the game code, in the namespace where the functions are available,
	 * and still work inside this object.
	 * @param    name        Name to associate the BoundControlMethod with
	 * @param    desc        A description of the activity that the BoundControlMethod does. (Unused, but implemented)
	 * @param    func        A function object that defines the BoundControlMethods action
	 * @param    isCheat        Differentiates between a cheat method (not displayed in the UI) and normal controls.
	 */
	InputManager.AddBindableControl = function( name, desc, func, isCheat ) {
		if( isCheat ) {
			cheatControlMethods[ name ] = {
				Func: func,
				Name: name,
				Description: desc,
				Index: availableCheatControlMethods++,
				PrimaryKey: -1,
				SecondaryKey: -1
			};
		} else {
			controlMethods[ name ] = {
				Func: func,
				Name: name,
				Description: desc,
				Index: availableControlMethods++,
				PrimaryKey: -1,
				SecondaryKey: -1
			};
		}
	};
	/**
	 * Set either the primary or secondary binding for a target control method to a given keycode.
	 * @param    keyCode        The keycode to bind the method to.
	 * @param    funcName    The name of the associated BoundControlMethod
	 * @param    isPrimary    Specifies the primary or secondary binding slot
	 */
	InputManager.BindKeyToControl = function( keyCode, funcName, isPrimary ) {
		if( isPrimary === undefined ) {
			isPrimary = true;
		}
		if(!controlMethods[ keyCode ]) {
			$log.warn( 'Failed to bind control method [' + funcName + '] to keyCode [' + keyCode + ']' );
			return;
		}
		// Check if the incoming key is already bound to *something* and if it is, remove the bind.
		InputManager.RemoveExistingKeyBind( keyCode );
		var key = isPrimary ? controlMethods[ funcName ].PrimaryKey : controlMethods[ funcName ].SecondaryKey;
		if( key !== InputManager.UNBOUNDKEY ) {
			delete keysToControlMethods[ key ];
		}
		// Add the new bind
		keysToControlMethods[ keyCode ] = key;
		if(isPrimary) {
			controlMethods[ funcName ].PrimaryKey = keyCode;
		}else{
			controlMethods[ funcName ].SecondaryKey = keyCode;
		}
	};
	/**
	 * Remove an existing key from a BoundControlMethod, if present, and shuffle the remaining key as appropriate
	 * @param    keyCode        The keycode to remove.
	 */
	InputManager.RemoveExistingKeyBind = function( keyCode ) {
		// If the key is already bound to a method, remove it from that method
		if( keysToControlMethods[ keyCode ] !== null ) {
			if( controlMethods[ keysToControlMethods[ keyCode ] ].PrimaryKey === keyCode ) {
				controlMethods[ keysToControlMethods[ keyCode ] ].PrimaryKey = controlMethods[ keysToControlMethods[ keyCode ] ].SecondaryKey;
				controlMethods[ keysToControlMethods[ keyCode ] ].SecondaryKey = InputManager.UNBOUNDKEY;
			} else if( controlMethods[ keysToControlMethods[ keyCode ] ].SecondaryKey === keyCode ) {
				controlMethods[ keysToControlMethods[ keyCode ] ].SecondaryKey = InputManager.UNBOUNDKEY;
			}
		}
	};
	/**
	 * The core event handler we attach to the stage to capture incoming keyboard events.
	 * @param    e        KeyboardEvent data
	 */
	InputManager.KeyHandler = function( e ) {
		$log.debug( 'Got key input ' + e.keyCode );
		// Ignore key input during certain phases of gamestate
		if( MainView.nameBox.visible && MainView.nameBox.focus ) {
			return;
		}
		// If we're not in binding mode, listen for key inputs to act on
		if( bindingMode === false ) {
			// Made it this far, process the key and call the relevant (if any) function
			InputManager.ExecuteKeyCode( e.keyCode );
		}
		// Otherwise, we're listening for a new keycode from the player
		else {
			InputManager.BindKeyToControl( e.keyCode, InputManager._bindingFunc, InputManager._bindingSlot );
			InputManager.StopListenForNewBind();
		}
	};
	/**
	 * Execute the BoundControlMethod's wrapped function associated with the given KeyCode
	 * @param    keyCode        The KeyCode for which we wish to execute the BoundControlMethod for.
	 */
	InputManager.ExecuteKeyCode = function( keyCode ) {
		if( keysToControlMethods[ keyCode ] !== null ) {
			$log.debug( 'Attempting to exec func [' + controlMethods[ keysToControlMethods[ keyCode ] ].Name + ']' );
			controlMethods[ keysToControlMethods[ keyCode ] ].Func();
		}
		_.forOwn(cheatControlMethods, function(cheatControlMethod) {
			cheatControlMethod.Func( keyCode );
		});
	};
	/**
	 * Hide the mainText object and scrollbar, ensure the binding ScrollPane is up to date with the latest
	 * data and then show the binding scrollpane.
	 */
	InputManager.DisplayBindingPane = function() {
		MainView.mainText.visible = false;
		MainView.bindingPane.functions = InputManager.GetAvailableFunctions();
		MainView.bindingPane.ListBindingOptions();
		MainView.bindingPane.visible = true;
		MainView.nameBox.KeyHandler = InputManager.KeyHandler;
	};
	/**
	 * Hide the binding ScrollPane, and re-display the mainText object + Scrollbar.
	 */
	InputManager.HideBindingPane = function() {
		MainView.mainText.visible = true;
		MainView.bindingPane.visible = false;
		MainView.nameBox.KeyHandler = null;
	};
	/**
	 * Register the current methods, and their associated bindings, as the defaults.
	 * TODO this shit off
	 */
	InputManager.RegisterDefaults = function() {
		_.forOwn(controlMethods, function(value, key) {
			defaultControlMethods[ key ] = angular.copy(controlMethods[ key ]);
		});
		// Elbullshito mode -- 126 is the maximum keycode in as3 we're likely to see
		_.forEach(_.range(127), function(i) {
			if( keysToControlMethods[ i ] !== undefined ) {
				defaultKeysToControlMethods[ i ] = keysToControlMethods[ i ];
			}
		});
	};
	/**
	 * Reset the bound keys to the defaults previously registered.
	 */
	InputManager.ResetToDefaults = function() {
		_.forOwn(controlMethods, function(value, key) {
			controlMethods[ key ] = angular.copy(defaultControlMethods[ key ]);
		});
		// Elbullshito mode -- 126 is the maximum keycode in as3 we're likely to see
		_.forEach(_.range(127), function(i) {
			if( defaultKeysToControlMethods[ i ] !== undefined ) {
				keysToControlMethods[ i ] = defaultKeysToControlMethods[ i ];
			}
		});
	};
	/**
	 * Get an array of the available functions.
	 * @return    Array of available BoundControlMethods.
	 */
	InputManager.GetAvailableFunctions = function() {
		return _.sortBy(_.values(controlMethods), function(func) { return func.Index; } );
	};

	/**
	 * Get an array of the currently active keyCodes.
	 * @return    Array of active keycodes.
	 */
	InputManager.GetControlMethods = function() {
		return _.keys(keysToControlMethods);
	};
	/**
	 * Clear all currently bound keys.
	 */
	InputManager.ClearAllBinds = function() {
		_.forOwn(controlMethods, function(value) {
			value.PrimaryKey = InputManager.UNBOUNDKEY;
			value.SecondaryKey = InputManager.UNBOUNDKEY;
		});
		keysToControlMethods = {};
	};
	/**
	 * Load bindings from a source 'Object' retrieved from a game save file.
	 * @param    source    Source object to enumerate for binding data.
	 */
	InputManager.LoadBindsFromObj = function( source ) {
		InputManager.ClearAllBinds();
		_.forOwn(source, function(value, key) {
			if( value.PrimaryKey !== InputManager.UNBOUNDKEY ) {
				InputManager.BindKeyToControl( value.PrimaryKey, key, InputManager.PRIMARYKEY );
			}
			if( value.SecondaryKey !== InputManager.UNBOUNDKEY ) {
				InputManager.BindKeyToControl( value.SecondaryKey, key, InputManager.SECONDARYKEY );
			}
		});
	};
	/**
	 * Create an associative object that can serialise the bindings to the users save file.
	 * @return    Dynamic object of control bindings.
	 */
	InputManager.SaveBindsToObj = function() {
		return angular.copy(controlMethods);
	};
	return InputManager;
} );
/**
 * List of known bound keyboard methods
 *
 * Some of the methods use an undefined 'Event' parameter to pass into the actual UI components...
 * ... strip this out and instead modify the handlers on the execution end to have a default null parameter?
 *
 * ** Bypass handler if mainView.eventTestInput.x === 270.5
 * ** Bypass handler if mainView.nameBox.visible && stage.focus === mainView.nameBox
 *
 * 38    -- UpArrow            -- Cheat code for Humus stage 1
 * 40    -- DownArrow        -- Cheat code for Humus stage 2
 * 37    -- LeftArrow        -- Cheat code for Humus stage 3
 * 39    -- RightArrow        -- Cheat code for Humus stage 4 IF str > 0, not gameover, give humus
 *
 * 83    -- s                -- Display stats if main menu button displayed
 * 76    -- l                -- Level up if level up button displayed
 * 112    -- F1                -- Quicksave to slot 1 if menu_data displayed
 * 113    -- F2                -- Quicksave slot 2
 * 114    -- F3                -- Quicksave slot 3
 * 115    -- F4                -- Quicksave slot 4
 * 116    -- F5                -- Quicksave slot 5
 *
 * 117    -- F6                -- Quickload slot 1
 * 118    -- F7                -- Quickload slot 2
 * 119    -- F8                -- Quickload slot 3
 * 120    -- F9                -- Quickload slot 4
 * 121    -- F10                -- Quickload slot 5
 *
 * 8    -- Backspace        -- Go to 'Main' menu if in game
 * 68    -- d                -- Open saveload if in game
 * 65    -- a                -- Open apperance if in game
 * 78    -- n                -- 'no' if button index 1 displays no        <--
 * 89    -- y                -- 'yes' if button index 0 displays yes        <-- These two seem akward
 * 80    -- p                -- display perks if in game
 *
 * 13/32 -- Enter/Space        -- if button index 0,4,5 or 9 has text of (nevermind, abandon, next, return, back, leave, resume) execute it
 *
 * 36    -- Home                -- Cycle the background of the maintext area
 *
 * 49    -- 1                -- Execute button index 0 if visisble
 * 50    -- 2                -- ^ index 1
 * 51    -- 3                -- ^ index 2
 * 52    -- 4                -- ^ index 3
 * 53    -- 5                -- ^ index 4
 * 54/81-- 6/q                -- ^ index 5
 * 55/87-- 7/w                -- ^ index 6
 * 56/69-- 8/e                -- ^ index 7
 * 57/82-- 9/r                -- ^ index 8
 * 48/84-- 0/t                -- ^ index 9
 *
 * 68    -- ???                -- ??? Unknown, theres a conditional check for the button, but no code is ever executed
 */