'use strict';

describe('Factory: EngineCore', function() {
	beforeEach(module('cocjs'));
	var engineCore;
	var coc;
	var perkLib;
	var mainView;
	beforeEach(inject(function(EngineCore, CoC, kFLAGS, PerkLib, MainView) {
		engineCore = EngineCore;
		coc = CoC;
		perkLib = PerkLib;
		mainView = MainView;
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
	it('Should define displayPerks', function() {
		expect(engineCore.displayPerks).toBeDefined();
	});
});