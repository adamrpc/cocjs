'use strict';

angular.module( 'cocjs' ).factory( 'Shouldra', function( MainView, SceneLib, EventParser, Descriptors, Appearance, ConsumableLib, ChainedDrop, StatusAffects, PerkLib, CoC, Monster, Utils, AppearanceDefs, Combat, EngineCore ) {
	function Shouldra() {
		this.init(this, arguments);
	}
	angular.extend(Shouldra.prototype, Monster.prototype);
	Shouldra.prototype.shouldrattack = function() {
		var damage = 0;
		//return to combat menu when finished;
		EngineCore.doNext( MainView.playerMenu );
		//Determine if dodged!;
		if( CoC.player.spe - this.spe > 0 && Math.ceil( Math.random() * (((CoC.player.spe - this.spe) / 4) + 80) ) > 80 ) {
			EngineCore.outputText( 'The girl wades in for a swing, but you deftly dodge to the side. She recovers quickly, spinning back at you.', false );
			return;
		}
		//('Misdirection';
		if( CoC.player.findPerk( PerkLib.Misdirection ) >= 0 && Utils.rand( 100 ) < 10 && CoC.player.armorName === 'red, high-society bodysuit' ) {
			EngineCore.outputText( 'The girl wades in for a swing, but you deftly misdirect her and avoid the attack. She recovers quickly, spinning back at you.', false );
			return;
		}
		//Determine if cat'ed;
		if( CoC.player.findPerk( PerkLib.Flexibility ) >= 0 && Utils.rand( 100 ) < 6 ) {
			EngineCore.outputText( 'The girl wades in for a swing, but you deftly twist your flexible body out of the way. She recovers quickly, spinning back at you.', false );
			return;
		}
		//Determine damage - str modified by enemy toughness!;
		damage = Math.ceil( (this.str + this.weaponAttack) - Utils.rand( CoC.player.tou ) - CoC.player.armorDef );
		if( damage > 0 ) {
			damage = CoC.player.takeDamage( damage );
		}
		if( damage <= 0 ) {
			damage = 0;
			//Due to toughness or amor...;
			if( Utils.rand( CoC.player.armorDef + CoC.player.tou ) < CoC.player.armorDef ) {
				EngineCore.outputText( 'You absorb and deflect every ' + this.weaponVerb + ' with your ' + CoC.player.armorName + '.', false );
			} else {
				EngineCore.outputText( 'You deflect and block every ' + this.weaponVerb + ' ' + this.a + this.short + ' throws at you.', false );
			}
		}
		//everyone else;
		else {
			var choice = Utils.rand( 3 );
			//(regular attack 1);
			if( choice === 0 ) {
				EngineCore.outputText( 'Ducking in close, the girl thunders a punch against your midsection, leaving a painful sting.', false );
			}
			//(regular attack 2);
			else if( choice === 1 ) {
				EngineCore.outputText( 'The girl feints a charge, leans back, and snaps a kick against your ' + Descriptors.hipDescript() + '. You stagger, correct your posture, and plunge back into combat.', false );
			}
			//(regular attack 3);
			else if( choice === 2 ) {
				EngineCore.outputText( 'You momentarily drop your guard as the girl appears to stumble. She rights herself as you step forward and lands a one-two combination against your torso.', false );
			}
			EngineCore.outputText( ' (' + damage + ')', false );
		}
		if( damage > 0 ) {
			if( this.lustVuln > 0 && CoC.player.armorName === 'barely-decent bondage straps' ) {
				EngineCore.outputText( '\n' + this.getCapitalA() + this.short + ' brushes against your exposed skin and jerks back in surprise, coloring slightly from seeing so much of you revealed.', false );
				this.lust += 5 * this.lustVuln;
			}
		}
		EngineCore.statScreenRefresh();
		EngineCore.outputText( '\n', false );
		Combat.combatRoundOver();
	};
	//(lust attack 1);
	Shouldra.prototype.shouldraLustAttack = function() {
		if( Utils.rand( 2 ) === 0 ) {
			EngineCore.outputText( 'The girl spins away from one of your swings, her tunic flaring around her hips. The motion gives you a good view of her firm and moderately large butt. She notices your glance and gives you a little wink.\n', false );
		} else {
			EngineCore.outputText( 'The girl\'s feet get tangled on each other and she tumbles to the ground. Before you can capitalize on her slip, she rolls with the impact and comes up smoothly. As she rises, however, you reel back and raise an eyebrow in confusion; are her breasts FILLING the normally-loose tunic? She notices your gaze and smiles, performing a small pirouette on her heel before squaring up to you again. Your confusion only heightens when her torso comes back into view, her breasts back to their normal proportions. A trick of the light, perhaps? You shake your head and try to fall into the rhythm of the fight.\n', false );
		}
		EngineCore.dynStats( 'lus', (8 + CoC.player.lib / 10) );
		Combat.combatRoundOver();
	};
	//(magic attack);
	Shouldra.prototype.shouldraMagicLazers = function() {
		var damage = CoC.player.takeDamage( 20 + Utils.rand( 10 ) );
		EngineCore.outputText( 'Falling back a step, the girl raises a hand and casts a small spell. From her fingertips shoot four magic missiles that slam against your skin and cause a surprising amount of discomfort. (' + damage + ')\n', false );
		Combat.combatRoundOver();
	};
	Shouldra.prototype.performCombatAction = function() {
		var attack = Utils.rand( 3 );
		if( attack === 0 ) {
			this.shouldrattack();
		} else if( attack === 1 ) {
			this.shouldraLustAttack();
		} else {
			this.shouldraMagicLazers();
		}
	};
	Shouldra.prototype.defeated = function() {
		SceneLib.shouldraScene.defeatDannyPhantom();
	};
	Shouldra.prototype.won = function() {
		SceneLib.shouldraScene.loseToShouldra();
	};
	Shouldra.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		that.classNames.push('Shouldra');
		that.a = 'the ';
		that.short = 'plain girl';
		that.imageName = 'shouldra';
		that.long = 'Her face has nothing overly attractive about it; a splash of freckles flits across her cheeks, her brows are too strong to be considered feminine, and her jaw is a tad bit square. Regardless, the features come together to make an aesthetically pleasing countenance, framed by a stylish brown-haired bob. Her breasts are obscured by her grey, loose-fitting tunic, flowing down to reach the middle of her thigh. Her legs are clad in snug, form-fitting leather breeches, and a comfortable pair of leather shoes shield her soles from the potentially harmful environment around her.';
		that.createVagina( false, AppearanceDefs.VAGINA_WETNESS_WET, AppearanceDefs.VAGINA_LOOSENESS_NORMAL );
		that.createStatusAffect( StatusAffects.BonusVCapacity, 40, 0, 0, 0 );
		that.createBreastRow( Appearance.breastCupInverse( 'D' ) );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_TIGHT;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_DRY;
		that.createStatusAffect( StatusAffects.BonusACapacity, 40, 0, 0, 0 );
		that.tallness = 65;
		that.hipRating = AppearanceDefs.HIP_RATING_AMPLE;
		that.buttRating = AppearanceDefs.BUTT_RATING_AVERAGE + 1;
		that.skinTone = 'white';
		that.hairColor = 'white';
		that.hairLength = 3;
		that.initStrTouSpeInte( 45, 30, 5, 110 );
		that.initLibSensCor( 100, 0, 33 );
		that.weaponName = 'fists';
		that.weaponVerb = 'punches';
		that.armorName = 'comfortable clothes';
		that.bonusHP = 30;
		that.lust = 10;
		that.temperment = Monster.TEMPERMENT_LUSTY_GRAPPLES;
		that.level = 4;
		that.gems = 0;
		that.drop = new ChainedDrop().add( ConsumableLib.ECTOPLS, 1 / 3 );
		that.checkMonster();
	};
	return Shouldra;
} );