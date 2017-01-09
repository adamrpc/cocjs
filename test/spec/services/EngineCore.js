'use strict';

describe('Factory: EngineCore', function() {
	beforeEach(module('cocjs'));
	var engineCore;
	var coc;
	var perkLib;
	var mainView;
	var coC_Settings;
	var log;
	var PlayerConstructor;
	var statusAffects;
	var sceneLib;
	var flags;
	var armorLib;
	beforeEach(inject(function( $log, EngineCore, CoC, kFLAGS, PerkLib, MainView, CoC_Settings, Player, StatusAffects, SceneLib, ArmorLib) {
		log = $log;
		engineCore = EngineCore;
		coc = CoC;
		perkLib = PerkLib;
		mainView = MainView;
		coC_Settings = CoC_Settings;
		PlayerConstructor = Player;
		statusAffects = StatusAffects;
		sceneLib = SceneLib;
		flags = kFLAGS;
		armorLib = ArmorLib;
	}));
	it('Should define EngineCore', function() {
		expect(engineCore).toBeDefined();
	});
	it('Should define silly', function() {
		expect(engineCore.silly).toBeDefined();
	});
	it('Should define return flag value', function() {
		coc.flags[ 305 ] = true;
		expect(engineCore.silly()).toBe( true );
		coc.flags[ 305 ] = false;
		expect(engineCore.silly()).toBe( false );
	});
	it('Should define registerGameOver and gameOver', function() {
		expect(engineCore.registerGameOver).toBeDefined();
		expect(engineCore.gameOver).toBeDefined();
	});
	it('Should define gameOverCallback and call it', function() {
		var test = {
			callback : function() {}
		};
		spyOn(test, 'callback');
		engineCore.registerGameOver( test.callback );
		engineCore.gameOver( 99 );
		expect(test.callback.calls.count()).toBe(1);
		expect(test.callback).toHaveBeenCalledWith( 99 );
	});
	it('Should define HPChange', function() {
		expect(engineCore.HPChange).toBeDefined();
	});
	it('Should change HP', function() {
		var historyHealer = null;
		var maxHp = 100;
		coc.player = {
			findPerk: function( perk ) {
				if( perk === perkLib.HistoryHealer ) {
					return historyHealer;
				}
			},
			maxHP: function( ) { return maxHp; },
			HP: 0
		};
		mainView.statsView.showStatUp = function() {};
		mainView.statsView.showStatDown = function() {};
		spyOn(mainView.statsView, 'showStatUp');
		spyOn(mainView.statsView, 'showStatDown');
		spyOn(mainView.statsView, 'show');
		engineCore.HPChange( 0 );
		expect(mainView.statsView.showStatUp.calls.count()).toBe(0);
		expect(mainView.statsView.showStatDown.calls.count()).toBe(0);
		expect(mainView.statsView.show.calls.count()).toBe(0);
		expect(coc.player.HP).toBe(0);
		engineCore.HPChange( 13 );
		expect(mainView.statsView.showStatUp.calls.count()).toBe(1);
		expect(mainView.statsView.showStatUp).toHaveBeenCalledWith( 'HP' );
		expect(mainView.statsView.showStatDown.calls.count()).toBe(0);
		expect(mainView.statsView.show.calls.count()).toBe(1);
		expect(coc.player.HP).toBe( 13 );
		mainView.statsView.showStatUp.calls.reset();
		mainView.statsView.show.calls.reset();
		engineCore.HPChange( maxHp + 13 );
		expect(mainView.statsView.showStatUp.calls.count()).toBe(1);
		expect(mainView.statsView.showStatUp).toHaveBeenCalledWith( 'HP' );
		expect(mainView.statsView.showStatDown.calls.count()).toBe(0);
		expect(mainView.statsView.show.calls.count()).toBe(1);
		expect(coc.player.HP).toBe( maxHp );
		mainView.statsView.showStatUp.calls.reset();
		mainView.statsView.show.calls.reset();
		engineCore.HPChange( 13 );
		expect(mainView.statsView.showStatUp.calls.count()).toBe(0);
		expect(mainView.statsView.showStatDown.calls.count()).toBe(0);
		expect(mainView.statsView.show.calls.count()).toBe(0);
		expect(coc.player.HP).toBe( maxHp );
		engineCore.HPChange( -13 );
		expect(mainView.statsView.showStatUp.calls.count()).toBe(0);
		expect(mainView.statsView.showStatDown.calls.count()).toBe(1);
		expect(mainView.statsView.showStatDown).toHaveBeenCalledWith( 'HP' );
		expect(mainView.statsView.show.calls.count()).toBe(1);
		expect(coc.player.HP).toBe( maxHp - 13 );
		mainView.statsView.showStatDown.calls.reset();
		mainView.statsView.show.calls.reset();
		engineCore.HPChange( -maxHp );
		expect(mainView.statsView.showStatUp.calls.count()).toBe(0);
		expect(mainView.statsView.showStatDown.calls.count()).toBe(1);
		expect(mainView.statsView.showStatDown).toHaveBeenCalledWith( 'HP' );
		expect(mainView.statsView.show.calls.count()).toBe(1);
		expect(coc.player.HP).toBe( 0 );
		mainView.statsView.showStatDown.calls.reset();
		mainView.statsView.show.calls.reset();
		engineCore.HPChange( -13 );
		expect(mainView.statsView.showStatUp.calls.count()).toBe(0);
		expect(mainView.statsView.showStatDown.calls.count()).toBe(0);
		expect(mainView.statsView.show.calls.count()).toBe(0);
		expect(coc.player.HP).toBe( 0 );
		historyHealer = {test:1};
		engineCore.HPChange( 0 );
		expect(mainView.statsView.showStatUp.calls.count()).toBe(0);
		expect(mainView.statsView.showStatDown.calls.count()).toBe(0);
		expect(mainView.statsView.show.calls.count()).toBe(0);
		expect(coc.player.HP).toBe(0);
		engineCore.HPChange( 13 );
		expect(mainView.statsView.showStatUp.calls.count()).toBe(1);
		expect(mainView.statsView.showStatUp).toHaveBeenCalledWith( 'HP' );
		expect(mainView.statsView.showStatDown.calls.count()).toBe(0);
		expect(mainView.statsView.show.calls.count()).toBe(1);
		expect(coc.player.HP).toBe( 15.6 );
		mainView.statsView.showStatUp.calls.reset();
		mainView.statsView.show.calls.reset();
		engineCore.HPChange( 71 );
		expect(mainView.statsView.showStatUp.calls.count()).toBe(1);
		expect(mainView.statsView.showStatUp).toHaveBeenCalledWith( 'HP' );
		expect(mainView.statsView.showStatDown.calls.count()).toBe(0);
		expect(mainView.statsView.show.calls.count()).toBe(1);
		expect(coc.player.HP).toBe( maxHp );
		mainView.statsView.showStatUp.calls.reset();
		mainView.statsView.show.calls.reset();
		engineCore.HPChange( 13 );
		expect(mainView.statsView.showStatUp.calls.count()).toBe(0);
		expect(mainView.statsView.showStatDown.calls.count()).toBe(0);
		expect(mainView.statsView.show.calls.count()).toBe(0);
		expect(coc.player.HP).toBe( maxHp );
		engineCore.HPChange( -13 );
		expect(mainView.statsView.showStatUp.calls.count()).toBe(0);
		expect(mainView.statsView.showStatDown.calls.count()).toBe(1);
		expect(mainView.statsView.showStatDown).toHaveBeenCalledWith( 'HP' );
		expect(mainView.statsView.show.calls.count()).toBe(1);
		expect(coc.player.HP).toBe( maxHp - 13 );
		mainView.statsView.showStatDown.calls.reset();
		mainView.statsView.show.calls.reset();
		engineCore.HPChange( -maxHp );
		expect(mainView.statsView.showStatUp.calls.count()).toBe(0);
		expect(mainView.statsView.showStatDown.calls.count()).toBe(1);
		expect(mainView.statsView.showStatDown).toHaveBeenCalledWith( 'HP' );
		expect(mainView.statsView.show.calls.count()).toBe(1);
		expect(coc.player.HP).toBe( 0 );
		mainView.statsView.showStatDown.calls.reset();
		mainView.statsView.show.calls.reset();
		engineCore.HPChange( -13 );
		expect(mainView.statsView.showStatUp.calls.count()).toBe(0);
		expect(mainView.statsView.showStatDown.calls.count()).toBe(0);
		expect(mainView.statsView.show.calls.count()).toBe(0);
		expect(coc.player.HP).toBe( 0 );
	});
	it('Should define createCallBackFunction', function() {
		expect(engineCore.createCallBackFunction).toBeDefined();
	});
	it('Should return null and trigger error if no parameter', function() {
		spyOn(coC_Settings, 'error');
		expect(engineCore.createCallBackFunction()).toBe(null);
		expect(coC_Settings.error.calls.count()).toBe(1);
	});
	it('Should return null and trigger error if non function parameter', function() {
		spyOn(coC_Settings, 'error');
		expect(engineCore.createCallBackFunction( null, "test" )).toBe(null);
		expect(coC_Settings.error.calls.count()).toBe(1);
	});
	it('Should return function if function parameter without arg', function() {
		spyOn(coC_Settings, 'error');
		function TestObj() {
			this.test = 0;
		}
		var obj = new TestObj();
		var result = engineCore.createCallBackFunction( obj, function() {
			this.test = 1;
		} );
		expect(coC_Settings.error.calls.count()).toBe( 0 );
		expect(obj.test).toBe( 0 );
		result();
		expect(obj.test).toBe( 1 );
	});
	it('Should return function if function parameter with 1 arg', function() {
		spyOn(coC_Settings, 'error');
		function TestObj() {
			this.test = 0;
		}
		var obj = new TestObj();
		var result = engineCore.createCallBackFunction( obj, function( value ) {
			this.test = value;
		}, 3 );
		expect(coC_Settings.error.calls.count()).toBe( 0 );
		expect(obj.test).toBe( 0 );
		result();
		expect(obj.test).toBe( 3 );
	});
	it('Should return function if function parameter with multiple args', function() {
		spyOn(coC_Settings, 'error');
		function TestObj() {
			this.test1 = 0;
			this.test2 = 0;
		}
		var obj = new TestObj();
		var result = engineCore.createCallBackFunction( obj, function( value1, value2 ) {
			this.test1 = value1;
			this.test2 = value2;
		}, 3, 7 );
		expect(coC_Settings.error.calls.count()).toBe( 0 );
		expect(obj.test1).toBe( 0 );
		expect(obj.test2).toBe( 0 );
		result();
		expect(obj.test1).toBe( 3 );
		expect(obj.test2).toBe( 7 );
	});
	it('Should define addButton', function() {
		expect(engineCore.addButton).toBeDefined();
	});
	it('Should return trigger error if no function given', function() {
		spyOn(coC_Settings, 'error');
		spyOn(mainView, 'showBottomButton');
		engineCore.addButton( 0 , '', function() {} ); // Test for a call if migration didn't work
		expect(coC_Settings.error.calls.count()).toBe( 1 );
		expect(mainView.showBottomButton.calls.count()).toBe( 0 );
	});
	it('Should create button with function without argument', function() {
		spyOn(coC_Settings, 'error');
		var pos = null;
		var text = null;
		var toolTipText = null;
		spyOn(mainView, 'showBottomButton').and.callFake(function( _pos, _text, callback, _toolTipText ) {
			pos = _pos;
			text = _text;
			toolTipText = _toolTipText;
			callback();
		});
		function TestObj() {
			this.test = 0;
		}
		var obj = new TestObj();
		expect(obj.test).toBe( 0 );
		engineCore.addButton( 7 , 'test', obj, function() {
			this.test = 3;
		} );
		expect(coC_Settings.error.calls.count()).toBe( 0 );
		expect(mainView.showBottomButton.calls.count()).toBe( 1 );
		expect(obj.test).toBe( 3 );
		expect(pos).toBe( 7 );
		expect(text).toBe( 'test' );
		expect(toolTipText).toBe( 'test' );
	});
	it('Should create button with function with one argument', function() {
		spyOn(coC_Settings, 'error');
		var pos = null;
		var text = null;
		var toolTipText = null;
		spyOn(mainView, 'showBottomButton').and.callFake(function( _pos, _text, callback, _toolTipText ) {
			pos = _pos;
			text = _text;
			toolTipText = _toolTipText;
			callback();
		});
		function TestObj() {
			this.test = 0;
		}
		var obj = new TestObj();
		expect(obj.test).toBe( 0 );
		engineCore.addButton( 7 , 'test', obj, function(value) {
			this.test = value;
		}, 3 );
		expect(coC_Settings.error.calls.count()).toBe( 0 );
		expect(mainView.showBottomButton.calls.count()).toBe( 1 );
		expect(obj.test).toBe( 3 );
		expect(pos).toBe( 7 );
		expect(text).toBe( 'test' );
		expect(toolTipText).toBe( 'test' );
	});
	it('Should get the tooltip text from item description', function() {
		spyOn(coC_Settings, 'error');
		var pos = null;
		var text = null;
		var toolTipText = null;
		spyOn(mainView, 'showBottomButton').and.callFake(function( _pos, _text, callback, _toolTipText ) {
			pos = _pos;
			text = _text;
			toolTipText = _toolTipText;
			callback();
		});
		engineCore.addButton( 7 , 'C.Cloth x2', null, function() { } );
		expect(coC_Settings.error.calls.count()).toBe( 0 );
		expect(mainView.showBottomButton.calls.count()).toBe( 1 );
		expect(pos).toBe( 7 );
		expect(text).toBe( 'C.Cloth x2' );
		expect(toolTipText).toBe( 'These loose fitting and comfortable clothes allow you to move freely while protecting you from the elements.  (DEF) (Cost: 0)' );
	});
	it('Should define addButtonWithTooltip', function() {
		expect(engineCore.addButtonWithTooltip).toBeDefined();
	});
	it('Should return trigger error if no function given', function() {
		spyOn(coC_Settings, 'error');
		spyOn(mainView, 'showBottomButton');
		engineCore.addButtonWithTooltip( 0 , '', '', function() {} ); // Test for a call if migration didn't work
		expect(coC_Settings.error.calls.count()).toBe( 1 );
		expect(mainView.showBottomButton.calls.count()).toBe( 0 );
	});
	it('Should create button with function without argument', function() {
		spyOn(coC_Settings, 'error');
		var pos = null;
		var text = null;
		var toolTipText = null;
		spyOn(mainView, 'showBottomButton').and.callFake(function( _pos, _text, callback, _toolTipText ) {
			pos = _pos;
			text = _text;
			toolTipText = _toolTipText;
			callback();
		});
		function TestObj() {
			this.test = 0;
		}
		var obj = new TestObj();
		expect(obj.test).toBe( 0 );
		engineCore.addButtonWithTooltip( 7 , 'test', 'aaa', obj, function() {
			this.test = 3;
		} );
		expect(coC_Settings.error.calls.count()).toBe( 0 );
		expect(mainView.showBottomButton.calls.count()).toBe( 1 );
		expect(obj.test).toBe( 3 );
		expect(pos).toBe( 7 );
		expect(text).toBe( 'test' );
		expect(toolTipText).toBe( 'aaa' );
	});
	it('Should create button with function with one argument', function() {
		spyOn(coC_Settings, 'error');
		var pos = null;
		var text = null;
		var toolTipText = null;
		spyOn(mainView, 'showBottomButton').and.callFake(function( _pos, _text, callback, _toolTipText ) {
			pos = _pos;
			text = _text;
			toolTipText = _toolTipText;
			callback();
		});
		function TestObj() {
			this.test = 0;
		}
		var obj = new TestObj();
		expect(obj.test).toBe( 0 );
		engineCore.addButtonWithTooltip( 7 , 'test', 'aaa', obj, function(value) {
			this.test = value;
		}, 3 );
		expect(coC_Settings.error.calls.count()).toBe( 0 );
		expect(mainView.showBottomButton.calls.count()).toBe( 1 );
		expect(obj.test).toBe( 3 );
		expect(pos).toBe( 7 );
		expect(text).toBe( 'test' );
		expect(toolTipText).toBe( 'aaa' );
	});
	it('Should NOT get the tooltip text from item description', function() {
		spyOn(coC_Settings, 'error');
		var pos = null;
		var text = null;
		var toolTipText = null;
		spyOn(mainView, 'showBottomButton').and.callFake(function( _pos, _text, callback, _toolTipText ) {
			pos = _pos;
			text = _text;
			toolTipText = _toolTipText;
			callback();
		});
		engineCore.addButtonWithTooltip( 7 , 'C.Cloth x2', 'aaa', null, function() { } );
		expect(coC_Settings.error.calls.count()).toBe( 0 );
		expect(mainView.showBottomButton.calls.count()).toBe( 1 );
		expect(pos).toBe( 7 );
		expect(text).toBe( 'C.Cloth x2' );
		expect(toolTipText).toBe( 'aaa' );
	});
	it('Should define choices', function() {
		expect(engineCore.choices).toBeDefined();
	});
	it('Should return trigger error if called with wrong argument number', function() {
		spyOn(log, 'error');
		spyOn(engineCore, 'addButton');
		spyOn(mainView, 'menu');
		engineCore.choices( '', function() {}, '', function() {}, '', function() {}, '', function() {} ); // Test for a call if migration didn't work
		expect(log.error.calls.count()).toBe( 1 );
		expect(mainView.menu.calls.count()).toBe( 0 );
		expect(engineCore.addButton.calls.count()).toBe( 0 );
	});
	it('Should create buttons with functions', function() {
		spyOn(log, 'error');
		var pos = [];
		var text = [];
		var toolTipText = [];
		spyOn(mainView, 'showBottomButton').and.callFake(function( _pos, _text, callback, _toolTipText ) {
			pos.push(_pos);
			text.push(_text);
			toolTipText.push(_toolTipText);
			callback();
		});
		function TestObj() {
			this.test = 0;
		}
		var obj1 = new TestObj();
		var obj2 = new TestObj();
		var obj3 = new TestObj();
		var obj4 = new TestObj();
		expect(obj1.test).toBe( 0 );
		expect(obj2.test).toBe( 0 );
		expect(obj3.test).toBe( 0 );
		expect(obj4.test).toBe( 0 );
		engineCore.choices(
			'test1', obj1, function() {
				this.test = 1;
			},
			'test2', obj2, function() {
				this.test = 3;
			},
			'test3', obj3, function() {
				this.test = 7;
			},
			'C.Cloth x2', obj4, function() {
				this.test = 11;
			}
		);
		expect(log.error.calls.count()).toBe( 0 );
		expect(mainView.showBottomButton.calls.count()).toBe( 4 );
		expect(obj1.test).toBe( 1 );
		expect(obj2.test).toBe( 3 );
		expect(obj3.test).toBe( 7 );
		expect(obj4.test).toBe( 11 );
		expect(pos).toEqual( [0, 1, 2, 3] );
		expect(text).toEqual( ['test1', 'test2', 'test3', 'C.Cloth x2'] );
		expect(toolTipText).toEqual( ['test1', 'test2', 'test3', 'These loose fitting and comfortable clothes allow you to move freely while protecting you from the elements.  (DEF) (Cost: 0)'] );
	});
	it('Should define choicesWithTooltip', function() {
		expect(engineCore.choicesWithTooltip).toBeDefined();
	});
	it('Should return trigger error if called with wrong argument number', function() {
		spyOn(log, 'error');
		spyOn(engineCore, 'addButton');
		spyOn(mainView, 'menu');
		engineCore.choicesWithTooltip( '', '', function() {}, '', '', function() {}, '', '', function() {} ); // Test for a call if migration didn't work
		expect(log.error.calls.count()).toBe( 1 );
		expect(mainView.menu.calls.count()).toBe( 0 );
		expect(engineCore.addButton.calls.count()).toBe( 0 );
	});
	it('Should create buttons with functions', function() {
		spyOn(log, 'error');
		var pos = [];
		var text = [];
		var toolTipText = [];
		spyOn(mainView, 'showBottomButton').and.callFake(function( _pos, _text, callback, _toolTipText ) {
			pos.push(_pos);
			text.push(_text);
			toolTipText.push(_toolTipText);
			callback();
		});
		function TestObj() {
			this.test = 0;
		}
		var obj1 = new TestObj();
		var obj2 = new TestObj();
		var obj3 = new TestObj();
		var obj4 = new TestObj();
		expect(obj1.test).toBe( 0 );
		expect(obj2.test).toBe( 0 );
		expect(obj3.test).toBe( 0 );
		expect(obj4.test).toBe( 0 );
		engineCore.choicesWithTooltip(
			'test1', 'aaa', obj1, function() {
				this.test = 1;
			},
			'test2', 'bbb', obj2, function() {
				this.test = 3;
			},
			'test3', 'ccc', obj3, function() {
				this.test = 7;
			},
			'C.Cloth x2', 'ddd', obj4, function() {
				this.test = 11;
			}
		);
		expect(log.error.calls.count()).toBe( 0 );
		expect(mainView.showBottomButton.calls.count()).toBe( 4 );
		expect(obj1.test).toBe( 1 );
		expect(obj2.test).toBe( 3 );
		expect(obj3.test).toBe( 7 );
		expect(obj4.test).toBe( 11 );
		expect(pos).toEqual( [0, 1, 2, 3] );
		expect(text).toEqual( ['test1', 'test2', 'test3', 'C.Cloth x2'] );
		expect(toolTipText).toEqual( ['aaa', 'bbb', 'ccc', 'ddd'] );
	});
	
	it('Should define doYesNo', function() {
		expect(engineCore.doYesNo).toBeDefined();
	});
	it('Should return trigger error if called with wrong argument number', function() {
		spyOn(log, 'error');
		spyOn(engineCore, 'addButton');
		spyOn(mainView, 'menu');
		engineCore.doYesNo( function() {}, function() {} ); // Test for a call if migration didn't work
		expect(log.error.calls.count()).toBe( 1 );
		expect(mainView.menu.calls.count()).toBe( 0 );
		expect(engineCore.addButton.calls.count()).toBe( 0 );
	});
	it('Should create buttons with functions', function() {
		spyOn(log, 'error');
		var pos = [];
		var text = [];
		var toolTipText = [];
		spyOn(mainView, 'showBottomButton').and.callFake(function( _pos, _text, callback, _toolTipText ) {
			pos.push(_pos);
			text.push(_text);
			toolTipText.push(_toolTipText);
			callback();
		});
		function TestObj() {
			this.test = 0;
		}
		var obj1 = new TestObj();
		var obj2 = new TestObj();
		expect(obj1.test).toBe( 0 );
		expect(obj2.test).toBe( 0 );
		engineCore.doYesNo(
			obj1, function() {
				this.test = 1;
			},
			obj2, function() {
				this.test = 3;
			}
		);
		expect(log.error.calls.count()).toBe( 0 );
		expect(mainView.showBottomButton.calls.count()).toBe( 2 );
		expect(obj1.test).toBe( 1 );
		expect(obj2.test).toBe( 3 );
		expect(pos).toEqual( [0, 1] );
		expect(text).toEqual( ['Yes', 'No'] );
		expect(toolTipText).toEqual( ['Yes', 'No'] );
	});
	it('Should define doNext', function() {
		expect(engineCore.doNext).toBeDefined();
	});
	it('Should trigger error if called with wrong argument number', function() {
		spyOn(log, 'error');
		spyOn(engineCore, 'addButton');
		spyOn(mainView, 'menu');
		engineCore.doNext( function() {} ); // Test for a call if migration didn't work
		expect(log.error.calls.count()).toBe( 1 );
		expect(mainView.menu.calls.count()).toBe( 0 );
		expect(engineCore.addButton.calls.count()).toBe( 0 );
	});
	it('Should do nothing if game is over', function() {
		spyOn(log, 'debug');
		spyOn(log, 'error');
		spyOn(engineCore, 'addButton');
		spyOn(mainView, 'menu');
		spyOn(mainView, 'getButtonText').and.callFake(function() { return 'Game Over'; });
		engineCore.doNext( null, function() {} ); // Test for a call if migration didn't work
		expect(log.debug.calls.count()).toBe( 1 );
		expect(log.error.calls.count()).toBe( 0 );
		expect(mainView.menu.calls.count()).toBe( 0 );
		expect(engineCore.addButton.calls.count()).toBe( 0 );
	});
	it('Should create button with function', function() {
		spyOn(log, 'error');
		var pos = [];
		var text = [];
		var toolTipText = [];
		spyOn(mainView, 'showBottomButton').and.callFake(function( _pos, _text, callback, _toolTipText ) {
			pos.push(_pos);
			text.push(_text);
			toolTipText.push(_toolTipText);
			callback();
		});
		function TestObj() {
			this.test = 0;
		}
		var obj1 = new TestObj();
		expect(obj1.test).toBe( 0 );
		engineCore.doNext(
			obj1, function() {
				this.test = 1;
			}
		);
		expect(log.error.calls.count()).toBe( 0 );
		expect(mainView.showBottomButton.calls.count()).toBe( 1 );
		expect(obj1.test).toBe( 1 );
		expect(pos).toEqual( [0] );
		expect(text).toEqual( ['Next'] );
		expect(toolTipText).toEqual( ['Next'] );
	});
	it('Should define hideUpDown', function() {
		expect(engineCore.hideUpDown).toBeDefined();
	});
	it('Should call mainview and reinitialize oldstats', function() {
		spyOn(mainView.statsView, 'hideUpDown');
		coc.player = new PlayerConstructor();
		var i = 1;
		expect(_.keys(coc.oldStats).length ).toBeGreaterThan( 0 );
		_.forOwn(coc.oldStats, function(value, key) {
			coc.oldStats[key] = i++;
		});
		_.forOwn(coc.oldStats, function( value ) {
			expect( value ).not.toBe( 0 );
		});
		engineCore.hideUpDown();
		expect(mainView.statsView.hideUpDown.calls.count()).toBe( 1 );
		_.forOwn(coc.oldStats, function( value ) {
			expect( value ).toBe( 0 );
		});
	});
	it('Should define physicalCost', function() {
		expect(engineCore.physicalCost).toBeDefined();
	});
	it('Should return the parameter if no modifier', function() {
		coc.player = new PlayerConstructor();
		expect(engineCore.physicalCost(5)).toBe( 5 );
	});
	it('Should apply modifiers on parameter', function() {
		coc.player = new PlayerConstructor();
		coc.player.createPerk( perkLib.IronMan );
		expect(engineCore.physicalCost(5)).toBe( 2.5 );
	});
	it('Should define spellCost', function() {
		expect(engineCore.spellCost).toBeDefined();
	});
	it('Should return the parameter if no modifier', function() {
		coc.player = new PlayerConstructor();
		expect(engineCore.spellCost(5)).toBe( 5 );
	});
	it('Should apply modifiers on parameter', function() {
		coc.player = new PlayerConstructor();
		coc.player.createPerk( perkLib.SpellcastingAffinity, 50 );
		expect(engineCore.spellCost(5)).toBe( 2.5 );
		coc.player.createPerk( perkLib.WizardsEndurance, 50 );
		expect(engineCore.spellCost(5)).toBe( 2 );
		coc.player.removePerk( perkLib.SpellcastingAffinity );
		expect(engineCore.spellCost(5)).toBe( 2.5 );
		coc.player.createPerk( perkLib.SpellcastingAffinity, 50 );
		coc.player.createPerk( perkLib.BloodMage, 50 );
		expect(engineCore.spellCost(10)).toBe( 5 );
		expect(engineCore.spellCost(5)).toBe( 5 );
		coc.player.createPerk( perkLib.HistoryScholar );
		expect(engineCore.spellCost(10)).toBe( 5 );
		expect(engineCore.spellCost(5)).toBe( 5 );
		coc.player.removePerk( perkLib.BloodMage );
		coc.player.removePerk( perkLib.SpellcastingAffinity );
		expect(engineCore.spellCost(5)).toBe( 2 );
		expect(engineCore.spellCost(2)).toBe( 2 );
	});
	it('Should define fatigue', function() {
		expect(engineCore.fatigue).toBeDefined();
	});
	it('Should apply fatigue increase without modifiers', function() {
		coc.player = new PlayerConstructor();
		spyOn(mainView.statsView, 'show');
		spyOn(mainView.statsView, 'showStatUp');
		spyOn(mainView.statsView, 'showStatDown');
		spyOn(engineCore, 'spellCost').and.callFake(function( mod ) { return mod; });
		spyOn(engineCore, 'physicalCost').and.callFake(function( mod ) { return mod; });
		expect(coc.player.fatigue).toBe( 0 );
		engineCore.fatigue(50);
		expect(coc.player.fatigue).toBe( 50 );
		expect(mainView.statsView.show.calls.count()).toBe(1);
		expect(mainView.statsView.showStatUp.calls.count()).toBe(1);
		expect(mainView.statsView.showStatUp).toHaveBeenCalledWith( 'fatigue' );
		expect(mainView.statsView.showStatDown.calls.count()).toBe(0);
		expect(engineCore.spellCost.calls.count()).toBe(0);
		expect(engineCore.physicalCost.calls.count()).toBe(0);
	});
	it('Should apply magical fatigue increase without modifiers', function() {
		coc.player = new PlayerConstructor();
		spyOn(mainView.statsView, 'show');
		spyOn(mainView.statsView, 'showStatUp');
		spyOn(mainView.statsView, 'showStatDown');
		spyOn(engineCore, 'spellCost').and.callFake(function( mod ) { return mod; });
		spyOn(engineCore, 'physicalCost').and.callFake(function( mod ) { return mod; });
		expect(coc.player.fatigue).toBe( 0 );
		engineCore.fatigue(50, 1);
		expect(coc.player.fatigue).toBe( 50 );
		expect(mainView.statsView.show.calls.count()).toBe(1);
		expect(mainView.statsView.showStatUp.calls.count()).toBe(1);
		expect(mainView.statsView.showStatUp).toHaveBeenCalledWith( 'fatigue' );
		expect(mainView.statsView.showStatDown.calls.count()).toBe(0);
		expect(engineCore.spellCost.calls.count()).toBe(1);
		expect(engineCore.spellCost).toHaveBeenCalledWith( 50 );
		expect(engineCore.physicalCost.calls.count()).toBe(0);
	});
	it('Should apply physical fatigue increase without modifiers', function() {
		coc.player = new PlayerConstructor();
		spyOn(mainView.statsView, 'show');
		spyOn(mainView.statsView, 'showStatUp');
		spyOn(mainView.statsView, 'showStatDown');
		spyOn(engineCore, 'spellCost').and.callFake(function( mod ) { return mod; });
		spyOn(engineCore, 'physicalCost').and.callFake(function( mod ) { return mod; });
		expect(coc.player.fatigue).toBe( 0 );
		engineCore.fatigue(50, 2);
		expect(coc.player.fatigue).toBe( 50 );
		expect(mainView.statsView.show.calls.count()).toBe(1);
		expect(mainView.statsView.showStatUp.calls.count()).toBe(1);
		expect(mainView.statsView.showStatUp).toHaveBeenCalledWith( 'fatigue' );
		expect(mainView.statsView.showStatDown.calls.count()).toBe(0);
		expect(engineCore.spellCost.calls.count()).toBe(0);
		expect(engineCore.physicalCost.calls.count()).toBe(1);
		expect(engineCore.physicalCost).toHaveBeenCalledWith( 50 );
	});
	it('Should apply fatigue decrease without modifiers', function() {
		coc.player = new PlayerConstructor();
		engineCore.fatigue(50);
		spyOn(mainView.statsView, 'show');
		spyOn(mainView.statsView, 'showStatUp');
		spyOn(mainView.statsView, 'showStatDown');
		spyOn(engineCore, 'spellCost').and.callFake(function( mod ) { return mod; });
		spyOn(engineCore, 'physicalCost').and.callFake(function( mod ) { return mod; });
		expect(coc.player.fatigue).toBe( 50 );
		engineCore.fatigue(-25);
		expect(coc.player.fatigue).toBe( 25 );
		expect(mainView.statsView.show.calls.count()).toBe(1);
		expect(mainView.statsView.showStatDown.calls.count()).toBe(1);
		expect(mainView.statsView.showStatDown).toHaveBeenCalledWith( 'fatigue' );
		expect(mainView.statsView.showStatUp.calls.count()).toBe(0);
		expect(engineCore.spellCost.calls.count()).toBe(0);
		expect(engineCore.physicalCost.calls.count()).toBe(0);
	});
	it('Should apply fatigue upper bound', function() {
		coc.player = new PlayerConstructor();
		engineCore.fatigue(50);
		spyOn(mainView.statsView, 'show');
		spyOn(mainView.statsView, 'showStatUp');
		spyOn(mainView.statsView, 'showStatDown');
		spyOn(engineCore, 'spellCost').and.callFake(function( mod ) { return mod; });
		spyOn(engineCore, 'physicalCost').and.callFake(function( mod ) { return mod; });
		expect(coc.player.fatigue).toBe( 50 );
		engineCore.fatigue(75);
		expect(coc.player.fatigue).toBe( 100 );
		expect(mainView.statsView.show.calls.count()).toBe(1);
		expect(mainView.statsView.showStatUp.calls.count()).toBe(1);
		expect(mainView.statsView.showStatUp).toHaveBeenCalledWith( 'fatigue' );
		expect(mainView.statsView.showStatDown.calls.count()).toBe(0);
		expect(engineCore.spellCost.calls.count()).toBe(0);
		expect(engineCore.physicalCost.calls.count()).toBe(0);
		mainView.statsView.show.calls.reset();
		mainView.statsView.showStatUp.calls.reset();
		mainView.statsView.showStatDown.calls.reset();
		engineCore.spellCost.calls.reset();
		engineCore.physicalCost.calls.reset();
		engineCore.fatigue(25);
		expect(coc.player.fatigue).toBe( 100 );
		expect(mainView.statsView.show.calls.count()).toBe(0);
		expect(mainView.statsView.showStatUp.calls.count()).toBe(0);
		expect(mainView.statsView.showStatDown.calls.count()).toBe(0);
		expect(engineCore.spellCost.calls.count()).toBe(0);
		expect(engineCore.physicalCost.calls.count()).toBe(0);
	});
	it('Should apply fatigue lower bound', function() {
		coc.player = new PlayerConstructor();
		engineCore.fatigue(50);
		spyOn(mainView.statsView, 'show');
		spyOn(mainView.statsView, 'showStatUp');
		spyOn(mainView.statsView, 'showStatDown');
		spyOn(engineCore, 'spellCost').and.callFake(function( mod ) { return mod; });
		spyOn(engineCore, 'physicalCost').and.callFake(function( mod ) { return mod; });
		expect(coc.player.fatigue).toBe( 50 );
		engineCore.fatigue(-75);
		expect(coc.player.fatigue).toBe( 0 );
		expect(mainView.statsView.show.calls.count()).toBe(1);
		expect(mainView.statsView.showStatDown.calls.count()).toBe(1);
		expect(mainView.statsView.showStatDown).toHaveBeenCalledWith( 'fatigue' );
		expect(mainView.statsView.showStatUp.calls.count()).toBe(0);
		expect(engineCore.spellCost.calls.count()).toBe(0);
		expect(engineCore.physicalCost.calls.count()).toBe(0);
		mainView.statsView.show.calls.reset();
		mainView.statsView.showStatUp.calls.reset();
		mainView.statsView.showStatDown.calls.reset();
		engineCore.spellCost.calls.reset();
		engineCore.physicalCost.calls.reset();
		engineCore.fatigue(-25);
		expect(coc.player.fatigue).toBe( 0 );
		expect(mainView.statsView.show.calls.count()).toBe(0);
		expect(mainView.statsView.showStatUp.calls.count()).toBe(0);
		expect(mainView.statsView.showStatDown.calls.count()).toBe(0);
		expect(engineCore.spellCost.calls.count()).toBe(0);
		expect(engineCore.physicalCost.calls.count()).toBe(0);
	});
	it('Should apply fatigue decrease with modifiers', function() {
		coc.player = new PlayerConstructor();
		coc.player.createPerk( perkLib.HistorySlacker, 50 );
		engineCore.fatigue(100);
		spyOn(mainView.statsView, 'show');
		spyOn(mainView.statsView, 'showStatUp');
		spyOn(mainView.statsView, 'showStatDown');
		spyOn(engineCore, 'spellCost').and.callFake(function( mod ) { return mod; });
		spyOn(engineCore, 'physicalCost').and.callFake(function( mod ) { return mod; });
		expect(coc.player.fatigue).toBe( 100 );
		engineCore.fatigue(-25);
		expect(coc.player.fatigue).toBe( 70 );
		expect(mainView.statsView.show.calls.count()).toBe(1);
		expect(mainView.statsView.showStatDown.calls.count()).toBe(1);
		expect(mainView.statsView.showStatDown).toHaveBeenCalledWith( 'fatigue' );
		expect(mainView.statsView.showStatUp.calls.count()).toBe(0);
		expect(engineCore.spellCost.calls.count()).toBe(0);
		expect(engineCore.physicalCost.calls.count()).toBe(0);
		coc.player.createPerk( perkLib.ControlledBreath, 50 );
		coc.player.cor = 29;
		mainView.statsView.show.calls.reset();
		mainView.statsView.showStatUp.calls.reset();
		mainView.statsView.showStatDown.calls.reset();
		engineCore.spellCost.calls.reset();
		engineCore.physicalCost.calls.reset();
		engineCore.fatigue(-25);
		expect(coc.player.fatigue).toBe( 37.5 );
		expect(mainView.statsView.show.calls.count()).toBe(1);
		expect(mainView.statsView.showStatDown.calls.count()).toBe(1);
		expect(mainView.statsView.showStatDown).toHaveBeenCalledWith( 'fatigue' );
		expect(mainView.statsView.showStatUp.calls.count()).toBe(0);
		expect(engineCore.spellCost.calls.count()).toBe(0);
		expect(engineCore.physicalCost.calls.count()).toBe(0);
		coc.player.cor = 30;
		mainView.statsView.show.calls.reset();
		mainView.statsView.showStatUp.calls.reset();
		mainView.statsView.showStatDown.calls.reset();
		engineCore.spellCost.calls.reset();
		engineCore.physicalCost.calls.reset();
		engineCore.fatigue(-25);
		expect(coc.player.fatigue).toBe( 7.5 );
		expect(mainView.statsView.show.calls.count()).toBe(1);
		expect(mainView.statsView.showStatDown.calls.count()).toBe(1);
		expect(mainView.statsView.showStatDown).toHaveBeenCalledWith( 'fatigue' );
		expect(mainView.statsView.showStatUp.calls.count()).toBe(0);
		expect(engineCore.spellCost.calls.count()).toBe(0);
		expect(engineCore.physicalCost.calls.count()).toBe(0);
		coc.player.cor = 29;
		coc.player.removePerk( perkLib.HistorySlacker );
		mainView.statsView.show.calls.reset();
		mainView.statsView.showStatUp.calls.reset();
		mainView.statsView.showStatDown.calls.reset();
		engineCore.spellCost.calls.reset();
		engineCore.physicalCost.calls.reset();
		engineCore.fatigue(-5);
		expect(coc.player.fatigue).toBe( 2 );
		expect(mainView.statsView.show.calls.count()).toBe(1);
		expect(mainView.statsView.showStatDown.calls.count()).toBe(1);
		expect(mainView.statsView.showStatDown).toHaveBeenCalledWith( 'fatigue' );
		expect(mainView.statsView.showStatUp.calls.count()).toBe(0);
		expect(engineCore.spellCost.calls.count()).toBe(0);
		expect(engineCore.physicalCost.calls.count()).toBe(0);
	});
	it('Should apply magical fatigue increase with BloodMage', function() {
		coc.player = new PlayerConstructor();
		coc.player.createPerk( perkLib.BloodMage, 50 );
		spyOn(mainView.statsView, 'show');
		spyOn(mainView.statsView, 'showStatUp');
		spyOn(mainView.statsView, 'showStatDown');
		spyOn(coc.player, 'takeDamage');
		spyOn(engineCore, 'spellCost').and.callFake(function( mod ) { return mod; });
		spyOn(engineCore, 'physicalCost').and.callFake(function( mod ) { return mod; });
		expect(coc.player.fatigue).toBe( 0 );
		engineCore.fatigue(50, 1);
		expect(coc.player.fatigue).toBe( 0 );
		expect(mainView.statsView.show.calls.count()).toBe(1);
		expect(mainView.statsView.showStatUp.calls.count()).toBe(0);
		expect(mainView.statsView.showStatDown.calls.count()).toBe(0);
		expect(engineCore.spellCost.calls.count()).toBe(1);
		expect(engineCore.spellCost).toHaveBeenCalledWith( 50 );
		expect(engineCore.physicalCost.calls.count()).toBe(0);
		expect(coc.player.takeDamage.calls.count()).toBe(1);
		expect(coc.player.takeDamage).toHaveBeenCalledWith( 50 );
	});
	it('Should define lustPercent', function() {
		expect(engineCore.lustPercent).toBeDefined();
	});
	it('Should reduce lust percent depending on player level and perks', function() {
		coc.player = new PlayerConstructor();
		coc.player.level = 1;
		var testLust = function(levelModifier, perkModifier, perkModifierMult) {
			if(perkModifierMult === undefined) {
				perkModifierMult = 1;
			}
			if(levelModifier < 20) {
				expect(engineCore.lustPercent()).toBe( Math.min( 100 - Math.min(0, perkModifier), Math.round( perkModifierMult * Math.max(25, 100 - levelModifier * 3 - perkModifier ) ) ) );
				coc.player.createStatusAffect( statusAffects.BlackCatBeer, 1 );
				expect(engineCore.lustPercent()).toBe( Math.min( 100 - Math.min(0, perkModifier), Math.round( perkModifierMult * ( Math.min( 100, 20 + Math.max(25, 100 - levelModifier * 3 - (perkModifier > 0 ? perkModifier : 0) ) ) - (perkModifier < 0 ? perkModifier : 0) ) ) ) );
				coc.player.removeStatusAffect( statusAffects.BlackCatBeer );
			} else {
				expect(engineCore.lustPercent()).toBe( Math.min( 100 - Math.min(0, perkModifier), Math.round( perkModifierMult * Math.max( 25, 40 - perkModifier ) ) ) );
				coc.player.createStatusAffect( statusAffects.BlackCatBeer, 1 );
				expect(engineCore.lustPercent()).toBe( Math.min( 100 - Math.min(0, perkModifier), Math.round( perkModifierMult * ( Math.min( 100, 20 + Math.max( 25, 40 - (perkModifier > 0 ? perkModifier : 0) ) ) - (perkModifier < 0 ? perkModifier : 0) ) ) ) );
				coc.player.removeStatusAffect( statusAffects.BlackCatBeer );
			}
		};
		_.forEach(_.range(30), function(value) {
			coc.player.level = 1 + value;
			expect(engineCore.lustPercent() >= 40).toBe( true );
			testLust(value, 0);
			coc.player.createPerk( perkLib.CorruptedLibido, 50 );
			testLust(value, 10);
			coc.player.removePerk( perkLib.CorruptedLibido );
			coc.player.createPerk( perkLib.Acclimation, 50 );
			testLust(value, 15);
			coc.player.removePerk( perkLib.Acclimation );
			coc.player.createPerk( perkLib.PurityBlessing, 50 );
			testLust(value, 5);
			coc.player.removePerk( perkLib.PurityBlessing );
			coc.player.createPerk( perkLib.Resistance, 50 );
			testLust(value, 10);
			coc.player.removePerk( perkLib.Resistance );
			coc.player.createPerk( perkLib.ChiReflowLust, 50 );
			testLust(value, 10);
			coc.player.createPerk( perkLib.PurityBlessing, 50 );
			testLust(value, 15);
			coc.player.createPerk( perkLib.Resistance, 50 );
			testLust(value, 25);
			coc.player.removePerk( perkLib.ChiReflowLust );
			testLust(value, 15);
			coc.player.removePerk( perkLib.Resistance );
			coc.player.createPerk( perkLib.CorruptedLibido, 50 );
			testLust(value, 15);
			coc.player.createPerk( perkLib.Acclimation, 50 );
			testLust(value, 30);
			coc.player.removePerk( perkLib.Acclimation );
			coc.player.removePerk( perkLib.CorruptedLibido );
			coc.player.removePerk( perkLib.PurityBlessing );
			coc.player.createPerk( perkLib.PentUp, 10 );
			testLust(value, -5);
			coc.player.removePerk( perkLib.PentUp );
			coc.player.createPerk( perkLib.PurityBlessing, 50 );
			testLust(value, 5);
			coc.player.createStatusAffect( statusAffects.BimboChampagne, 50 );
			testLust( value, 5, 0.75 );
			coc.player.createPerk( perkLib.BimboBody, 50 );
			testLust( value, 5, 0.75 );
			coc.player.removeStatusAffect( statusAffects.BimboChampagne );
			coc.player.createPerk( perkLib.BroBody, 50 );
			testLust( value, 5, 0.75 * 0.75 );
			coc.player.createPerk( perkLib.FutaForm, 50 );
			testLust( value, 5, 0.75 * 0.75 * 0.75 );
			coc.player.createPerk( perkLib.OmnibusGift, 50 );
			testLust( value, 5, 0.75 * 0.75 * 0.75 * 0.85 );
			coc.player.createPerk( perkLib.LuststickAdapted, 50 );
			testLust( value, 5, 0.75 * 0.75 * 0.75 * 0.85 * 0.9 );
			coc.player.removePerk( perkLib.BimboBody );
			testLust( value, 5, 0.75 * 0.75 * 0.85 * 0.9 );
			coc.player.removePerk( perkLib.BroBody );
			testLust( value, 5, 0.75 * 0.85 * 0.9 );
			coc.player.removePerk( perkLib.FutaForm );
			testLust( value, 5, 0.85 * 0.9 );
			coc.player.removePerk( perkLib.OmnibusGift );
			testLust( value, 5, 0.9 );
			coc.player.createStatusAffect( statusAffects.Berzerking, 50 );
			testLust( value, 5, 0.9 * 0.6 );
			coc.player.createPerk( perkLib.PureAndLoving, 50 );
			testLust( value, 5, 0.9 * 0.6 * 0.95 );
			coc.player.createStatusAffect( statusAffects.UmasMassage, 50, 0.75 );
			testLust( value, 5, 0.9 * 0.6 * 0.95 );
			coc.player.changeStatusValue( statusAffects.UmasMassage, 1, sceneLib.umasShop.MASSAGE_RELIEF );
			testLust( value, 5, 0.9 * 0.6 * 0.95 * 0.75 );
			coc.player.changeStatusValue( statusAffects.UmasMassage, 1, sceneLib.umasShop.MASSAGE_LUST );
			testLust( value, 5, 0.9 * 0.6 * 0.95 * 0.75 );
			coc.player.removePerk( perkLib.LuststickAdapted );
			testLust( value, 5, 0.6 * 0.95 * 0.75 );
			coc.player.removeStatusAffect( statusAffects.Berzerking );
			testLust( value, 5, 0.95 * 0.75 );
			coc.player.removePerk( perkLib.PureAndLoving );
			testLust( value, 5, 0.75 );
			coc.player.removeStatusAffect( statusAffects.UmasMassage );
			coc.player.removePerk( perkLib.PurityBlessing );
		});
	});
	it('Should define dynStats', function() {
		expect(engineCore.dynStats).toBeDefined();
	});
	it('Should trigger error if bad parameters number', function() {
		coc.player = new PlayerConstructor();
		coc.player.str = 50;
		coc.player.tou = 50;
		coc.player.spe = 50;
		coc.player.inte = 50;
		coc.player.lib = 50;
		coc.player.sens = 50;
		coc.player.lust = 50;
		coc.player.cor = 50;
		spyOn(engineCore, 'stats');
		spyOn(log, 'error');
		engineCore.dynStats(20);
		expect(log.error.calls.count()).toBe(1);
		expect(log.error).toHaveBeenCalledWith( 'dynStats aborted. Keys->Arguments could not be matched' );
		log.error.calls.reset();
		engineCore.dynStats('str', 20, 30);
		expect(engineCore.stats.calls.count()).toBe(0);
		expect(log.error.calls.count()).toBe(1);
		expect(log.error).toHaveBeenCalledWith( 'dynStats aborted. Keys->Arguments could not be matched' );
	});
	it('Should trigger error if bad stat value', function() {
		coc.player = new PlayerConstructor();
		coc.player.str = 50;
		coc.player.tou = 50;
		coc.player.spe = 50;
		coc.player.inte = 50;
		coc.player.lib = 50;
		coc.player.sens = 50;
		coc.player.lust = 50;
		coc.player.cor = 50;
		spyOn(engineCore, 'stats');
		spyOn(log, 'error');
		engineCore.dynStats('str', 'test');
		expect(log.error.calls.count()).toBe(1);
		expect(log.error).toHaveBeenCalledWith( 'dynStats aborted. Next argument after argName is invalid! arg is type test' );
		log.error.calls.reset();
		engineCore.dynStats('str', '20');
		expect(log.error.calls.count()).toBe(1);
		expect(log.error).toHaveBeenCalledWith( 'dynStats aborted. Next argument after argName is invalid! arg is type 20' );
		log.error.calls.reset();
		engineCore.dynStats('str', true, 'tou', 20, 'spe', 'test');
		expect(log.error.calls.count()).toBe(1);
		expect(log.error).toHaveBeenCalledWith( 'dynStats aborted. Next argument after argName is invalid! arg is type test' );
		log.error.calls.reset();
		engineCore.dynStats('str', true, 'tou', 20, 'spe', null);
		expect(log.error.calls.count()).toBe(1);
		expect(log.error).toHaveBeenCalledWith( 'dynStats aborted. Next argument after argName is invalid! arg is type null' );
		log.error.calls.reset();
		expect(engineCore.stats.calls.count()).toBe(0);
	});
	it('Should trigger error if bad stat name', function() {
		coc.player = new PlayerConstructor();
		coc.player.str = 50;
		coc.player.tou = 50;
		coc.player.spe = 50;
		coc.player.inte = 50;
		coc.player.lib = 50;
		coc.player.sens = 50;
		coc.player.lust = 50;
		coc.player.cor = 50;
		spyOn(engineCore, 'stats');
		spyOn(log, 'error');
		engineCore.dynStats('star', 20);
		expect(log.error.calls.count()).toBe(1);
		expect(log.error).toHaveBeenCalledWith( 'Couldn\'t find the arg name star in the index arrays. Welp!' );
		log.error.calls.reset();
		engineCore.dynStats('str', 20, 'test', 40);
		expect(log.error.calls.count()).toBe(1);
		expect(log.error).toHaveBeenCalledWith( 'Couldn\'t find the arg name test in the index arrays. Welp!' );
		expect(engineCore.stats.calls.count()).toBe(0);
	});
	it('Should trigger error if non string stat name', function() {
		coc.player = new PlayerConstructor();
		coc.player.str = 50;
		coc.player.tou = 50;
		coc.player.spe = 50;
		coc.player.inte = 50;
		coc.player.lib = 50;
		coc.player.sens = 50;
		coc.player.lust = 50;
		coc.player.cor = 50;
		spyOn(engineCore, 'stats');
		spyOn(log, 'error');
		engineCore.dynStats(20, 20);
		expect(log.error.calls.count()).toBe(1);
		expect(log.error).toHaveBeenCalledWith( 'dynStats aborted. Expected a key and got SHIT' );
		log.error.calls.reset();
		engineCore.dynStats('str', 20, true, 40);
		expect(log.error.calls.count()).toBe(1);
		expect(log.error).toHaveBeenCalledWith( 'dynStats aborted. Expected a key and got SHIT' );
		expect(engineCore.stats.calls.count()).toBe(0);
	});
	it('Should call EngineCore.stats with good arguments', function() {
		coc.player = new PlayerConstructor();
		coc.player.str = 50;
		coc.player.tou = 50;
		coc.player.spe = 50;
		coc.player.inte = 50;
		coc.player.lib = 50;
		coc.player.sens = 50;
		coc.player.lust = 50;
		coc.player.cor = 50;
		spyOn(engineCore, 'stats');
		spyOn(log, 'error');
		engineCore.dynStats('spe', 20, 'lib+', 20, 'str*', 2, 'cor/', 2, 'tou=', 10, 'int', 10);
		expect(log.error.calls.count()).toBe(0);
		expect(engineCore.stats.calls.count()).toBe(1);
		expect(engineCore.stats).toHaveBeenCalledWith( 50, -40, 20, 10, 20, 0, 0, -25, true, false );
		engineCore.stats.calls.reset();
		engineCore.dynStats('spe', 20, 'lib+', 20, 'str*', 2, 'cor/', 2, 'res', false, 'bim', true, 'tou=', 10, 'int', 10);
		expect(log.error.calls.count()).toBe(0);
		expect(engineCore.stats.calls.count()).toBe(1);
		expect(engineCore.stats).toHaveBeenCalledWith( 50, -40, 20, 10, 20, 0, 0, -25, false, true );
		engineCore.stats.calls.reset();
		engineCore.dynStats('speed', 20, 'sensitivity+', 20, 'strength*', 2, 'lust/', 2, 'resisted', false, 'noBimbo', true, 'toughness=', 10, 'intellect', 10);
		expect(log.error.calls.count()).toBe(0);
		expect(engineCore.stats.calls.count()).toBe(1);
		expect(engineCore.stats).toHaveBeenCalledWith( 50, -40, 20, 10, 0, 20, -25, 0, false, true );
	});
	it('Should define _addStr', function() {
		expect(engineCore._addStr).toBeDefined();
	});
	it('Should edit player str', function() {
		coc.player = new PlayerConstructor();
		coc.player.str = 50;
		coc.oldStats.str = 0;
		engineCore._addStr( 25 );
		expect(coc.player.str).toBe(75);
		expect(coc.oldStats.str).toBe(50);
		engineCore._addStr( 50 );
		expect(coc.player.str).toBe(100);
		expect(coc.oldStats.str).toBe(75);
		engineCore._addStr( -150 );
		expect(coc.player.str).toBe(1);
		expect(coc.oldStats.str).toBe(100);
		coc.player.createPerk( perkLib.Strong, 2 );
		engineCore._addStr( 10 );
		expect(coc.player.str).toBe(31);
		expect(coc.oldStats.str).toBe(1);
		coc.player.removePerk( perkLib.Strong );
		coc.player.createPerk( perkLib.ChiReflowSpeed );
		engineCore._addStr( 100 );
		expect(coc.player.str).toBe(60);
		expect(coc.oldStats.str).toBe(31);
		coc.player.removePerk( perkLib.ChiReflowSpeed );
	});
	it('Should define _addTou', function() {
		expect(engineCore._addTou).toBeDefined();
	});
	it('Should edit player tou', function() {
		coc.player = new PlayerConstructor();
		coc.player.tou = 50;
		coc.oldStats.tou = 0;
		spyOn(engineCore, 'HPChange');
		engineCore._addTou( 25 );
		expect(coc.player.tou).toBe(75);
		expect(coc.oldStats.tou).toBe(50);
		expect(engineCore.HPChange.calls.count()).toBe(1);
		expect(engineCore.HPChange).toHaveBeenCalledWith(50, false);
		engineCore.HPChange.calls.reset();
		engineCore._addTou( 50 );
		expect(coc.player.tou).toBe(100);
		expect(coc.oldStats.tou).toBe(75);
		expect(engineCore.HPChange.calls.count()).toBe(1);
		expect(engineCore.HPChange).toHaveBeenCalledWith(50, false);
		engineCore.HPChange.calls.reset();
		engineCore._addTou( -150 );
		expect(coc.player.tou).toBe(1);
		expect(coc.oldStats.tou).toBe(100);
		expect(engineCore.HPChange.calls.count()).toBe(1);
		expect(engineCore.HPChange).toHaveBeenCalledWith(-198, false);
		engineCore.HPChange.calls.reset();
		coc.player.createPerk( perkLib.Tough, 2 );
		engineCore._addTou( 10 );
		expect(coc.player.tou).toBe(31);
		expect(coc.oldStats.tou).toBe(1);
		expect(engineCore.HPChange.calls.count()).toBe(1);
		expect(engineCore.HPChange).toHaveBeenCalledWith(60, false);
		coc.player.removePerk( perkLib.Tough );
	});
	it('Should define _addSpe', function() {
		expect(engineCore._addSpe).toBeDefined();
	});
	it('Should edit player spe', function() {
		coc.player = new PlayerConstructor();
		coc.player.spe = 50;
		coc.oldStats.spe = 0;
		engineCore._addSpe( 25 );
		expect(coc.player.spe).toBe(75);
		expect(coc.oldStats.spe).toBe(50);
		engineCore._addSpe( 50 );
		expect(coc.player.spe).toBe(100);
		expect(coc.oldStats.spe).toBe(75);
		engineCore._addSpe( -150 );
		expect(coc.player.spe).toBe(1);
		expect(coc.oldStats.spe).toBe(100);
		coc.player.createPerk( perkLib.Fast, 2 );
		engineCore._addSpe( 10 );
		expect(coc.player.spe).toBe(31);
		expect(coc.oldStats.spe).toBe(1);
		coc.player.removePerk( perkLib.Fast );
		coc.player.createPerk( perkLib.ChiReflowSpeed );
		engineCore._addSpe( -20 );
		expect(coc.player.spe).toBe(21);
		expect(coc.oldStats.spe).toBe(31);
		coc.player.removePerk( perkLib.ChiReflowSpeed );
		coc.player.createPerk( perkLib.ChiReflowDefense );
		engineCore._addSpe( 100 );
		expect(coc.player.spe).toBe(60);
		expect(coc.oldStats.spe).toBe(21);
		coc.player.removePerk( perkLib.ChiReflowDefense );
	});
	it('Should define _addIntel', function() {
		expect(engineCore._addIntel).toBeDefined();
	});
	it('Should edit player intellect', function() {
		coc.player = new PlayerConstructor();
		coc.player.inte = 50;
		coc.oldStats.inte = 0;
		engineCore._addIntel( 25, true );
		expect(coc.player.inte).toBe(75);
		expect(coc.oldStats.inte).toBe(50);
		engineCore._addIntel( 50, true );
		expect(coc.player.inte).toBe(100);
		expect(coc.oldStats.inte).toBe(75);
		engineCore._addIntel( -150, true );
		expect(coc.player.inte).toBe(1);
		expect(coc.oldStats.inte).toBe(100);
		coc.player.createPerk( perkLib.Smart, 2 );
		engineCore._addIntel( 10 );
		expect(coc.player.inte).toBe(31);
		expect(coc.oldStats.inte).toBe(1);
		coc.player.removePerk( perkLib.Smart );
		engineCore._addIntel( -10, false );
		expect(coc.player.inte).toBe(21);
		expect(coc.oldStats.inte).toBe(31);
		engineCore._addIntel( 9, false );
		expect(coc.player.inte).toBe(30);
		expect(coc.oldStats.inte).toBe(21);
		coc.player.createPerk( perkLib.FutaFaculties );
		engineCore._addIntel( 20, false );
		expect(coc.player.inte).toBe(40);
		expect(coc.oldStats.inte).toBe(30);
		engineCore._addIntel( -15, false );
		expect(coc.player.inte).toBe(10);
		expect(coc.oldStats.inte).toBe(40);
		coc.player.createPerk( perkLib.BimboBrains );
		coc.player.createPerk( perkLib.BroBrains );
		engineCore._addIntel( 40, false );
		expect(coc.player.inte).toBe(30);
		expect(coc.oldStats.inte).toBe(10);
		engineCore._addIntel( -10, false );
		expect(coc.player.inte).toBe(10);
		expect(coc.oldStats.inte).toBe(30);
		coc.player.removePerk( perkLib.FutaFaculties );
		engineCore._addIntel( 40, false );
		expect(coc.player.inte).toBe(30);
		expect(coc.oldStats.inte).toBe(10);
		engineCore._addIntel( -10, false );
		expect(coc.player.inte).toBe(10);
		expect(coc.oldStats.inte).toBe(30);
		coc.player.removePerk( perkLib.BimboBrains );
		engineCore._addIntel( 40, false );
		expect(coc.player.inte).toBe(30);
		expect(coc.oldStats.inte).toBe(10);
		engineCore._addIntel( -10, false );
		expect(coc.player.inte).toBe(10);
		expect(coc.oldStats.inte).toBe(30);
		coc.player.removePerk( perkLib.BroBrains );
		coc.player.createPerk( perkLib.BimboBrains );
		engineCore._addIntel( 40, false );
		expect(coc.player.inte).toBe(30);
		expect(coc.oldStats.inte).toBe(10);
		engineCore._addIntel( -10, false );
		expect(coc.player.inte).toBe(10);
		expect(coc.oldStats.inte).toBe(30);
		coc.player.removePerk( perkLib.BimboBrains );
	});
	it('Should define _addLib', function() {
		expect(engineCore._addLib).toBeDefined();
	});
	it('Should edit player libido', function() {
		coc.player = new PlayerConstructor();
		coc.player.lib = 50;
		coc.oldStats.lib = 0;
		coc.player.armor = armorLib.COMFORTABLE_UNDERCLOTHES;
		coc.player.gender = 1;
		var minLust = 0;
		spyOn(coc.player, 'minLust').and.callFake(function() { return minLust; });
		engineCore._addLib( 25, true );
		expect(coc.player.lib).toBe(75);
		expect(coc.oldStats.lib).toBe(50);
		engineCore._addLib( 50, true );
		expect(coc.player.lib).toBe(100);
		expect(coc.oldStats.lib).toBe(75);
		engineCore._addLib( -150, true );
		expect(coc.player.lib).toBe(15);
		expect(coc.oldStats.lib).toBe(100);
		coc.player.gender = 2;
		engineCore._addLib( -150, true );
		expect(coc.player.lib).toBe(15);
		expect(coc.oldStats.lib).toBe(15);
		coc.player.gender = 0;
		engineCore._addLib( -150, true );
		expect(coc.player.lib).toBe(10);
		expect(coc.oldStats.lib).toBe(15);
		minLust = 30;
		engineCore._addLib( -150, true );
		expect(coc.player.lib).toBe(20);
		expect(coc.oldStats.lib).toBe(10);
		coc.player.createPerk( perkLib.Lusty, 2 );
		engineCore._addLib( 7, true );
		expect(coc.player.lib).toBe(41);
		expect(coc.oldStats.lib).toBe(20);
		coc.player.removePerk( perkLib.Lusty );
		coc.player.armor = armorLib.LMARMOR;
		engineCore._addLib( -5, true );
		expect(coc.player.lib).toBe(50);
		expect(coc.oldStats.lib).toBe(41);
		coc.player.armor = armorLib.COMFORTABLE_UNDERCLOTHES;
		coc.player.createPerk( perkLib.PurityBlessing );
		engineCore._addLib( 12, true );
		expect(coc.player.lib).toBe(59);
		expect(coc.oldStats.lib).toBe(50);
		coc.player.removePerk( perkLib.PurityBlessing );
		coc.player.createPerk( perkLib.ChiReflowLust );
		engineCore._addLib( 10, true );
		expect(coc.player.lib).toBe(70);
		expect(coc.oldStats.lib).toBe(59);
		coc.player.removePerk( perkLib.ChiReflowLust );
		
		engineCore._addLib( -10, false );
		expect(coc.player.lib).toBe(60);
		expect(coc.oldStats.lib).toBe(70);
		engineCore._addLib( 10, false );
		expect(coc.player.lib).toBe(70);
		expect(coc.oldStats.lib).toBe(60);
		coc.player.createPerk( perkLib.FutaForm );
		engineCore._addLib( 10, false );
		expect(coc.player.lib).toBe(90);
		expect(coc.oldStats.lib).toBe(70);
		engineCore._addLib( -40, false );
		expect(coc.player.lib).toBe(70);
		expect(coc.oldStats.lib).toBe(90);
		coc.player.createPerk( perkLib.BimboBody );
		coc.player.createPerk( perkLib.BroBody );
		engineCore._addLib( 10, false );
		expect(coc.player.lib).toBe(90);
		expect(coc.oldStats.lib).toBe(70);
		engineCore._addLib( -40, false );
		expect(coc.player.lib).toBe(70);
		expect(coc.oldStats.lib).toBe(90);
		coc.player.removePerk( perkLib.FutaForm );
		engineCore._addLib( 10, false );
		expect(coc.player.lib).toBe(90);
		expect(coc.oldStats.lib).toBe(70);
		engineCore._addLib( -40, false );
		expect(coc.player.lib).toBe(70);
		expect(coc.oldStats.lib).toBe(90);
		coc.player.removePerk( perkLib.BimboBody );
		engineCore._addLib( 10, false );
		expect(coc.player.lib).toBe(90);
		expect(coc.oldStats.lib).toBe(70);
		engineCore._addLib( -40, false );
		expect(coc.player.lib).toBe(70);
		expect(coc.oldStats.lib).toBe(90);
		coc.player.removePerk( perkLib.BroBrains );
		coc.player.createPerk( perkLib.BroBody );
		engineCore._addLib( 10, false );
		expect(coc.player.lib).toBe(90);
		expect(coc.oldStats.lib).toBe(70);
		engineCore._addLib( -40, false );
		expect(coc.player.lib).toBe(70);
		expect(coc.oldStats.lib).toBe(90);
		coc.player.removePerk( perkLib.BimboBody );
	});
	
	it('Should define _addSens', function() {
		expect(engineCore._addSens).toBeDefined();
	});
	it('Should edit player sensitivity', function() {
		coc.player = new PlayerConstructor();
		coc.player.sens = 50;
		coc.oldStats.sens = 0;
		engineCore._addSens( 10 );
		expect(coc.player.sens).toBe(60);
		expect(coc.oldStats.sens).toBe(50);
		engineCore._addSens( 40 );
		expect(coc.player.sens).toBe(80);
		expect(coc.oldStats.sens).toBe(60);
		engineCore._addSens( 44 );
		expect(coc.player.sens).toBe(91);
		expect(coc.oldStats.sens).toBe(80);
		engineCore._addSens( 8 );
		expect(coc.player.sens).toBe(92);
		expect(coc.oldStats.sens).toBe(91);
		engineCore._addSens( 150 );
		expect(coc.player.sens).toBe(100);
		expect(coc.oldStats.sens).toBe(92);
		engineCore._addSens( -2 );
		expect(coc.player.sens).toBe(84);
		expect(coc.oldStats.sens).toBe(100);
		engineCore._addSens( -3 );
		expect(coc.player.sens).toBe(72);
		expect(coc.oldStats.sens).toBe(84);
		engineCore._addSens( -11 );
		expect(coc.player.sens).toBe(50);
		expect(coc.oldStats.sens).toBe(72);
		engineCore._addSens( -10 );
		expect(coc.player.sens).toBe(40);
		expect(coc.oldStats.sens).toBe(50);
		engineCore._addSens( -100 );
		expect(coc.player.sens).toBe(10);
		expect(coc.oldStats.sens).toBe(40);
		
		coc.player.createPerk( perkLib.Sensitive, 2 );
		engineCore._addSens( 10 );
		expect(coc.player.sens).toBe(40);
		expect(coc.oldStats.sens).toBe(10);
		coc.player.removePerk( perkLib.Sensitive );
		
		coc.player.createPerk( perkLib.ChiReflowLust );
		engineCore._addSens( 10 );
		expect(coc.player.sens).toBe(51);
		expect(coc.oldStats.sens).toBe(40);
		coc.player.removePerk( perkLib.ChiReflowLust );
	});
	it('Should define _addLust', function() {
		expect(engineCore._addLust).toBeDefined();
	});
	it('Should edit player lust', function() {
		coc.player = new PlayerConstructor();
		coc.player.lust = 50;
		coc.oldStats.lust = 0;
		var lustPercent = 100;
		var minLust = 5;
		coc.flags[ flags.EASY_MODE_ENABLE_FLAG ] = false;
		spyOn(engineCore, 'lustPercent').and.callFake(function() { return lustPercent; });
		spyOn(coc.player, 'minLust').and.callFake(function() { return minLust; });
		engineCore._addLust( 10, false );
		expect(coc.player.lust).toBe(60);
		expect(coc.oldStats.lust).toBe(50);
		engineCore._addLust( 150, false );
		expect(coc.player.lust).toBe(100);
		expect(coc.oldStats.lust).toBe(60);
		engineCore._addLust( -150, false );
		expect(coc.player.lust).toBe(5);
		expect(coc.oldStats.lust).toBe(100);
		minLust = 10;
		engineCore._addLust( -150, false );
		expect(coc.player.lust).toBe(10);
		expect(coc.oldStats.lust).toBe(5);
		coc.player.createStatusAffect( statusAffects.Infested );
		engineCore._addLust( -150, false );
		expect(coc.player.lust).toBe(50);
		expect(coc.oldStats.lust).toBe(10);
		coc.player.removeStatusAffect( statusAffects.Infested );
		engineCore._addLust( 10 );
		expect(coc.player.lust).toBe(60);
		expect(coc.oldStats.lust).toBe(50);
		engineCore._addLust( 10, true );
		expect(coc.player.lust).toBe(70);
		expect(coc.oldStats.lust).toBe(60);
		lustPercent = 50;
		engineCore._addLust( 10 );
		expect(coc.player.lust).toBe(75);
		expect(coc.oldStats.lust).toBe(70);
		engineCore._addLust( 10, true );
		expect(coc.player.lust).toBe(80);
		expect(coc.oldStats.lust).toBe(75);
		lustPercent = 100;
		coc.flags[ flags.EASY_MODE_ENABLE_FLAG ] = true;
		engineCore._addLust( 10 );
		expect(coc.player.lust).toBe(85);
		expect(coc.oldStats.lust).toBe(80);
		engineCore._addLust( 10, true );
		expect(coc.player.lust).toBe(90);
		expect(coc.oldStats.lust).toBe(85);
		coc.flags[ flags.EASY_MODE_ENABLE_FLAG ] = false;
	});
	it('Should define _addCor', function() {
		expect(engineCore._addCor).toBeDefined();
	});
	it('Should edit player corruption', function() {
		coc.player = new PlayerConstructor();
		coc.player.cor = 50;
		coc.oldStats.cor = 0;
		engineCore._addCor( 25 );
		expect(coc.player.cor).toBe(75);
		expect(coc.oldStats.cor).toBe(50);
		engineCore._addCor( 50 );
		expect(coc.player.cor).toBe(100);
		expect(coc.oldStats.cor).toBe(75);
		engineCore._addCor( -150 );
		expect(coc.player.cor).toBe(0);
		expect(coc.oldStats.cor).toBe(100);
		
		coc.player.createPerk( perkLib.PurityBlessing );
		engineCore._addCor( 10 );
		expect(coc.player.cor).toBe(5);
		expect(coc.oldStats.cor).toBe(0);
		coc.player.createPerk( perkLib.PureAndLoving );
		engineCore._addCor( 8 );
		expect(coc.player.cor).toBe(8);
		expect(coc.oldStats.cor).toBe(5);
		coc.player.removePerk( perkLib.PurityBlessing );
		engineCore._addCor( 12 );
		expect(coc.player.cor).toBe(17);
		expect(coc.oldStats.cor).toBe(8);
		coc.player.removePerk( perkLib.PureAndLoving );
	});
	it('Should define stats', function() {
		expect(engineCore.stats).toBeDefined();
	});
	it('Should edit player stats', function() {
		spyOn(engineCore, '_addStr');
		spyOn(engineCore, '_addTou');
		spyOn(engineCore, '_addSpe');
		spyOn(engineCore, '_addIntel');
		spyOn(engineCore, '_addLib');
		spyOn(engineCore, '_addSens');
		spyOn(engineCore, '_addLust');
		spyOn(engineCore, '_addCor');
		spyOn(mainView.statsView, 'showUpDown');
		spyOn(mainView.statsView, 'show');
		
		engineCore.stats(1, 2, 3, 4, 5, 6, 7, 8, true, false);
		
		expect(engineCore._addStr.calls.count()).toBe(1);
		expect(engineCore._addStr).toHaveBeenCalledWith( 1 );
		expect(engineCore._addTou.calls.count()).toBe(1);
		expect(engineCore._addTou).toHaveBeenCalledWith( 2 );
		expect(engineCore._addSpe.calls.count()).toBe(1);
		expect(engineCore._addSpe).toHaveBeenCalledWith( 3 );
		expect(engineCore._addIntel.calls.count()).toBe(1);
		expect(engineCore._addIntel).toHaveBeenCalledWith( 4, false );
		expect(engineCore._addLib.calls.count()).toBe(1);
		expect(engineCore._addLib).toHaveBeenCalledWith( 5, false );
		expect(engineCore._addSens.calls.count()).toBe(1);
		expect(engineCore._addSens).toHaveBeenCalledWith( 6 );
		expect(engineCore._addLust.calls.count()).toBe(1);
		expect(engineCore._addLust).toHaveBeenCalledWith( 7, true );
		expect(engineCore._addCor.calls.count()).toBe(1);
		expect(engineCore._addCor).toHaveBeenCalledWith( 8 );
		expect(mainView.statsView.showUpDown.calls.count()).toBe(1);
		expect(mainView.statsView.show.calls.count()).toBe(1);
	});
});