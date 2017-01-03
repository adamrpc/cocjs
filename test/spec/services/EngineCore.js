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
	beforeEach(inject(function( $log, EngineCore, CoC, kFLAGS, PerkLib, MainView, CoC_Settings, Player, StatusAffects, SceneLib) {
		log = $log;
		engineCore = EngineCore;
		coc = CoC;
		perkLib = PerkLib;
		mainView = MainView;
		coC_Settings = CoC_Settings;
		PlayerConstructor = Player;
		statusAffects = StatusAffects;
		sceneLib = SceneLib;
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
	it('Should define choices', function() {
		expect(engineCore.choices).toBeDefined();
	});
	it('should return trigger error if called with wrong argument number', function() {
		spyOn(log, 'error');
		spyOn(engineCore, 'addButton');
		spyOn(mainView, 'menu');
		engineCore.choices( '', function() {}, '', function() {}, '', function() {}, '', function() {} ); // Test for a call if migration didn't work
		expect(log.error.calls.count()).toBe( 1 );
		expect(mainView.menu.calls.count()).toBe( 0 );
		expect(engineCore.addButton.calls.count()).toBe( 0 );
	});
	it('should create buttons with functions', function() {
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
	it('should return trigger error if called with wrong argument number', function() {
		spyOn(log, 'error');
		spyOn(engineCore, 'addButton');
		spyOn(mainView, 'menu');
		engineCore.choicesWithTooltip( '', '', function() {}, '', '', function() {}, '', '', function() {} ); // Test for a call if migration didn't work
		expect(log.error.calls.count()).toBe( 1 );
		expect(mainView.menu.calls.count()).toBe( 0 );
		expect(engineCore.addButton.calls.count()).toBe( 0 );
	});
	it('should create buttons with functions', function() {
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
	it('should return trigger error if called with wrong argument number', function() {
		spyOn(log, 'error');
		spyOn(engineCore, 'addButton');
		spyOn(mainView, 'menu');
		engineCore.doYesNo( function() {}, function() {} ); // Test for a call if migration didn't work
		expect(log.error.calls.count()).toBe( 1 );
		expect(mainView.menu.calls.count()).toBe( 0 );
		expect(engineCore.addButton.calls.count()).toBe( 0 );
	});
	it('should create buttons with functions', function() {
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
	it('should trigger error if called with wrong argument number', function() {
		spyOn(log, 'error');
		spyOn(engineCore, 'addButton');
		spyOn(mainView, 'menu');
		engineCore.doNext( function() {} ); // Test for a call if migration didn't work
		expect(log.error.calls.count()).toBe( 1 );
		expect(mainView.menu.calls.count()).toBe( 0 );
		expect(engineCore.addButton.calls.count()).toBe( 0 );
	});
	it('should do nothing if game is over', function() {
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
	it('should create button with function', function() {
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
	it('should call mainview and reinitialize oldstats', function() {
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
});