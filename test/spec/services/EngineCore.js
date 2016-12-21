'use strict';

describe('Factory: EngineCore', function() {
	beforeEach(module('cocjs'));
	var engineCore;
	var coc;
	var perkLib;
	var mainView;
	var coC_Settings;
	beforeEach(inject(function(EngineCore, CoC, kFLAGS, PerkLib, MainView, CoC_Settings) {
		engineCore = EngineCore;
		coc = CoC;
		perkLib = PerkLib;
		mainView = MainView;
		coC_Settings = CoC_Settings;
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
		var historyHealer = -1;
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
		historyHealer = 1;
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
	it('should return null and trigger error if no parameter', function() {
		spyOn(coC_Settings, 'error');
		expect(engineCore.createCallBackFunction()).toBe(null);
		expect(coC_Settings.error.calls.count()).toBe(1);
	});
	it('should return null and trigger error if non function parameter', function() {
		spyOn(coC_Settings, 'error');
		expect(engineCore.createCallBackFunction( null, "test" )).toBe(null);
		expect(coC_Settings.error.calls.count()).toBe(1);
	});
	it('should return function if function parameter without arg', function() {
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
	it('should return function if function parameter with 1 arg', function() {
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
	it('should return function if function parameter with multiple args', function() {
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
	it('should return trigger error if no function given', function() {
		spyOn(coC_Settings, 'error');
		spyOn(mainView, 'showBottomButton');
		engineCore.addButton( 0 , '', function() {} ); // Test for a call if migration didn't work
		expect(coC_Settings.error.calls.count()).toBe( 1 );
		expect(mainView.showBottomButton.calls.count()).toBe( 0 );
	});
	it('should create button with function without argument', function() {
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
	it('should create button with function with one argument', function() {
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
	it('should get the tooltip text from item description', function() {
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
	it('should return trigger error if no function given', function() {
		spyOn(coC_Settings, 'error');
		spyOn(mainView, 'showBottomButton');
		engineCore.addButtonWithTooltip( 0 , '', '', function() {} ); // Test for a call if migration didn't work
		expect(coC_Settings.error.calls.count()).toBe( 1 );
		expect(mainView.showBottomButton.calls.count()).toBe( 0 );
	});
	it('should create button with function without argument', function() {
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
	it('should create button with function with one argument', function() {
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
	it('should NOT get the tooltip text from item description', function() {
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
});