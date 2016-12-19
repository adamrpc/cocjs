'use strict';

angular.module( 'cocjs' ).factory( 'Izma', function( SceneLib, MainView, PerkLib, CoC, Monster, Utils, StatusAffects, Appearance, AppearanceDefs, Combat, EngineCore ) {
	function Izma() {
		this.init(this, arguments);
	}
	angular.extend(Izma.prototype, Monster.prototype);
	//[Special Attacks];
	Izma.prototype.IzmaSpecials1 = function() {
		//Blind dodge change;
		if( this.findStatusAffect( StatusAffects.Blind ) >= 0 && Utils.rand( 3 ) < 2 ) {
			MainView.outputText( 'Izma attempts to close the distance with you, but misses completely because of her blindness.\n', false );
			return;
		}
		//Determine if dodged!;
		if( CoC.player.spe - this.spe > 0 && Math.ceil( Math.random() * (((CoC.player.spe - this.spe) / 4) + 80) ) > 80 ) {
			MainView.outputText( 'Izma attempts to get close, but you manage to side-step her before she can lay her gauntleted hands on you.\n', false );
			return;
		}
		//Determine if evaded;
		if( CoC.player.findPerk( PerkLib.Evade ) >= 0 && Utils.rand( 100 ) < 10 ) {
			MainView.outputText( 'Izma attempts to get close, but you manage to side-step her before she can lay her gauntleted hands on you.\n', false );
			return;
		}
		//('Misdirection';
		if( CoC.player.findPerk( PerkLib.Misdirection ) >= 0 && Utils.rand( 100 ) < 10 && CoC.player.armorName === 'red, high-society bodysuit' ) {
			MainView.outputText( 'Izma attempts to get close, but you put Raphael\'s teachings to use and side-step the sharkgirl, confusing her with your movements.\n', false );
			return;
		}
		//Determine if cat'ed;
		if( CoC.player.findPerk( PerkLib.Flexibility ) >= 0 && Utils.rand( 100 ) < 6 ) {
			MainView.outputText( 'Izma attempts to get close, but you manage to side-step her before she can lay her gauntleted hands on you.\n', false );
			return;
		}
		MainView.outputText( 'Izma rushes you with impressive speed, striking a few precise locations on your joints with her fingertips before leaping back.  It doesn\'t hurt, but you feel tired and sore. "<i>Pressure points...</i>" she laughs, seeing your confused expression.', false );
		//(Fatigue damage);
		EngineCore.fatigue( 20 + Utils.rand( 20 ) );
	};
	Izma.prototype.IzmaSpecials2 = function() {
		//Blind dodge change;
		if( this.findStatusAffect( StatusAffects.Blind ) >= 0 && Utils.rand( 3 ) < 2 ) {
			MainView.outputText( 'Izma blindly tries to clinch you, but misses completely.\n', false );
			return;
		}
		//Determine if dodged!;
		if( CoC.player.spe - this.spe > 0 && Math.ceil( Math.random() * (((CoC.player.spe - this.spe) / 4) + 80) ) > 80 ) {
			MainView.outputText( 'Izma tries to clinch you, but you use your speed to keep just out of reach.\n', false );
			return;
		}
		//Determine if evaded;
		if( CoC.player.findPerk( PerkLib.Evade ) >= 0 && Utils.rand( 100 ) < 10 ) {
			MainView.outputText( 'Izma tries to clinch you, but she didn\'t count on your skills in evasion.  You manage to sidestep her at the last second.\n', false );
			return;
		}
		//('Misdirection';
		if( CoC.player.findPerk( PerkLib.Misdirection ) >= 0 && Utils.rand( 100 ) < 10 && CoC.player.armorName === 'red, high-society bodysuit' ) {
			MainView.outputText( 'Izma ducks and weaves forward to clinch you, but thanks to Raphael\'s teachings, you\'re easily able to misguide her and avoid the clumsy grab.\n', false );
			return;
		}
		//Determine if cat'ed;
		if( CoC.player.findPerk( PerkLib.Flexibility ) >= 0 && Utils.rand( 100 ) < 6 ) {
			MainView.outputText( 'Izma tries to lock you in a clinch, but your cat-like flexibility makes it easy to twist away from her grab.\n', false );
			return;
		}
		var damage = 0;
		damage = Math.round( 130 - Utils.rand( CoC.player.tou + CoC.player.armorDef ) );
		if( damage < 0 ) {
			damage = 0;
		}
		MainView.outputText( 'Izma ducks and jinks, working to close quarters, and clinches you. Unable to get your weapon into play, you can only ', false );
		if( CoC.player.armorDef >= 10 || damage === 0 ) {
			//(armor-dependent Health damage, fullplate, chain, scale, and bee chitin armor are unaffected, has a chance to inflict 'Bleed' damage which removes 2-5% of health for the next three turns if successful);
			damage = CoC.player.takeDamage( damage );
			MainView.outputText( 'writhe as she painfully drags the blades of her glove down your back', false );
			CoC.player.createStatusAffect( StatusAffects.IzmaBleed, 3, 0, 0, 0 );
		} else {
			MainView.outputText( 'laugh as her blades scape uselessly at your armor-clad back', false );
		}
		MainView.outputText( ' before breaking her embrace and leaping away. (' + damage + ')', false );
	};
	Izma.prototype.IzmaSpecials3 = function() {
		MainView.outputText( 'Rather than move to attack you, Izma grins at you and grabs her breasts, massaging them as she caresses her long penis with one knee. Her tail thrashes and thumps the sand heavily behind her as she simulates an orgasm, moaning loudly into the air. The whole display leaves you more aroused than before.', false );
		//(lust gain);
		EngineCore.dynStats( 'lus', (20 + CoC.player.lib / 5) );
	};
	Izma.prototype.IzmaAI = function() {
		var choice = Utils.rand( 5 );
		if( choice <= 1 ) {
			this.eAttack();
		}
		if( choice === 2 ) {
			if( CoC.player.fatigue >= 80 ) {
				choice = 3;
			} else {
				this.IzmaSpecials1();
			}
		}
		if( choice === 3 ) {
			if( CoC.player.armorDef >= 10 && Utils.rand( 3 ) === 0 ) {
				this.IzmaSpecials2();
			} else {
				choice = 4;
			}
		}
		if( choice === 4 ) {
			this.IzmaSpecials3();
		}
		Combat.combatRoundOver();
	};
	Izma.prototype._superEAttack = Izma.prototype.eAttack;
	Izma.prototype.eAttack = function() {
		MainView.outputText( 'Izma slides up to you, throws a feint, and then launches a rain of jabs at you!\n', false );
		this._superEAttack();
	};
	Izma.prototype.performCombatAction = function() {
		var choice = Utils.rand( 5 );
		if( choice <= 1 ) {
			this.eAttack();
		}
		if( choice === 2 ) {
			if( CoC.player.fatigue >= 80 ) {
				choice = 3;
			} else {
				this.IzmaSpecials1();
			}
		}
		if( choice === 3 ) {
			if( CoC.player.armorDef >= 10 && Utils.rand( 3 ) === 0 ) {
				this.IzmaSpecials2();
			} else {
				choice = 4;
			}
		}
		if( choice === 4 ) {
			this.IzmaSpecials3();
		}
		Combat.combatRoundOver();
	};
	Izma.prototype.defeated = function() {
		SceneLib.izmaScene.defeatIzma();
	};
	/* jshint unused:true */
	Izma.prototype.won = function( hpVictory, pcCameWorms ) {
		if( pcCameWorms ) {
			MainView.outputText( '\n\n"<i>Gross!</i>" Izma cries as she backs away, leaving you to recover alone.' );
			Combat.cleanupAfterCombat();
		} else {
			SceneLib.izmaScene.IzmaWins();
		}
	};
	Izma.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		that.classNames.push('Izma');
		that.a = '';
		that.short = 'Izma';
		that.imageName = 'izma';
		that.long = 'Izma the tigershark stands a bit over 6\' tall, with orange skin bearing horizontal stripes covering most of her body.  Her silver-white hair cascades past her shoulders, draping over an impressive pair of DD-cup breasts barely restrained by a skimpy black bikini top.  Under the knee-length grass skirt below them rustles her beastly fifteen-inch penis and four-balled sack; you catch occasional glimpses of them as she moves.  She\'s tucked her usual reading glasses into her locker at the moment.';
		that.createCock( 15, 2.2 );
		that.balls = 4;
		that.ballSize = 3;
		that.createVagina( false, AppearanceDefs.VAGINA_WETNESS_SLICK, AppearanceDefs.VAGINA_LOOSENESS_LOOSE );
		that.createStatusAffect( StatusAffects.BonusVCapacity, 45, 0, 0, 0 );
		that.createBreastRow( Appearance.breastCupInverse( 'DD' ) );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_NORMAL;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_DRY;
		that.createStatusAffect( StatusAffects.BonusACapacity, 30, 0, 0, 0 );
		that.tallness = 5 * 12 + 5;
		that.hipRating = AppearanceDefs.HIP_RATING_CURVY;
		that.buttRating = AppearanceDefs.BUTT_RATING_NOTICEABLE;
		that.skinTone = 'striped orange';
		that.hairColor = 'silver';
		that.hairLength = 20;
		that.initStrTouSpeInte( 80, 90, 85, 65 );
		that.initLibSensCor( 75, 25, 40 );
		that.weaponName = 'clawed gauntlets';
		that.weaponVerb = 'clawed punches';
		that.weaponAttack = 45;
		that.armorName = 'bikini and grass skirt';
		that.armorDef = 8;
		that.bonusHP = 330;
		that.lust = 20;
		that.lustVuln = 0.20;
		that.temperment = Monster.TEMPERMENT_RANDOM_GRAPPLES;
		that.level = 15;
		that.gems = Utils.rand( 5 ) + 1;
		that.drop = Monster.NO_DROP;
		that.checkMonster();
	};
	return Izma;
} );