'use strict';

angular.module('cocjs').factory('Combat', function (SceneLib, CoC, StatusAffects, Utils, EngineCore, PerkLib) {
	var Combat = {};
	Combat.canUseMagic = function() {
		return !CoC.player.findStatusAffect(StatusAffects.ThroatPunch) && !CoC.player.findStatusAffect(StatusAffects.WebSilence) && !CoC.player.findStatusAffect(StatusAffects.GooArmorSilence);
	};
	Combat.fatigueRecovery = function() {
		EngineCore.fatigue(-1);
		if(CoC.player.findPerk(PerkLib.EnlightenedNinetails) || CoC.player.findPerk(PerkLib.CorruptedNinetails)) {
			EngineCore.fatigue(-(1 + Utils.rand(3)));
		}
	};
	Combat.combatMiss = function( factor ) {
		if(factor === undefined) {
			factor = 80;
		}
		return CoC.player.spe - CoC.monster.spe > 0 && Utils.rand(((CoC.player.spe - CoC.monster.spe) / 4) + 80) > factor;
	};
	Combat.combatEvade = function(factor) {
		if(factor === undefined) {
			factor = 10;
		}
		return (!CoC.monster || CoC.monster.playerCanDodge()) && !!CoC.player.findPerk(PerkLib.Evade) && Utils.rand(100) < factor;
	};
	Combat.combatFlexibility = function( factor ) {
		if(factor === undefined) {
			factor = 6;
		}
		return !!CoC.player.findPerk(PerkLib.Flexibility) && Utils.rand(100) < factor;
	};
	Combat.combatMisdirect = function(factor) {
		if(factor === undefined) {
			factor = 10;
		}
		return (!!CoC.player.armor && CoC.player.armor.makeMisdirect()) && !!CoC.player.findPerk(PerkLib.Misdirection) && Utils.rand(100) < factor;
	};
	Combat.regeneration = function(combat) {
		if(combat === undefined) {
			combat = true;
		}
		var healingPercent = 0;
		//Regeneration
		if(CoC.player.findPerk(PerkLib.Regeneration)) {
			healingPercent += combat ? 1 : 2;
		}
		if(CoC.player.findPerk(PerkLib.Regeneration2)) {
			healingPercent += combat ? 2 : 4;
		}
		if(CoC.player.findPerk(PerkLib.LustyRegeneration)) {
			healingPercent += combat ? 1 : 2;
		}
		healingPercent += CoC.player.armor.getHealingPercent( combat );
		healingPercent = Math.min(healingPercent, (combat ? 5 : 10));
		EngineCore.HPChange(Math.round(CoC.player.maxHP() * healingPercent / 100), false);
	};
	Combat.doDamage = function(damage, apply) {
		if(apply === undefined) {
			apply = true;
		}
		if(CoC.player.findPerk(PerkLib.Sadist)) {
			damage *= 1.2;
			EngineCore.dynStats("lus", 3);
		}
		// Uma's Massage Bonuses
		var stat = CoC.player.findStatusAffect(StatusAffects.UmasMassage);
		if (stat && stat.value1 === SceneLib.umasShop.MASSAGE_POWER) {
			damage *= stat.value2;
		}
		damage = Math.max( 0, Math.round(damage) );
		if(apply) {
			CoC.monster.HP = Math.max( CoC.monster.HP - damage, 0);
		}
		CoC.monster.changeAffection( -1 );
		//Interrupt gigaflare if necessary.
		if(CoC.monster.findStatusAffect(StatusAffects.Gigafire)) {
			CoC.monster.addStatusValue(StatusAffects.Gigafire, 1, damage);
		}
		return damage;
	};
	return Combat;
});
