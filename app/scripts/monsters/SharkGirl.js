'use strict';

angular.module( 'cocjs' ).factory( 'SharkGirl', function( SceneLib, MainView, $log, StatusAffects, Appearance, WeightedDrop, ConsumableLib, ArmorLib, CoC, Monster, Utils, AppearanceDefs, Combat, EngineCore ) {
	function SharkGirl() {
		this.init(this, arguments);
	}
	angular.extend(SharkGirl.prototype, Monster.prototype);
	//Lust-based attacks:;
	SharkGirl.prototype.sharkTease = function() {
		MainView.spriteSelect( 70 );
		if( Utils.rand( 2 ) === 0 ) {
			MainView.outputText( 'You charge at the shark girl, prepared to strike again, but stop dead in your tracks when she bends over and wiggles her toned ass towards you. It distracts you long enough for her tail to swing out and smack you to the ground. She coos, "<i>Aw... You really do like me!</i>"', false );
			//(Small health damage, medium lust build).;
			CoC.player.takeDamage( 4 + Utils.rand( 4 ) );
			EngineCore.dynStats( 'lus', (10 + (CoC.player.lib / 20)) );
		} else {
			MainView.outputText( 'You pull your ' + CoC.player.weaponName + ' back, getting a running start to land another attack. The Shark girl smirks and pulls up her bikini top, shaking her perky breasts in your direction. You stop abruptly, aroused by the sight just long enough for the shark girl to kick you across the face and knock you to the ground.  She teases, "<i>Aw, don\'t worry baby, you\'re gonna get the full package in a moment!</i>"', false );
			//(Small health damage, medium lust build);
			CoC.player.takeDamage( 4 + Utils.rand( 4 ) );
			EngineCore.dynStats( 'lus', (5 + (CoC.player.lib / 10)) );
		}
		SceneLib.combatScene.combatRoundOver();
	};
	SharkGirl.prototype.defeated = function() {
		SceneLib.sharkGirlScene.sharkWinChoices();
	};
	/* jshint unused:true */
	SharkGirl.prototype.won = function( hpVictory, pcCameWorms ) {
		if( pcCameWorms ) {
			MainView.outputText( '\n\nYour foe doesn\'t seem disgusted enough to leave...' );
			EngineCore.doNext( SceneLib.combatScene, SceneLib.combatScene.endLustLoss );
		} else {
			SceneLib.sharkGirlScene.sharkLossRape();
		}
	};
	SharkGirl.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		that.classNames.push('SharkGirl');
		$log.debug( 'SharkGirl Constructor!' );
		that.a = 'the ';
		that.short = 'shark-girl';
		that.imageName = 'sharkgirl';
		that.long = 'The shark girl stands just over 5\'5", with grey skin shimmering from water droplets catching the sunlight and slender muscles built for swimming.  Her shoulder-length silver hair brushes past her pretty face and her eyes are a striking shade of red. She has rows of intimidating sharp teeth glinting in the light. A fish-like tail protrudes from her backside, wrapping around her toned legs at every opportunity. She\'s wearing a rather skimpy black bikini, strings done in such a way that they move around her fin; though the swimwear itself barely covers her perky breasts and tight snatch.';
		that.createVagina( false, AppearanceDefs.VAGINA_WETNESS_DROOLING, AppearanceDefs.VAGINA_LOOSENESS_NORMAL );
		that.createStatusAffect( StatusAffects.BonusVCapacity, 15, 0, 0, 0 );
		that.createBreastRow( Appearance.breastCupInverse( 'D' ) );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_TIGHT;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_DRY;
		that.createStatusAffect( StatusAffects.BonusACapacity, 40, 0, 0, 0 );
		that.tallness = 5 * 12 + 5;
		that.hipRating = AppearanceDefs.HIP_RATING_AMPLE + 2;
		that.buttRating = AppearanceDefs.BUTT_RATING_LARGE;
		that.skinTone = 'gray';
		that.hairColor = 'silver';
		that.hairLength = 16;
		that.initStrTouSpeInte( 40, 40, 55, 42 );
		that.initLibSensCor( 75, 35, 40 );
		that.weaponName = 'shark teeth';
		that.weaponVerb = 'bite';
		that.weaponAttack = 3;
		that.armorName = 'tough skin';
		that.armorDef = 5;
		that.bonusHP = 20;
		that.lust = 40;
		that.lustVuln = 0.9;
		that.temperment = Monster.TEMPERMENT_RANDOM_GRAPPLES;
		that.level = 4;
		that.gems = Utils.rand( 15 ) + 5;
		that.drop = new WeightedDrop().add( ConsumableLib.L_DRAFT, 3 ).add( ArmorLib.S_SWMWR, 1 ).add( ConsumableLib.SHARK_T, 5 ).add( null, 1 );
		that.special1 = that.sharkTease;
		that.special2 = that.sharkTease;
		that.checkMonster();
	};
	return SharkGirl;
} );