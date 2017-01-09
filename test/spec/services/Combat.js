'use strict';

describe('Factory: Combat', function() {
	beforeEach(module('cocjs'));
	var coc;
	var combat;
	var PlayerConstructor;
	var perkLib;
	var statusAffects;
	var engineCore;
	var utils;
	var flags;
	var MonsterConstructor;
	beforeEach(inject(function(CoC, Combat, Player, PerkLib, StatusAffects, EngineCore, Utils, Monster, kFLAGS) {
		coc = CoC;
		combat = Combat;
		PlayerConstructor = Player;
		perkLib = PerkLib;
		statusAffects = StatusAffects;
		engineCore = EngineCore;
		utils = Utils;
		flags = kFLAGS;
		MonsterConstructor = Monster;
	}));
	it('Should define Combat', function() {
		expect(combat).toBeDefined();
	});
	it('Should define canUseMagic', function() {
		expect(combat.canUseMagic).toBeDefined();
	});
	it('Should return false if player have one anti-magic status', function() {
		coc.player = new PlayerConstructor();
		expect(combat.canUseMagic()).toBe(true);
		coc.player.createStatusAffect( statusAffects.ThroatPunch );
		expect(combat.canUseMagic()).toBe(false);
		coc.player.removeStatusAffect( statusAffects.ThroatPunch );
		expect(combat.canUseMagic()).toBe(true);
		coc.player.createStatusAffect( statusAffects.WebSilence );
		expect(combat.canUseMagic()).toBe(false);
		coc.player.removeStatusAffect( statusAffects.WebSilence );
		expect(combat.canUseMagic()).toBe(true);
		coc.player.createStatusAffect( statusAffects.GooArmorSilence );
		expect(combat.canUseMagic()).toBe(false);
		coc.player.removeStatusAffect( statusAffects.GooArmorSilence );
		expect(combat.canUseMagic()).toBe(true);
	});
	it('Should define fatigueRecovery', function() {
		expect(combat.fatigueRecovery).toBeDefined();
	});
	it('Should recover 1 fatigue', function() {
		coc.player = new PlayerConstructor();
		spyOn(engineCore, 'fatigue');
		combat.fatigueRecovery();
		expect(engineCore.fatigue.calls.count()).toBe(1);
		expect(engineCore.fatigue).toHaveBeenCalledWith( -1 );
	});
	it('Should recover 2 to 4 fatigue', function() {
		coc.player = new PlayerConstructor();
		coc.player.createPerk( perkLib.EnlightenedNinetails );
		var random = 1;
		spyOn(utils, 'rand').and.callFake(function( ) { return random; });
		spyOn(engineCore, 'fatigue');
		combat.fatigueRecovery();
		expect(engineCore.fatigue.calls.count()).toBe(2);
		expect(engineCore.fatigue).toHaveBeenCalledWith( -1 );
		expect(engineCore.fatigue).toHaveBeenCalledWith( -2 );
		engineCore.fatigue.calls.reset();
		random = 2;
		combat.fatigueRecovery();
		expect(engineCore.fatigue.calls.count()).toBe(2);
		expect(engineCore.fatigue).toHaveBeenCalledWith( -1 );
		expect(engineCore.fatigue).toHaveBeenCalledWith( -3 );
	});
	it('Should recover 2 to 4 fatigue', function() {
		coc.player = new PlayerConstructor();
		coc.player.createPerk( perkLib.CorruptedNinetails );
		var random = 1;
		spyOn(utils, 'rand').and.callFake(function( ) { return random; });
		spyOn(engineCore, 'fatigue');
		combat.fatigueRecovery();
		expect(engineCore.fatigue.calls.count()).toBe(2);
		expect(engineCore.fatigue).toHaveBeenCalledWith( -1 );
		expect(engineCore.fatigue).toHaveBeenCalledWith( -2 );
		engineCore.fatigue.calls.reset();
		random = 2;
		combat.fatigueRecovery();
		expect(engineCore.fatigue.calls.count()).toBe(2);
		expect(engineCore.fatigue).toHaveBeenCalledWith( -1 );
		expect(engineCore.fatigue).toHaveBeenCalledWith( -3 );
	});
	it('Should define combatMiss', function() {
		expect(combat.combatMiss).toBeDefined();
	});
	it('Should miss if player is faster that monster and with a random ponderation', function() {
		coc.player = new PlayerConstructor();
		coc.player.spe = 40;
		coc.monster = {spe:20};
		var random = 80;
		spyOn(utils, 'rand').and.callFake(function( ) { return random; });
		expect(combat.combatMiss()).toBe(false);
		expect(utils.rand.calls.count()).toBe(1);
		expect(utils.rand).toHaveBeenCalledWith( 85 );
		utils.rand.calls.reset();
		random = 81;
		expect(combat.combatMiss()).toBe(true);
		expect(utils.rand.calls.count()).toBe(1);
		expect(utils.rand).toHaveBeenCalledWith( 85 );
		utils.rand.calls.reset();
		random = 81;
		expect(combat.combatMiss(81)).toBe(false);
		expect(utils.rand.calls.count()).toBe(1);
		expect(utils.rand).toHaveBeenCalledWith( 85 );
		utils.rand.calls.reset();
		random = 82;
		expect(combat.combatMiss(81)).toBe(true);
		expect(utils.rand.calls.count()).toBe(1);
		expect(utils.rand).toHaveBeenCalledWith( 85 );
		utils.rand.calls.reset();
	});
	it('Should not miss if player is slower that monster', function() {
		coc.player = new PlayerConstructor();
		coc.player.spe = 20;
		coc.monster = {spe:40};
		var random = 80;
		spyOn(utils, 'rand').and.callFake(function( ) { return random; });
		expect(combat.combatMiss()).toBe(false);
		expect(utils.rand.calls.count()).toBe(0);
		random = 81;
		expect(combat.combatMiss()).toBe(false);
		expect(utils.rand.calls.count()).toBe(0);
	});
	it('Should define combatEvade', function() {
		expect(combat.combatEvade).toBeDefined();
	});
	it('Should evade if conditions are met', function() {
		coc.player = new PlayerConstructor();
		var canDodge = true;
		coc.monster = {playerCanDodge:function(){ return canDodge; }};
		var random = 9;
		spyOn(utils, 'rand').and.callFake(function( ) { return random; });
		expect(combat.combatEvade()).toBe(false);
		expect(utils.rand.calls.count()).toBe(0);
		coc.player.createPerk( perkLib.Evade );
		expect(combat.combatEvade()).toBe(true);
		expect(utils.rand.calls.count()).toBe(1);
		expect(utils.rand).toHaveBeenCalledWith( 100 );
		utils.rand.calls.reset();
		expect(combat.combatEvade( 8 )).toBe(false);
		expect(utils.rand.calls.count()).toBe(1);
		expect(utils.rand).toHaveBeenCalledWith( 100 );
		utils.rand.calls.reset();
		random = 15;
		expect(combat.combatEvade()).toBe(false);
		expect(utils.rand.calls.count()).toBe(1);
		expect(utils.rand).toHaveBeenCalledWith( 100 );
		utils.rand.calls.reset();
		random = 9;
		canDodge = false;
		expect(combat.combatEvade()).toBe(false);
		expect(utils.rand.calls.count()).toBe(0);
	});
	it('Should define combatFlexibility', function() {
		expect(combat.combatFlexibility).toBeDefined();
	});
	it('Should flex if conditions are met', function() {
		coc.player = new PlayerConstructor();
		var random = 5;
		spyOn(utils, 'rand').and.callFake(function( ) { return random; });
		expect(combat.combatFlexibility()).toBe(false);
		expect(utils.rand.calls.count()).toBe(0);
		coc.player.createPerk( perkLib.Flexibility );
		expect(combat.combatFlexibility()).toBe(true);
		expect(utils.rand.calls.count()).toBe(1);
		expect(utils.rand).toHaveBeenCalledWith( 100 );
		utils.rand.calls.reset();
		expect(combat.combatFlexibility( 5 )).toBe(false);
		expect(utils.rand.calls.count()).toBe(1);
		expect(utils.rand).toHaveBeenCalledWith( 100 );
		utils.rand.calls.reset();
		random = 6;
		expect(combat.combatFlexibility()).toBe(false);
		expect(utils.rand.calls.count()).toBe(1);
		expect(utils.rand).toHaveBeenCalledWith( 100 );
	});
	it('Should define combatMisdirect', function() {
		expect(combat.combatMisdirect).toBeDefined();
	});
	it('Should flex if conditions are met', function() {
		coc.player = new PlayerConstructor();
		var misdirect = true;
		coc.player.armor = { makeMisdirect: function() { return misdirect; } };
		var random = 9;
		spyOn(utils, 'rand').and.callFake(function( ) { return random; });
		expect(combat.combatMisdirect()).toBe(false);
		expect(utils.rand.calls.count()).toBe(0);
		coc.player.createPerk( perkLib.Misdirection );
		expect(combat.combatMisdirect()).toBe(true);
		expect(utils.rand.calls.count()).toBe(1);
		expect(utils.rand).toHaveBeenCalledWith( 100 );
		utils.rand.calls.reset();
		expect(combat.combatMisdirect( 5 )).toBe(false);
		expect(utils.rand.calls.count()).toBe(1);
		expect(utils.rand).toHaveBeenCalledWith( 100 );
		utils.rand.calls.reset();
		random = 11;
		expect(combat.combatMisdirect()).toBe(false);
		expect(utils.rand.calls.count()).toBe(1);
		expect(utils.rand).toHaveBeenCalledWith( 100 );
		utils.rand.calls.reset();
		random = 9;
		misdirect = false;
		expect(combat.combatMisdirect()).toBe(false);
		expect(utils.rand.calls.count()).toBe(0);
	});
	it('Should define regeneration', function() {
		expect(combat.regeneration).toBeDefined();
	});
	it('Should regenerate depending on perks and armor', function() {
		coc.player = new PlayerConstructor();
		var healingPercent = 0;
		coc.player.armor = {getHealingPercent: function( inCombat ) { return inCombat ? healingPercent : (healingPercent * 2); } };
		var maxHp = 100;
		spyOn(coc.player, 'maxHP').and.callFake(function( ) { return maxHp; });
		spyOn(engineCore, 'HPChange');
		combat.regeneration();
		expect(engineCore.HPChange.calls.count()).toBe(1);
		expect(engineCore.HPChange).toHaveBeenCalledWith( 0, false );
		engineCore.HPChange.calls.reset();
		healingPercent = 2;
		combat.regeneration();
		expect(engineCore.HPChange.calls.count()).toBe(1);
		expect(engineCore.HPChange).toHaveBeenCalledWith( 2, false );
		engineCore.HPChange.calls.reset();
		maxHp = 50;
		combat.regeneration();
		expect(engineCore.HPChange.calls.count()).toBe(1);
		expect(engineCore.HPChange).toHaveBeenCalledWith( 1, false );
		engineCore.HPChange.calls.reset();
		maxHp = 100;
		combat.regeneration( false );
		expect(engineCore.HPChange.calls.count()).toBe(1);
		expect(engineCore.HPChange).toHaveBeenCalledWith( 4, false );
		engineCore.HPChange.calls.reset();
		combat.regeneration( true );
		expect(engineCore.HPChange.calls.count()).toBe(1);
		expect(engineCore.HPChange).toHaveBeenCalledWith( 2, false );
		engineCore.HPChange.calls.reset();
		coc.player.createPerk( perkLib.Regeneration );
		combat.regeneration();
		expect(engineCore.HPChange.calls.count()).toBe(1);
		expect(engineCore.HPChange).toHaveBeenCalledWith( 3, false );
		engineCore.HPChange.calls.reset();
		combat.regeneration( false );
		expect(engineCore.HPChange.calls.count()).toBe(1);
		expect(engineCore.HPChange).toHaveBeenCalledWith( 6, false );
		engineCore.HPChange.calls.reset();
		coc.player.createPerk( perkLib.Regeneration2 );
		combat.regeneration();
		expect(engineCore.HPChange.calls.count()).toBe(1);
		expect(engineCore.HPChange).toHaveBeenCalledWith( 5, false );
		engineCore.HPChange.calls.reset();
		combat.regeneration( false );
		expect(engineCore.HPChange.calls.count()).toBe(1);
		expect(engineCore.HPChange).toHaveBeenCalledWith( 10, false );
		engineCore.HPChange.calls.reset();
		healingPercent = 0;
		coc.player.createPerk( perkLib.LustyRegeneration );
		combat.regeneration();
		expect(engineCore.HPChange.calls.count()).toBe(1);
		expect(engineCore.HPChange).toHaveBeenCalledWith( 4, false );
		engineCore.HPChange.calls.reset();
		combat.regeneration( false );
		expect(engineCore.HPChange.calls.count()).toBe(1);
		expect(engineCore.HPChange).toHaveBeenCalledWith( 8, false );
		engineCore.HPChange.calls.reset();
		healingPercent = 1;
		combat.regeneration();
		expect(engineCore.HPChange.calls.count()).toBe(1);
		expect(engineCore.HPChange).toHaveBeenCalledWith( 5, false );
		engineCore.HPChange.calls.reset();
		combat.regeneration( false );
		expect(engineCore.HPChange.calls.count()).toBe(1);
		expect(engineCore.HPChange).toHaveBeenCalledWith( 10, false );
		engineCore.HPChange.calls.reset();
		healingPercent = 2;
		combat.regeneration();
		expect(engineCore.HPChange.calls.count()).toBe(1);
		expect(engineCore.HPChange).toHaveBeenCalledWith( 5, false );
		engineCore.HPChange.calls.reset();
		combat.regeneration( false );
		expect(engineCore.HPChange.calls.count()).toBe(1);
		expect(engineCore.HPChange).toHaveBeenCalledWith( 10, false );
		engineCore.HPChange.calls.reset();
	});
	it('Should define doDamage', function() {
		expect(combat.doDamage).toBeDefined();
	});
	it('Should regenerate depending on perks and armor', function() {
		coc.player = new PlayerConstructor();
		coc.monster = new MonsterConstructor();
		coc.monster.HP = 100;
		spyOn(engineCore, 'dynStats');
		spyOn(coc.monster, 'changeAffection');
		spyOn(coc.monster, 'addStatusValue');
		expect(combat.doDamage( 10 )).toBe(10);
		expect(coc.monster.HP).toBe(90);
		expect(engineCore.dynStats.calls.count()).toBe(0);
		expect(coc.monster.addStatusValue.calls.count()).toBe(0);
		expect(coc.monster.changeAffection.calls.count()).toBe(1);
		expect(coc.monster.changeAffection).toHaveBeenCalledWith( -1 );
		coc.monster.changeAffection.calls.reset();
		expect(combat.doDamage( -10 )).toBe(0);
		expect(coc.monster.HP).toBe(90);
		expect(engineCore.dynStats.calls.count()).toBe(0);
		expect(coc.monster.addStatusValue.calls.count()).toBe(0);
		expect(coc.monster.changeAffection.calls.count()).toBe(1);
		expect(coc.monster.changeAffection).toHaveBeenCalledWith( -1 );
		coc.monster.changeAffection.calls.reset();
		expect(combat.doDamage( 10, false )).toBe(10);
		expect(coc.monster.HP).toBe(90);
		expect(engineCore.dynStats.calls.count()).toBe(0);
		expect(coc.monster.addStatusValue.calls.count()).toBe(0);
		expect(coc.monster.changeAffection.calls.count()).toBe(1);
		expect(coc.monster.changeAffection).toHaveBeenCalledWith( -1 );
		coc.monster.changeAffection.calls.reset();
		coc.player.createPerk( perkLib.Sadist );
		expect(combat.doDamage( 10 )).toBe(12);
		expect(coc.monster.HP).toBe(78);
		expect(engineCore.dynStats.calls.count()).toBe(1);
		expect(engineCore.dynStats).toHaveBeenCalledWith( 'lus', 3 );
		expect(coc.monster.addStatusValue.calls.count()).toBe(0);
		expect(coc.monster.changeAffection.calls.count()).toBe(1);
		expect(coc.monster.changeAffection).toHaveBeenCalledWith( -1 );
		coc.monster.changeAffection.calls.reset();
		engineCore.dynStats.calls.reset();
		coc.player.removePerk( perkLib.Sadist );
		coc.player.createStatusAffect( statusAffects.UmasMassage, 4, 2 );
		expect(combat.doDamage( 10 )).toBe(20);
		expect(coc.monster.HP).toBe(58);
		expect(engineCore.dynStats.calls.count()).toBe(0);
		expect(coc.monster.addStatusValue.calls.count()).toBe(0);
		expect(coc.monster.changeAffection.calls.count()).toBe(1);
		expect(coc.monster.changeAffection).toHaveBeenCalledWith( -1 );
		coc.monster.changeAffection.calls.reset();
		coc.player.removeStatusAffect( statusAffects.UmasMassage );
		coc.monster.createStatusAffect( statusAffects.Gigafire, 0 );
		expect(combat.doDamage( 10 )).toBe(10);
		expect(coc.monster.HP).toBe(48);
		expect(engineCore.dynStats.calls.count()).toBe(0);
		expect(coc.monster.addStatusValue.calls.count()).toBe(1);
		expect(coc.monster.addStatusValue).toHaveBeenCalledWith( statusAffects.Gigafire, 1, 10 );
		expect(coc.monster.changeAffection.calls.count()).toBe(1);
		expect(coc.monster.changeAffection).toHaveBeenCalledWith( -1 );
		coc.monster.changeAffection.calls.reset();
		coc.monster.removeStatusAffect( statusAffects.Gigafire );
	});
});