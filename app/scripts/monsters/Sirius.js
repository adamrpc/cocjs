'use strict';

angular.module( 'cocjs' ).factory( 'Sirius', function( SceneLib, MainView, Naga, CoC, Monster, Utils, StatusAffects, AppearanceDefs, Combat, EngineCore ) {
	function Sirius() {
		this.init(this, arguments);
	}
	angular.extend(Sirius.prototype, Naga.prototype);
	Sirius.prototype._superEAttack = Sirius.prototype.eAttack;
	Sirius.prototype._superOutputAttack = Sirius.prototype.outputAttack;
	Sirius.prototype.eAttack = function() {
		MainView.outputText( 'Sirius readies his hands, undulating his body erratically with quick motions in order to catch you off-guard and strike at you.\n' );
		this._superEAttack();
	};

	Sirius.prototype.outputPlayerDodged = function() {
		MainView.outputText( 'With your trained eyes, you see through his feints and effectively block his first swipe, then quickly twist your body to kick him away.  He clutches his belly where you kicked him, but recovers quickly, eyes fixated on yours.\n' );
	};
	Sirius.prototype.outputAttack = function( damage ) {
		if( damage <= 0 ) {
			this._superOutputAttack( damage );
		} else {
			MainView.outputText( 'You misjudge his pattern and wind up getting slashed by a series of swipes from his sharpened nails.  He distances himself from you in order to avoid retaliation and glares at you with his piercing yellow eyes, a hint of a smile on his face. (' + damage + ')' );
		}
	};
	Sirius.prototype.performCombatAction = function() {
		var attack = Utils.rand( 4 );
		if( CoC.player.findStatusAffect( StatusAffects.Blind ) ) {
			attack = Utils.rand( 3 );
		}
		if( attack === 0 ) {
			this.eAttack();
		}
		if( attack === 1 ) {
			this.poisonBite();
		}
		if( attack === 2 ) {
			this.manNagaTease();
		}
		if( attack === 3 ) {
			this.nagaSpitAttack();
		}
	};
	Sirius.prototype.manNagaTease = function() {
		MainView.outputText( 'The snake-man stares deeply into your eyes, seemingly looking past them, and for a moment your body goes numb.' );
		//Miss:;
		if( Utils.rand( 10 ) === 0 ) {
			MainView.outputText( '  You blink and shake yourself free of the effects of the snake-man\'s penetrating gaze.' );
			SceneLib.combatScene.combatRoundOver();
		}
		//Hit (Blind):;
		if( this.findStatusAffect( StatusAffects.Blind ) ) {
			MainView.outputText( '  Though your vision is still blurry, you feel yourself being sucked into the golden depths of those pupils, making you forget all your worries, if only for an instant.  All you can focus on is your growing arousal as you sink deeper into his gaze.  You shake your head, clearing your mind of the hypnotising effects the snake-man\'s eyes seem to possess, though the arousal remains.' );
			EngineCore.dynStats( 'lus', (5 + CoC.player.lib / 10 - CoC.player.inte / 20) );
		}
		//Hit:;
		else {
			MainView.outputText( '  Those pools of yellow suck you into their golden depths, making you forget all your worries, if only for an instant.  All you can focus on is your growing arousal as you sink deeper into his gaze.  You shake your head, clearing your mind of the hypnotising effects the snake-man\'s eyes seem to possess, though the arousal remains.' );
			EngineCore.dynStats( 'lus', (10 + CoC.player.lib / 7 - CoC.player.inte / 20) );
		}
		SceneLib.combatScene.combatRoundOver();
	};
	Sirius.prototype.nagaSpitAttack = function() {
		MainView.outputText( 'Hissing loudly, Sirius suddenly curls his lips and spits at your eyes!  ' );
		//{Hit:;
		if( this.spe / 20 + Utils.rand( 20 ) + 1 > CoC.player.spe / 20 + 10 ) {
			MainView.outputText( 'The vile spray hits your eyes and you scream in pain, clawing fiercely at your burning, watering, weeping eyes.  <b>You can\'t see!  It\'ll be much harder to fight in this state, but at the same time, his hypnosis won\'t be so effective...</b>' );
			CoC.player.createStatusAffect( StatusAffects.Blind, 3, 0, 0, 0 );
		}
		//Miss:;
		else {
			MainView.outputText( 'You quickly lean to the side, narrowly avoiding being blinded by the snake-man\'s spit!' );
		}
		SceneLib.combatScene.combatRoundOver();
	};
	Sirius.prototype.poisonBite = function() {
		MainView.outputText( 'With a loud and vicious hiss, Sirius suddenly lunges at you, mouth distended impossibly wide and revealing four needle-like fangs dripping with venom!  ' );
		//Miss:;
		if( Combat.combatMiss() || Combat.combatEvade() || Combat.combatFlexibility() || Combat.combatMisdirect() ) {
			MainView.outputText( 'You dodge just in the nick of time, and deliver a punishing blow with the butt of your halberd as Sirius soars past, forcing him to slither past you to make himself ready to defend himself again.' );
			SceneLib.combatScene.combatRoundOver();
		}
		//Hit:;
		MainView.outputText( 'The snake-man moves too quickly for you to evade and he sinks long fangs into your flesh, leaving a wound that burns with horrific pain.' );
		var damage = CoC.player.takeDamage( 40 + Utils.rand( 20 ) );
		MainView.outputText( ' (' + damage + ')' );
		SceneLib.combatScene.combatRoundOver();
	};
	Sirius.prototype.defeated = function() {
		SceneLib.urtaQuest.urtaBeatsUpSiriusRadio();
	};
	Sirius.prototype.won = function() {
		SceneLib.urtaQuest.urtaLosesToSirriusSnakeRadio();
	};
	Sirius.prototype.init = function( that ) {
		Naga.prototype.init( that, [ true ] );
		that.classNames.push('Sirius');
		that.a = '';
		that.short = 'Sirius, a naga hypnotist';
		that.imageName = 'sirius';
		that.long = 'A strange being with the upper torso of a human man topped with the head of a giant serpent stands before you, hissing in anger and occasionally letting a long, fork-tipped tongue flicker out past his lips.  An imperial-featured masculine human face regards you with an indifferent expression.  A ponytail of deep orange - almost bright red - hair falls down between his shoulders, held together by snake-styled circlets of silver, and matching bracelets of the same material and design adorn his wrists. Scales begin at his lower waist, concealing his manhood from you; he\'s completely naked otherwise.  His snake body is long and slender, covered in finely meshing scales of a rich orange-red shade, the red broken by a pattern of randomly thick or thin stripes of black.  His burning yellow eyes stare directly into yours, vertical slits of pupils fixated on your own as he undulates and coils in an eerily seductive manner.';
		that.plural = false;
		that.createCock( 14, 2 );
		that.createBreastRow( 0 );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_TIGHT;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_DRY;
		that.createStatusAffect( StatusAffects.BonusACapacity, 10, 0, 0, 0 );
		that.tallness = 5 * 12 + 10;
		that.hipRating = AppearanceDefs.HIP_RATING_AMPLE + 2;
		that.buttRating = AppearanceDefs.BUTT_RATING_LARGE;
		that.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_NAGA;
		that.skinTone = 'mediterranean-toned';
		that.hairColor = 'orange';
		that.hairLength = 16;
		that.initStrTouSpeInte( 75, 70, 75, 92 );
		that.initLibSensCor( 45, 35, 40 );
		that.weaponName = 'fangs';
		that.weaponVerb = 'bite';
		that.weaponAttack = 25;
		that.armorName = 'scales';
		that.armorDef = 30;
		that.bonusHP = 400;
		that.lust = 30;
		that.temperment = Monster.TEMPERMENT_RANDOM_GRAPPLES;
		that.level = 12;
		that.gems = Utils.rand( 5 ) + 8;
		that.drop = Monster.NO_DROP;
		that.special1 = that.nagaPoisonBiteAttack;
		that.special2 = that.nagaConstrict;
		that.special3 = that.nagaTailWhip;
		that.checkMonster();
	};
	return Sirius;
} );