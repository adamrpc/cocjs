'use strict';

angular.module( 'cocjs' ).factory( 'Helspawn', function( kFLAGS, MainView, Appearance, CoC, EngineCore, Monster, Utils, AppearanceDefs, StatusAffects, Combat ) {
	var Helspawn = angular.copy( Monster );
	Helspawn.prototype.doAI = function() {
		var choices = [];
		EngineCore.choices[ choices.length ] = this.helspawnTwinStrikes;
		//Bowmander only;
		if( CoC.getInstance().flags[ kFLAGS.HELSPAWN_WEAPON ] === 'bow' ) {
			EngineCore.choices[ choices.length ] = this.calledShot;
		}
		//Zerker ability;
		if( this.weaponAttack < 50 || CoC.getInstance().flags[ kFLAGS.HELSPAWN_WEAPON ] === 'scimitar' ) {
			EngineCore.choices[ choices.length ] = this.helSpawnBerserk;	//Shield Bash (Shieldmander Only)
		}
		if( CoC.getInstance().flags[ kFLAGS.HELSPAWN_WEAPON ] === 'scimitar and shield' ) {
			EngineCore.choices[ choices.length ] = this.helSpawnShieldBash;
		}
		//Tease (Sluttymander Only);
		if( CoC.getInstance().flags[ kFLAGS.HELSPAWN_PERSONALITY ] >= 50 ) {
			EngineCore.choices[ choices.length ] = this.sluttyMander;
		}
		//Focus (Chastemander Only);
		//Self-healing & lust restoration;
		if( CoC.getInstance().flags[ kFLAGS.HELSPAWN_PERSONALITY ] < 50 ) {
			EngineCore.choices[ choices.length ] = this.helSpawnFocus;
		}
		EngineCore.choices[ Utils.rand( EngineCore.choices.length ) ]();
		//Tail Whip;
		if( Utils.rand( 4 ) === 0 ) {
			this.tailWhipShitYo();
		}
		Combat.combatRoundOver();
	};
	//Basic Attack - Twin Strike;
	// Two light attacks;
	Helspawn.prototype.helspawnTwinStrikes = function() {
		//if Bowmander;
		if( CoC.getInstance().flags[ kFLAGS.HELSPAWN_WEAPON ] === 'bow' ) {
			EngineCore.outputText( CoC.getInstance().flags[ kFLAGS.HELSPAWN_NAME ] + ' leaps back out of your reach and nocks a pair of blunted arrows, drawing them back together and loosing them at once!\n' );
		} else {
			EngineCore.outputText( CoC.getInstance().flags[ kFLAGS.HELSPAWN_NAME ] + ' lunges at you, scimitar cleaving through the air toward your throat!\n' );
		}
		this.createStatusAffect( StatusAffects.Attacks, 0, 0, 0, 0 );
		this.eAttack();
	};
	//Called Shot (Bowmander Only);
	// Super-high chance of hitting. On hit, speed debuff;
	Helspawn.prototype.calledShot = function() {
		EngineCore.outputText( CoC.getInstance().flags[ kFLAGS.HELSPAWN_NAME ] + ' draws back her bowstring, spending an extra second aiming before letting fly!' );
		var damage = Math.ceil( (this.str + this.weaponAttack) - Utils.rand( CoC.getInstance().player.tou ) - CoC.getInstance().player.armorDef );
		//standard dodge/miss text;
		if( damage <= 0 || (Utils.rand( 2 ) === 0 && (Combat.combatMiss() || Combat.combatEvade() || Combat.combatFlexibility() || Combat.combatMisdirect())) ) {
			EngineCore.outputText( '\nYou avoid the hit!' );
		} else {
			EngineCore.outputText( '\nOne of her arrows smacks right into your [leg], nearly bowling you over.  God DAMN that hurt! You\'re going to be limping for a while!' );
			var affect = 20 + Utils.rand( 5 );
			if( CoC.getInstance().player.findStatusAffect( StatusAffects.CalledShot ) >= 0 ) {
				while( affect > 0 && CoC.getInstance().player.spe >= 2 ) {
					affect--;
					CoC.getInstance().player.addStatusValue( StatusAffects.CalledShot, 1, 1 );
					CoC.getInstance().player.spe--;
					MainView.statsView.showStatDown( 'spe' );
				}
			} else {
				CoC.getInstance().player.createStatusAffect( StatusAffects.CalledShot, 0, 0, 0, 0 );
				while( affect > 0 && CoC.getInstance().player.spe >= 2 ) {
					affect--;
					CoC.getInstance().player.addStatusValue( StatusAffects.CalledShot, 1, 1 );
					CoC.getInstance().player.spe--;
					MainView.statsView.showStatDown( 'spe' );
				}
			}
			damage = CoC.getInstance().player.takeDamage( damage );
			EngineCore.outputText( ' (' + damage + ')' );
		}
	};
	//Berzerkergang (Berzerkermander Only);
	//Gives Helspawn the benefit of the Berzerk special ability;
	Helspawn.prototype.helSpawnBerserk = function() {
		EngineCore.outputText( CoC.getInstance().flags[ kFLAGS.HELSPAWN_NAME ] + ' lets out a savage warcry, throwing her head back in primal exaltation before charging back into the fray with utter bloodlust in her wild eyes!' );
		this.weaponAttack = this.weaponAttack + 30;
		this.armorDef = 0;
	};
	//Shield Bash (Shieldmander Only);
	Helspawn.prototype.helSpawnShieldBash = function() {
		EngineCore.clearOutput();
		var damage = Math.ceil( this.str - Utils.rand( CoC.getInstance().player.tou ) - CoC.getInstance().player.armorDef );
		// Stuns a bitch;
		EngineCore.outputText( CoC.getInstance().flags[ kFLAGS.HELSPAWN_NAME ] + ' lashes out with her shield, trying to knock you back!' );
		//standard dodge/miss text;
		if( damage <= 0 || Combat.combatMiss() || Combat.combatEvade() || Combat.combatFlexibility() || Combat.combatMisdirect() ) {
			EngineCore.outputText( '\nYou evade the strike.' );
		} else {
			EngineCore.outputText( '\nHer shield catches you right in the face, sending you tumbling to the ground and leaving you open to attack!' );
			damage = CoC.getInstance().player.takeDamage( damage );
			if( Utils.rand( 2 ) === 0 && CoC.getInstance().player.findStatusAffect( StatusAffects.Stunned ) < 0 ) {
				CoC.getInstance().player.createStatusAffect( StatusAffects.Stunned, 0, 0, 0, 0 );
				EngineCore.outputText( ' <b>The hit stuns you.</b>' );
			}
			EngineCore.outputText( ' (' + damage + ')' );
		}
	};
	//Tail Whip;
	Helspawn.prototype.tailWhipShitYo = function() {
		// Light physical, armor piercing (fire, bitch). Random chance to get this on top of any other attack;
		var damage = Math.ceil( this.str - Utils.rand( CoC.getInstance().player.tou ) );
		EngineCore.outputText( '\n' + CoC.getInstance().flags[ kFLAGS.HELSPAWN_NAME ] + ' whips at you with her tail, trying to sear you with her brilliant flames!' );
		//standard dodge/miss text;
		if( damage <= 0 || Combat.combatMiss() || Combat.combatEvade() || Combat.combatFlexibility() || Combat.combatMisdirect() ) {
			EngineCore.outputText( '\nYou evade the strike.' );
		} else {
			EngineCore.outputText( '\n' + CoC.getInstance().flags[ kFLAGS.HELSPAWN_NAME ] + '\'s tail catches you as you try to dodge.  Your [armor] sizzles, and you leap back with a yelp as she gives you a light burning.' );
			damage = CoC.getInstance().player.takeDamage( damage );
			EngineCore.outputText( ' (' + damage + ')' );
		}
	};
	//Tease (Sluttymander Only);
	Helspawn.prototype.sluttyMander = function() {
		// Medium Lust damage;
		EngineCore.outputText( CoC.getInstance().flags[ kFLAGS.HELSPAWN_NAME ] + ' jumps just out of reach before spinning around, planting her weapon in the ground as she turns her backside to you and gives her sizable ass a rhythmic shake, swaying her full hips hypnotically.' );
		//if no effect:;
		if( Utils.rand( 2 ) === 0 ) {
			EngineCore.outputText( '\nWhat the fuck is she trying to do?  You walk over and give her a sharp kick in the kiester, "<i>Keep your head in the game, kiddo.  Pick up your weapon!</i>"' );
		} else {
			EngineCore.outputText( '\nDat ass.  You lean back, enjoying the show as the slutty little salamander slips right past your guard, practically grinding up against you until you can feel a fire boiling in your loins!' );
			var lustDelta = CoC.getInstance().player.lustVuln * (10 + CoC.getInstance().player.lib / 10);
			CoC.getInstance().player.lust += lustDelta;
			MainView.statsView.showStatUp( 'lust' );
			// lustDown.visible = false;;
			// lustUp.visible = true;;
			lustDelta = Math.round( lustDelta * 10 ) / 10;
			EngineCore.outputText( ' (' + lustDelta + ')', false );
		}
	};
	//Focus (Chastemander Only);
	//Self-healing & lust restoration;
	Helspawn.prototype.helSpawnFocus = function() {
		EngineCore.outputText( 'Seeing a momentary lull in the melee, ' + CoC.getInstance().flags[ kFLAGS.HELSPAWN_NAME ] + ' slips out of reach, stumbling back and clutching at the bruises forming all over her body.  "<i>Come on, ' + CoC.getInstance().flags[ kFLAGS.HELSPAWN_NAME ] + ', you can do this. Focus, focus,</i>" she mutters, trying to catch her breath.  A moment later and she seems to have taken a second wind as she readies her weapon with a renewed vigor.' );
		this.lust -= 30;
		if( this.lust < 0 ) {
			this.lust = 0;
		}
		this.addHP( this.eMaxHP() / 3.0 );
	};
	Helspawn.prototype.defeated = function() {
		CoC.getInstance().scenes.helSpawnScene.beatUpYourDaughter();
	};

	Helspawn.prototype.won = function() {
		CoC.getInstance().scenes.helSpawnScene.loseSparringToDaughter();
	};
	Helspawn.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		var weapon = CoC.getInstance().flags[ kFLAGS.HELSPAWN_WEAPON ];
		that.a = '';
		that.short = CoC.getInstance().flags[ kFLAGS.HELSPAWN_NAME ];
		that.imageName = 'hollispawn';
		that.long = CoC.getInstance().flags[ kFLAGS.HELSPAWN_NAME ] + ' is a young salamander, appearing in her later teens.  Clad in ' +
			(CoC.getInstance().flags[ kFLAGS.HELSPAWN_PERSONALITY ] >= 50 ?
				'a slutty scale bikini like her mother\'s, barely concealing anything' :
				'a short skirt, thigh-high boots, and a sky-blue blouse, in stark contrast to her mother’s sluttier attire') +
			', she stands about six feet in height, with a lengthy, fiery tail swishing menacingly behind her. She\'s packing a ' +
			{
				'bow': 'recurve bow, using blunted, soft-tipped arrows',
				'scimitar': 'scimitar, just like her mom\'s, and holds it in the same berzerk stance Helia is wont to use',
				'scimitar and shield': 'scimitar and shield, giving her a balanced fighting style'
			}[ weapon ] +
			'.  Pacing around you, the well-built young warrior intently studies her mentor\'s defenses, readying for your next attack.';
		that.createVagina( false, AppearanceDefs.VAGINA_WETNESS_NORMAL, AppearanceDefs.VAGINA_LOOSENESS_NORMAL );
		that.createStatusAffect( StatusAffects.BonusVCapacity, 85, 0, 0, 0 );
		that.createBreastRow( Appearance.breastCupInverse( 'E+' ) );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_VIRGIN;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_DRY;
		that.createStatusAffect( StatusAffects.BonusACapacity, 85, 0, 0, 0 );
		that.tallness = 90;
		that.hipRating = AppearanceDefs.HIP_RATING_CURVY + 2;
		that.buttRating = AppearanceDefs.BUTT_RATING_LARGE + 1;
		that.skinTone = 'dusky';
		that.hairColor = 'red';
		that.hairLength = 13;
		that.initStrTouSpeInte( 50, 50, 65, 40 );
		that.initLibSensCor( 35, 55, 20 );
		that.weaponName = weapon;
		that.weaponVerb = {
			'bow': 'blunted arrow',
			'scimitar': 'slash',
			'scimitar and shield': 'slash'
		}[ weapon ];
		that.weaponAttack = 20;
		that.armorName = 'scales';
		that.armorDef = 12;
		that.armorPerk = '';
		that.armorValue = 50;
		that.bonusHP = 175;
		that.lust = 30;
		that.lustVuln = 0.55;
		that.temperment = Monster.TEMPERMENT_RANDOM_GRAPPLES;
		that.level = 12;
		that.gems = 10 + Utils.rand( 5 );
		that.tailType = AppearanceDefs.TAIL_TYPE_LIZARD;
		that.tailRecharge = 0;
		that.createStatusAffect( StatusAffects.Keen, 0, 0, 0, 0 );
		that.drop = Monster.NO_DROP;
		that.checkMonster();
	};
	return Helspawn;
} );