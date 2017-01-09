'use strict';

angular.module( 'cocjs' ).factory( 'Monster', function( SceneLib, MainView, Creature, AppearanceDefs, Utils, CoC_Settings, StatusAffects, CoC, EngineCore, WeightedDrop, Combat, kFLAGS ) {
	function Monster() {
		this.init(this, arguments);
	}
	angular.extend(Monster.prototype, Creature.prototype);
	Monster.prototype.init = function( that, args ) {
		Creature.prototype.init( that, args );
		that.classNames.push('Monster');
		that.bonusHP = 0;
		that.long = null;
		that.plural = false;
		that.imageName = '';
		that.lustVuln = 1;
		that.temperment = Monster.TEMPERMENT_AVOID_GRAPPLES;
		that.special1 = null;
		that.special2 = null;
		that.special3 = null;
		// He
		that.pronoun1 = '';
		// Him
		that.pronoun2 = '';
		// His
		that.pronoun3 = '';
		that.drop = null;
		that.gender = AppearanceDefs.GENDER_NONE;
		that.checkCalled = false;
		that.checkError = '';
		that.initsCalled = {
			a: false,
			short: false,
			long: false,
			genitals: false,
			breasts: false,
			tallness: false,
			str_tou_spe_inte: false,
			lib_sens_cor: false,
			drop: false
		};
		that.onDefeated = null;
		that.onWon = null;
		that.onPcRunAttempt = null;
	};
	/**
	 * this.temperment - used for determining grapple behaviors
	 * 0 - avoid grapples/break grapple
	 * 1 - lust determines > 50 grapple
	 * 2 - random
	 * 3 - love grapples
	 */
	Monster.TEMPERMENT_AVOID_GRAPPLES = 0;
	Monster.TEMPERMENT_LUSTY_GRAPPLES = 1;
	Monster.TEMPERMENT_RANDOM_GRAPPLES = 2;
	Monster.TEMPERMENT_LOVE_GRAPPLES = 3;
	Monster.prototype.getPronoun1 = function() {
		if( this.pronoun1 === '' ) {
			return '';
		}
		return this.pronoun1.substr( 0, 1 ).toUpperCase() + this.pronoun1.substr( 1 );
	};
	Monster.prototype.getPronoun2 = function() {
		if( this.pronoun2 === '' ) {
			return '';
		}
		return this.pronoun2.substr( 0, 1 ).toUpperCase() + this.pronoun2.substr( 1 );
	};
	Monster.prototype.getPronoun3 = function() {
		if( this.pronoun3 === '' ) {
			return '';
		}
		return this.pronoun3.substr( 0, 1 ).toUpperCase() + this.pronoun3.substr( 1 );
	};
	Monster.prototype.eMaxHP = function() {
		return this.tou * 2 + 50 + this.bonusHP;
	};
	Monster.prototype.addHP = function( hp ) {
		this.HP += hp;
		if( this.HP < 0 ) {
			this.HP = 0;
		} else if( this.HP > this.eMaxHP() ) {
			this.HP = this.eMaxHP();
		}
	};
	/**
	 * @return HP/eMaxHP()
	 */
	Monster.prototype.HPRatio = function() {
		return this.HP / this.eMaxHP();
	};

	/**
	 * @return damage not reduced by player stats
	 */
	Monster.prototype.eBaseDamage = function() {
		return this.str + this.weaponAttack;
	};

	/**
	 * @return randomized damage reduced by player stats
	 */
	Monster.prototype.calcDamage = function() {
		return CoC.player.reduceDamage(this.eBaseDamage());
	};
	Monster.prototype.totalXP = function(playerLevel) {
		if( playerLevel === undefined || playerLevel === -1 ) {
			playerLevel = CoC.player.level;
		}
		//
		// 1) Nerf xp gains by 20% per level after first two level difference
		// 2) No bonuses for underlevel!
		// 3) Super high level folks (over 10 levels) only get 1 xp!
		var difference = playerLevel - this.level;
		if( difference <= 2 ) {
			difference = 0;
		} else {
			difference -= 2;
		}
		if( difference > 4 ) {
			difference = 4;
		}
		difference = (5 - difference) * 20.0 / 100.0;
		if( playerLevel - this.level > 10 ) {
			return 1;
		}
		return Math.round( this.additionalXP + (this.baseXP() + this.bonusXP()) * difference );
	};
	Monster.prototype.baseXP = function() {
		return [ 200, 10, 20, 30, 40, 50, 55, 60, 66, 75,//0-9
				83, 85, 92, 100, 107, 115, 118, 121, 128, 135,//10-19
				145 ][ Math.round( this.level ) ] || 200;
	};
	Monster.prototype.bonusXP = function() {
		return Utils.rand( [ 200, 10, 20, 30, 40, 50, 55, 58, 66, 75,
				83, 85, 85, 86, 92, 94, 96, 98, 99, 101,
				107 ][ Math.round( this.level ) ] || 130 );
	};
	Monster.NO_DROP = new WeightedDrop();
	Monster.prototype.isFullyInit = function() {
		var that = this;
		return !_.find( _.keys( this.initsCalled ), function( key ) {
			return ((_.has( that, key ) && that[ key ] === null) || !_.has( that, key )) && !that.initsCalled[ key ];
		} );
	};
	Monster.prototype.missingInits = function() {
		var that = this;
		return _.filter( _.keys( this.initsCalled ), function( key ) {
			return ((_.has( that, key ) && that[ key ] === null) || !_.has( that, key )) && !that.initsCalled[ key ];
		} ).join( ', ' );
	};
	Monster.prototype._super_createCock = Monster.prototype.createCock;
	Monster.prototype.createCock = function( clength, cthickness, ctype ) {
		if( clength === undefined ) {
			clength = 5.5;
		}
		if( clength === undefined ) {
			clength = 5.5;
		}
		this.initsCalled.genitals = true;
		if( !this.checkCalled ) {
			if( this.plural ) {
				this.pronoun1 = 'they';
				this.pronoun2 = 'them';
				this.pronoun3 = 'their';
			} else {
				this.pronoun1 = 'he';
				this.pronoun2 = 'him';
				this.pronoun3 = 'his';
			}
		}
		var result = this._super_createCock( clength, cthickness, ctype );
		this.genderCheck();
		return result;
	};
	Monster.prototype._super_createVagina = Monster.prototype.createVagina;
	Monster.prototype.createVagina = function( virgin, vaginalWetness, vaginalLooseness ) {
		if( virgin === undefined ) {
			virgin = true;
		}
		if( vaginalWetness === undefined ) {
			vaginalWetness = 1;
		}
		if( vaginalLooseness === undefined ) {
			vaginalLooseness = 0;
		}
		this.initsCalled.genitals = true;
		if( !this.checkCalled ) {
			if( this.plural ) {
				this.pronoun1 = 'they';
				this.pronoun2 = 'them';
				this.pronoun3 = 'their';
			} else {
				this.pronoun1 = 'she';
				this.pronoun2 = 'her';
				this.pronoun3 = 'her';
			}
		}
		var result = this._super_createVagina( virgin, vaginalWetness, vaginalLooseness );
		this.genderCheck();
		return result;
	};
	Monster.prototype.initGenderless = function() {
		this.cocks = [];
		this.vaginas = [];
		this.initsCalled.genitals = true;
		if( this.plural ) {
			this.pronoun1 = 'they';
			this.pronoun2 = 'them';
			this.pronoun3 = 'their';
		} else {
			this.pronoun1 = 'it';
			this.pronoun2 = 'it';
			this.pronoun3 = 'its';
		}
		this.genderCheck();
	};
	Monster.prototype._super_createBreastRow = Monster.prototype.createBreastRow;
	Monster.prototype.createBreastRow = function( size, nipplesPerBreast ) {
		if( size === undefined ) {
			size = 0;
		}
		if( nipplesPerBreast === undefined ) {
			nipplesPerBreast = 1;
		}
		this.initsCalled.breasts = true;
		return this._super_createBreastRow( size, nipplesPerBreast );
	};
	Monster.prototype.initStrTouSpeInte = function( str, tou, spe, inte ) {
		this.str = str;
		this.tou = tou;
		this.spe = spe;
		this.inte = inte;
		this.initsCalled.str_tou_spe_inte = true;
	};
	Monster.prototype.initLibSensCor = function( lib, sens, cor ) {
		this.lib = lib;
		this.sens = sens;
		this.cor = cor;
		this.initsCalled.lib_sens_cor = true;
	};
	Monster.prototype._super_validate = Monster.prototype.validate;
	Monster.prototype.validate = function() {
		var error = '';
		// 1. Required fields must be set
		if( !this.isFullyInit() ) {
			error += 'Missing phases: ' + this.missingInits() + '. ';
		}
		this.HP = this.eMaxHP();
		this.XP = this.totalXP();
		error += this._super_validate();
		error += Utils.validateNonNegativeNumberFields( this, 'Monster.validate', [
			'lustVuln', 'temperment'
		] );
		return error;
	};
	Monster.prototype.checkMonster = function() {
		this.checkCalled = true;
		this.checkError = this.validate();
		if( this.checkError.length > 0 ) {
			CoC_Settings.error( 'Monster not initialized:' + this.checkError );
		}
		return this.checkError.length === 0;
	};
	/**
	 * try to hit, apply damage
	 * @return damage
	 */
	Monster.prototype.eOneAttack = function() {
		//Determine damage - str modified by enemy toughness!
		var damage = this.calcDamage();
		if( damage > 0 ) {
			damage = CoC.player.takeDamage( damage );
		}
		return damage;
	};
	/**
	 * return true if we land a hit
	 */
	Monster.prototype.attackSucceeded = function() {
		var attack = true;
		//Blind dodge change
		if( this.findStatusAffect( StatusAffects.Blind ) ) {
			attack = attack && this.handleBlind();
		}
		attack = attack && !this.playerDodged();
		return attack;
	};
	Monster.prototype.eAttack = function() {
		var attacks = this.statusAffectv1( StatusAffects.Attacks );
		if( attacks === 0 ) {
			attacks = 1;
		}
		while( attacks > 0 ) {
			if( this.attackSucceeded() ) {
				var damage = this.eOneAttack();
				this.outputAttack( damage );
				this.postAttack( damage );
				MainView.statsView.show();
				MainView.outputText( '\n', false );
			}
			if( this.statusAffectv1( StatusAffects.Attacks ) >= 0 ) {
				this.addStatusValue( StatusAffects.Attacks, 1, -1 );
			}
			attacks--;
		}
		this.removeStatusAffect( StatusAffects.Attacks );
		SceneLib.combatScene.combatRoundOver(); //The doNext here was not required
	};
	/**
	 * Called no matter of success of the attack
	 * @param damage damage received by player
	 */
	Monster.prototype.postAttack = function( damage ) {
		if( damage > 0 ) {
			if( this.lustVuln > 0 && CoC.player.armorName === 'barely-decent bondage straps' ) {
				if( !this.plural ) {
					MainView.outputText( '\n' + this.getCapitalA() + this.short + ' brushes against your exposed skin and jerks back in surprise, coloring slightly from seeing so much of you revealed.', false );
				} else {
					MainView.outputText( '\n' + this.getCapitalA() + this.short + ' brush against your exposed skin and jerk back in surprise, coloring slightly from seeing so much of you revealed.', false );
				}
				this.lust += 5 * this.lustVuln;
			}
		}
	};
	Monster.prototype.outputAttack = function( damage ) {
		if( damage <= 0 ) {
			//Due to toughness or amor...
			if( Utils.rand( CoC.player.armorDef + CoC.player.tou ) < CoC.player.armorDef ) {
				MainView.outputText( 'You absorb and deflect every ' + this.weaponVerb + ' with your ' + CoC.player.armorName + '.', false );
			} else {
				if( this.plural ) {
					MainView.outputText( 'You deflect and block every ' + this.weaponVerb + ' ' + this.a + this.short + ' throw at you.', false );
				} else {
					MainView.outputText( 'You deflect and block every ' + this.weaponVerb + ' ' + this.a + this.short + ' throws at you.', false );
				}
			}
		} else if( damage < 6 ) {
			MainView.outputText( 'You are struck a glancing blow by ' + this.a + this.short + '! (' + damage + ')', false );
		} else if( damage < 11 ) {
			MainView.outputText( this.getCapitalA() + this.short + ' wound' );
			if( !this.plural ) {
				MainView.outputText( 's' );
			}
			MainView.outputText( ' you! (' + damage + ')', false );
		} else if( damage < 21 ) {
			MainView.outputText( this.getCapitalA() + this.short + ' stagger' );
			if( !this.plural ) {
				MainView.outputText( 's' );
			}
			MainView.outputText( ' you with the force of ' + this.pronoun3 + ' ' + this.weaponVerb + '! (' + damage + ')', false );
		} else if( damage > 20 ) {
			MainView.outputText( this.getCapitalA() + this.short + ' <b>mutilate', false );
			if( !this.plural ) {
				MainView.outputText( 's', false );
			}
			MainView.outputText( '</b> you with ' + this.pronoun3 + ' powerful ' + this.weaponVerb + '! (' + damage + ')', false );
		}
	};
	/**
	 * @return true if continue with attack
	 */
	Monster.prototype.handleBlind = function() {
		if( Utils.rand( 3 ) < 2 ) {
			if( this.weaponVerb === 'tongue-slap' ) {
				MainView.outputText( this.getCapitalA() + this.short + ' completely misses you with a thrust from ' + this.pronoun3 + ' tongue!\n', false );
			} else {
				MainView.outputText( this.getCapitalA() + this.short + ' completely misses you with a blind attack!\n', false );
			}
			return false;
		}
		return true;
	};
	/**
	 * print something about how we miss the player
	 */
	Monster.prototype.outputPlayerDodged = function( dodge ) {
		if( dodge === 1 ) {
			MainView.outputText( 'You narrowly avoid ' + this.a + this.short + '\'s ' + this.weaponVerb + '!\n', false );
		} else if( dodge === 2 ) {
			MainView.outputText( 'You dodge ' + this.a + this.short + '\'s ' + this.weaponVerb + ' with superior quickness!\n', false );
		} else {
			MainView.outputText( 'You deftly avoid ' + this.a + this.short );
			if( this.plural ) {
				MainView.outputText( '\'' );
			} else {
				MainView.outputText( '\'s' );
			}
			MainView.outputText( ' slow ' + this.weaponVerb + '.\n', false );
		}
	};
	Monster.prototype.playerCanDodge = function() {
		return true;
	};
	Monster.prototype.playerDodged = function() {
		//Determine if dodged!
		var dodge = CoC.player.speedDodge( this );
		if( dodge > 0 ) {
			this.outputPlayerDodged( dodge );
			return true;
		}
		//Determine if evaded
		if( Combat.combatEvade() ) {
			MainView.outputText( 'Using your skills at evading attacks, you anticipate and sidestep ' + this.a + this.short + '\'' );
			if( !this.plural ) {
				MainView.outputText( 's' );
			}
			MainView.outputText( ' attack.\n', false );
			return true;
		}
		//('Misdirection'
		if( Combat.combatMisdirect() ) {
			MainView.outputText( 'Using Raphael\'s teachings, you anticipate and sidestep ' + this.a + this.short + '\' attacks.\n', false );
			return true;
		}
		//Determine if cat'ed
		if( Combat.combatFlexibility() ) {
			MainView.outputText( 'With your incredible flexibility, you squeeze out of the way of ' + this.a + this.short + '', false );
			if( this.plural ) {
				MainView.outputText( '\' attacks.\n', false );
			} else {
				MainView.outputText( '\'s attack.\n', false );
			}
			return true;
		}
		return false;
	};
	Monster.prototype.doAI = function() {
		if( this.findStatusAffect( StatusAffects.Stunned ) ) {
			if( !this.handleStun() ) {
				return;
			}
		}
		if( this.findStatusAffect( StatusAffects.Fear ) ) {
			if( !this.handleFear() ) {
				return;
			}
		}
		//Exgartuan gets to do stuff!
		if( CoC.player.findStatusAffect( StatusAffects.Exgartuan ) && CoC.player.statusAffectv2( StatusAffects.Exgartuan ) === 0 && Utils.rand( 3 ) === 0 ) {
			if( CoC.exgartuan.exgartuanCombatUpdate() ) {
				MainView.outputText( '\n\n', false );
			}
		}
		if( this.findStatusAffect( StatusAffects.Constricted ) ) {
			if( !this.handleConstricted() ) {
				return;
			}
		}
		//If grappling... TODO implement grappling
		this.performCombatAction();
	};
	/**
	 * Called if monster is constricted. Should return true if constriction is ignored and need to proceed with ai
	 */
	Monster.prototype.handleConstricted = function() {
		//Enemy struggles -
		MainView.outputText( 'Your prey pushes at your tail, twisting and writhing in an effort to escape from your tail\'s tight bonds.', false );
		if( this.statusAffectv1( StatusAffects.Constricted ) <= 0 ) {
			MainView.outputText( '  ' + this.getCapitalA() + this.short + ' proves to be too much for your tail to handle, breaking free of your tightly bound coils.', false );
			this.removeStatusAffect( StatusAffects.Constricted );
		}
		this.addStatusValue( StatusAffects.Constricted, 1, -1 );
		SceneLib.combatScene.combatRoundOver();
		return false;
	};
	/**
	 * Called if monster is under fear. Should return true if fear ignored and need to proceed with ai
	 */
	Monster.prototype.handleFear = function() {
		if( this.statusAffectv1( StatusAffects.Fear ) === 0 ) {
			if( this.plural ) {
				this.removeStatusAffect( StatusAffects.Fear );
				MainView.outputText( 'Your foes shake free of their fear and ready themselves for battle.', false );
			} else {
				this.removeStatusAffect( StatusAffects.Fear );
				MainView.outputText( 'Your foe shakes free of its fear and readies itself for battle.', false );
			}
		} else {
			this.addStatusValue( StatusAffects.Fear, 1, -1 );
			if( this.plural ) {
				MainView.outputText( this.getCapitalA() + this.short + ' are too busy shivering with fear to fight.', false );
			} else {
				MainView.outputText( this.getCapitalA() + this.short + ' is too busy shivering with fear to fight.', false );
			}
		}
		SceneLib.combatScene.combatRoundOver();
		return false;
	};
	/**
	 * Called if monster is stunned. Should return true if stun is ignored and need to proceed with ai.
	 */
	Monster.prototype.handleStun = function() {
		if( this.plural ) {
			MainView.outputText( 'Your foes are too dazed from your last hit to strike back!', false );
		} else {
			MainView.outputText( 'Your foe is too dazed from your last hit to strike back!', false );
		}
		if( this.statusAffectv1( StatusAffects.Stunned ) <= 0 ) {
			this.removeStatusAffect( StatusAffects.Stunned );
		} else {
			this.addStatusValue( StatusAffects.Stunned, 1, -1 );
		}
		SceneLib.combatScene.combatRoundOver();
		return false;
	};
	/**
	 * This method is called after all stun/fear/constricted checks.
	 * Default chance to do physical or special (if any) attack
	 */
	Monster.prototype.performCombatAction = function() {
		var action = _.sample( _.filter( [ this.eAttack, this.special1, this.special2, this.special3 ], function( special ) {
			return special !== null;
		} ) );
		action.apply(this);
	};
	/**
	 * All branches of this method and all subsequent scenes should end either with
	 * 'cleanupAfterCombat', 'awardPlayer' or 'finishCombat'. The latter also displays
	 * default message like 'you defeat %s' or '%s falls and starts masturbating'
	 */
	Monster.prototype.defeated = function( ) {
		SceneLib.combatScene.finishCombat();
	};
	/**
	 * All branches of this method and all subsequent scenes should end with
	 * 'cleanupAfterCombat'.
	 */
	Monster.prototype.won = function( hpVictory ) {
		if( hpVictory ) {
			CoC.player.HP = 1;
			MainView.outputText( 'Your wounds are too great to bear, and you fall unconscious.', true );
		} else {
			MainView.outputText( 'Your desire reaches uncontrollable levels, and you end up openly masturbating.\n\nThe lust and pleasure cause you to black out for hours on end.', true );
			CoC.player.lust = 0;
		}
		CoC.setInCombat( false );
		CoC.player.clearStatuses( false );
		var temp = Utils.rand( 10 ) + 1;
		if( temp > CoC.player.gems ) {
			temp = CoC.player.gems;
		}
		MainView.outputText( '\n\nYou\'ll probably wake up in eight hours or so, missing ' + temp + ' gems.', false );
		CoC.player.gems -= temp;
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseEightHours );
	};
	/**
	 * Final method to handle hooks before calling overriden method
	 */
	Monster.prototype.defeated_ = function( hpVictory ) {
		if( this.onDefeated !== null ) {
			this.onDefeated( hpVictory );
		} else {
			this.defeated( hpVictory );
		}
	};
	/**
	 * Final method to handle hooks before calling overriden method
	 */
	Monster.prototype.won_ = function( hpVictory, pcCameWorms ) {
		if( this.onWon !== null ) {
			this.onWon( hpVictory, pcCameWorms );
		} else {
			this.won( hpVictory, pcCameWorms );
		}
	};
	/**
	 * Display tease reaction message. Then call applyTease() to increase lust.
	 * @param lustDelta value to be added to lust (already modified by lustVuln etc)
	 */
	Monster.prototype.teased = function( lustDelta ) {
		this.outputDefaultTeaseReaction( lustDelta );
		if( lustDelta > 0 ) {
			//Imp mob uber interrupt!
			if( this.findStatusAffect( StatusAffects.ImpUber ) ) { // TODO move to proper class
				MainView.outputText( '\nThe imps in the back stumble over their spell, their loincloths tenting obviously as your display interrupts their casting.  One of them spontaneously orgasms, having managed to have his spell backfire.  He falls over, weakly twitching as a growing puddle of whiteness surrounds his defeated form.', false );
				//(-5% of max enemy HP)
				this.HP -= this.bonusHP * 0.05;
				this.lust -= 15;
				this.removeStatusAffect( StatusAffects.ImpUber );
				this.createStatusAffect( StatusAffects.ImpSkip, 0, 0, 0, 0 );
			}
		}
		this.applyTease( lustDelta );
	};
	Monster.prototype.outputDefaultTeaseReaction = function( lustDelta ) {
		if( this.plural ) {
			if( lustDelta === 0 ) {
				MainView.outputText( '\n\n' + this.getCapitalA() + this.short + ' seem unimpressed.', false );
			}
			if( lustDelta > 0 && lustDelta < 4 ) {
				MainView.outputText( '\n' + this.getCapitalA() + this.short + ' look intrigued by what ' + this.pronoun1 + ' see.', false );
			}
			if( lustDelta >= 4 && lustDelta < 10 ) {
				MainView.outputText( '\n' + this.getCapitalA() + this.short + ' definitely seem to be enjoying the show.', false );
			}
			if( lustDelta >= 10 && lustDelta < 15 ) {
				MainView.outputText( '\n' + this.getCapitalA() + this.short + ' openly stroke ' + this.pronoun2 + 'selves as ' + this.pronoun1 + ' watch you.', false );
			}
			if( lustDelta >= 15 && lustDelta < 20 ) {
				MainView.outputText( '\n' + this.getCapitalA() + this.short + ' flush hotly with desire, ' + this.pronoun3 + ' eyes filled with longing.', false );
			}
			if( lustDelta >= 20 ) {
				MainView.outputText( '\n' + this.getCapitalA() + this.short + ' lick ' + this.pronoun3 + ' lips in anticipation, ' + this.pronoun3 + ' hands idly stroking ' + this.pronoun3 + ' bodies.', false );
			}
		} else {
			if( lustDelta === 0 ) {
				MainView.outputText( '\n' + this.getCapitalA() + this.short + ' seems unimpressed.', false );
			}
			if( lustDelta > 0 && lustDelta < 4 ) {
				if( this.plural ) {
					MainView.outputText( '\n' + this.getCapitalA() + this.short + ' looks intrigued by what ' + this.pronoun1 + ' see.', false );
				} else {
					MainView.outputText( '\n' + this.getCapitalA() + this.short + ' looks intrigued by what ' + this.pronoun1 + ' sees.', false );
				}
			}
			if( lustDelta >= 4 && lustDelta < 10 ) {
				MainView.outputText( '\n' + this.getCapitalA() + this.short + ' definitely seems to be enjoying the show.', false );
			}
			if( lustDelta >= 10 && lustDelta < 15 ) {
				if( this.plural ) {
					MainView.outputText( '\n' + this.getCapitalA() + this.short + ' openly strokes ' + this.pronoun2 + 'selves as ' + this.pronoun1 + ' watch you.', false );
				} else {
					MainView.outputText( '\n' + this.getCapitalA() + this.short + ' openly strokes ' + this.pronoun2 + 'self as ' + this.pronoun1 + ' watches you.', false );
				}
			}
			if( lustDelta >= 15 && lustDelta < 20 ) {
				if( this.plural ) {
					MainView.outputText( '\n' + this.getCapitalA() + this.short + ' flush hotly with desire, ' + this.pronoun3 + ' eyes filling with longing.', false );
				} else {
					MainView.outputText( '\n' + this.getCapitalA() + this.short + ' flushes hotly with desire, ' + this.pronoun3 + ' eyes filled with longing.', false );
				}
			}
			if( lustDelta >= 20 ) {
				if( this.plural ) {
					MainView.outputText( '\n' + this.getCapitalA() + this.short + ' licks ' + this.pronoun3 + ' lips in anticipation, ' + this.pronoun3 + ' hands idly stroking ' + this.pronoun3 + ' own bodies.', false );
				} else {
					MainView.outputText( '\n' + this.getCapitalA() + this.short + ' licks ' + this.pronoun3 + ' lips in anticipation, ' + this.pronoun3 + ' hands idly stroking ' + this.pronoun3 + ' own body.', false );
				}
			}
		}
	};
	Monster.prototype.applyTease = function( lustDelta ) {
		this.lust += lustDelta;
		lustDelta = Math.round( lustDelta * 10 ) / 10;
		MainView.outputText( ' (' + lustDelta + ')', false );
	};
	Monster.prototype.dropLoot = function() {
		return this.drop.roll();
	};
	Monster.prototype.combatRoundUpdate = function() {
		if( this.findStatusAffect( StatusAffects.MilkyUrta ) ) {
			SceneLib.urtaQuest.milkyUrtaTic();
		}
		//Countdown
		if( this.findStatusAffect( StatusAffects.TentacleCoolDown ) ) {
			this.addStatusValue( StatusAffects.TentacleCoolDown, 1, -1 );
			if( this.statusAffect( this.findStatusAffect( StatusAffects.TentacleCoolDown ) ).value1 === 0 ) {
				this.removeStatusAffect( StatusAffects.TentacleCoolDown );
			}
		}
		if( this.findStatusAffect( StatusAffects.CoonWhip ) ) {
			if( this.statusAffectv2( StatusAffects.CoonWhip ) <= 0 ) {
				this.armorDef += this.statusAffectv1( StatusAffects.CoonWhip );
				MainView.outputText( '<b>Tail whip wears off!</b>\n\n' );
				this.removeStatusAffect( StatusAffects.CoonWhip );
			} else {
				this.addStatusValue( StatusAffects.CoonWhip, 2, -1 );
				MainView.outputText( '<b>Tail whip is currently reducing your foe' );
				if( this.plural ) {
					MainView.outputText( 's\'' );
				} else {
					MainView.outputText( '\'s' );
				}
				MainView.outputText( ' armor by ' + this.statusAffectv1( StatusAffects.CoonWhip ) + '.</b>\n\n' );
			}
		}
		if( this.findStatusAffect( StatusAffects.Blind ) ) {
			this.addStatusValue( StatusAffects.Blind, 1, -1 );
			if( this.statusAffectv1( StatusAffects.Blind ) <= 0 ) {
				MainView.outputText( '<b>' + this.getCapitalA() + this.short + (this.plural ? ' are' : ' is') + ' no longer blind!</b>\n\n', false );
				this.removeStatusAffect( StatusAffects.Blind );
			} else {
				MainView.outputText( '<b>' + this.getCapitalA() + this.short + (this.plural ? ' are' : ' is') + ' currently blind!</b>\n\n', false );
			}
		}
		if( this.findStatusAffect( StatusAffects.Earthshield ) ) {
			MainView.outputText( '<b>' + this.getCapitalA() + this.short + ' is protected by a shield of rocks!</b>\n\n' );
		}
		if( this.findStatusAffect( StatusAffects.Sandstorm ) ) {
			if( CoC.player.findStatusAffect( StatusAffects.Blind ) ) {
				MainView.outputText( '<b>You blink the sand from your eyes, but you\'re sure that more will get you if you don\'t end it soon!</b>\n\n' );
				CoC.player.removeStatusAffect( StatusAffects.Blind );
			} else {
				if( this.statusAffectv1( StatusAffects.Sandstorm ) === 0 || this.statusAffectv1( StatusAffects.Sandstorm ) % 4 === 0 ) {
					CoC.player.createStatusAffect( StatusAffects.Blind, 0, 0, 0, 0 );
					MainView.outputText( '<b>The sand is in your eyes!  You\'re blinded this turn!</b>\n\n' );
				} else {
					MainView.outputText( '<b>The grainy mess cuts at any exposed flesh and gets into every crack and crevice of your armor.' );
					MainView.outputText( ' (' + CoC.player.takeDamage( 1 + Utils.rand( 2 ) ) + ')' );
					MainView.outputText( '</b>\n\n' );
				}
			}
			this.addStatusValue( StatusAffects.Sandstorm, 1, 1 );
		}
		if( this.findStatusAffect( StatusAffects.Stunned ) ) {
			MainView.outputText( '<b>' + this.getCapitalA() + this.short + ' is still stunned!</b>\n\n', false );
		}
		if( this.findStatusAffect( StatusAffects.Shell ) ) {
			if( this.statusAffectv1( StatusAffects.Shell ) >= 0 ) {
				MainView.outputText( '<b>A wall of many hues shimmers around ' + this.a + this.short + '.</b>\n\n' );
				this.addStatusValue( StatusAffects.Shell, 1, -1 );
			} else {
				MainView.outputText( '<b>The magical barrier ' + this.a + this.short + ' erected fades away to nothing at last.</b>\n\n' );
				this.removeStatusAffect( StatusAffects.Shell );
			}
		}
		if( this.findStatusAffect( StatusAffects.IzmaBleed ) ) {
			//Countdown to heal
			this.addStatusValue( StatusAffects.IzmaBleed, 1, -1 );
			//Heal wounds
			if( this.statusAffectv1( StatusAffects.IzmaBleed ) <= 0 ) {
				MainView.outputText( 'The wounds you left on ' + this.a + this.short + ' stop bleeding so profusely.\n\n', false );
				this.removeStatusAffect( StatusAffects.IzmaBleed );
			}
			//Deal damage if still wounded.
			else {
				var store = this.eMaxHP() * (3 + Utils.rand( 4 )) / 100;
				store = Combat.doDamage( store );
				if (CoC.monster.HP <= 0) {
					EngineCore.doNext( SceneLib.combatScene, SceneLib.combatScene.endHpVictory);
				}
				if( this.plural ) {
					MainView.outputText( this.getCapitalA() + this.short + ' bleed profusely from the jagged wounds your weapon left behind. (' + store + ')\n\n', false );
				} else {
					MainView.outputText( this.getCapitalA() + this.short + ' bleeds profusely from the jagged wounds your weapon left behind. (' + store + ')\n\n', false );
				}
			}
		}
		if( this.findStatusAffect( StatusAffects.Timer ) ) {
			if( this.statusAffectv1( StatusAffects.Timer ) <= 0 ) {
				this.removeStatusAffect( StatusAffects.Timer );
			}
			this.addStatusValue( StatusAffects.Timer, 1, -1 );
		}
		if( this.findStatusAffect( StatusAffects.LustStick ) ) {
			//LoT Effect Messages)) {
			switch( this.statusAffectv1( StatusAffects.LustStick ) ) {
				case 1:
					if( this.plural ) {
						MainView.outputText( 'One of ' + this.a + this.short + ' pants and crosses ' + this.mf( 'his', 'her' ) + ' eyes for a moment.  ' + this.mf( 'His', 'Her' ) + ' dick flexes and bulges, twitching as ' + this.mf( 'he', 'she' ) + ' loses himself in a lipstick-fueled fantasy.  When ' + this.mf( 'he', 'she' ) + ' recovers, you lick your lips and watch ' + this.mf( 'his', 'her' ) + ' blush spread.\n\n', false );
					} else {
						MainView.outputText( this.getCapitalA() + this.short + ' pants and crosses ' + this.pronoun3 + ' eyes for a moment.  ' + this.mf( 'His', 'Her' ) + ' dick flexes and bulges, twitching as ' + this.pronoun1 + ' loses ' + this.mf( 'himself', 'herself' ) + ' in a lipstick-fueled fantasy.  When ' + this.pronoun1 + ' recovers, you lick your lips and watch ' + this.mf( 'his', 'her' ) + ' blush spread.\n\n', false );
					}
					break;
				case 2:
					if( this.plural ) {
						MainView.outputText( this.getCapitalA() + this.short + ' moan out loud, ' + this.pronoun3 + ' dicks leaking and dribbling while ' + this.pronoun1 + ' struggle not to touch ' + this.pronoun2 + '.\n\n', false );
					} else {
						MainView.outputText( this.getCapitalA() + this.short + ' moans out loud, ' + this.pronoun3 + ' dick leaking and dribbling while ' + this.pronoun1 + ' struggles not to touch it.\n\n', false );
					}
					break;
				case 3:
					if( this.plural ) {
						MainView.outputText( this.getCapitalA() + this.short + ' pump ' + this.pronoun3 + ' hips futilely, air-humping non-existent partners.  Clearly your lipstick is getting to ' + this.pronoun2 + '.\n\n', false );
					} else {
						MainView.outputText( this.getCapitalA() + this.short + ' pumps ' + this.pronoun3 + ' hips futilely, air-humping a non-existent partner.  Clearly your lipstick is getting to ' + this.pronoun2 + '.\n\n', false );
					}
					break;
				case 4:
					if( this.plural ) {
						MainView.outputText( this.getCapitalA() + this.short + ' close ' + this.pronoun3 + ' eyes and grunt, ' + this.pronoun3 + ' cocks twitching, bouncing, and leaking pre-cum.\n\n', false );
					} else {
						MainView.outputText( this.getCapitalA() + this.short + ' closes ' + this.pronoun2 + ' eyes and grunts, ' + this.pronoun3 + ' cock twitching, bouncing, and leaking pre-cum.\n\n', false );
					}
					break;
				default:
					if( this.plural ) {
						MainView.outputText( 'Drops of pre-cum roll steadily out of their dicks.  It\'s a marvel ' + this.pronoun1 + ' haven\'t given in to ' + this.pronoun3 + ' lusts yet.\n\n', false );
					} else {
						MainView.outputText( 'Drops of pre-cum roll steadily out of ' + this.a + this.short + '\'s dick.  It\'s a marvel ' + this.pronoun1 + ' hasn\'t given in to ' + this.pronoun3 + ' lust yet.\n\n', false );
					}
			}
			this.addStatusValue( StatusAffects.LustStick, 1, 1 );
			//Damage = 5 + bonus score minus
			//Reduced by lust vuln of course
			this.lust += Math.round( this.lustVuln * (5 + this.statusAffectv2( StatusAffects.LustStick )) );
		}
		if( this.findStatusAffect( StatusAffects.PCTailTangle ) ) {
			//when Entwined
			MainView.outputText( 'You are bound tightly in the kitsune\'s tails.  <b>The only thing you can do is try to struggle free!</b>\n\n' );
			MainView.outputText( 'Stimulated by the coils of fur, you find yourself growing more and more aroused...\n\n' );
			EngineCore.dynStats( 'lus', 5 + CoC.player.sens / 10 );
		}
		if( this.findStatusAffect( StatusAffects.QueenBind ) ) {
			MainView.outputText( 'You\'re utterly restrained by the Harpy Queen\'s magical ropes!\n\n' );
			if( CoC.flags[ kFLAGS.PC_FETISH ] >= 2 ) {
				EngineCore.dynStats( 'lus', 3 );
			}
		}
		if( this.constructor.name === 'SecretarialSuccubus' || this.constructor.name === 'MilkySuccubus' ) {
			if( CoC.player.lust < 45 ) {
				MainView.outputText( 'There is something in the air around your opponent that makes you feel warm.\n\n', false );
			}
			if( CoC.player.lust >= 45 && CoC.player.lust < 70 ) {
				MainView.outputText( 'You aren\'t sure why but you have difficulty keeping your eyes off your opponent\'s lewd form.\n\n', false );
			}
			if( CoC.player.lust >= 70 && CoC.player.lust < 90 ) {
				MainView.outputText( 'You blush when you catch yourself staring at your foe\'s rack, watching it wobble with every step she takes.\n\n', false );
			}
			if( CoC.player.lust >= 90 ) {
				MainView.outputText( 'You have trouble keeping your greedy hands away from your groin.  It would be so easy to just lay down and masturbate to the sight of your curvy enemy.  The succubus looks at you with a sexy, knowing expression.\n\n', false );
			}
			EngineCore.dynStats( 'lus', 1 + Utils.rand( 8 ) );
		}
		//[LUST GAINED PER ROUND] - Omnibus
		if( this.findStatusAffect( StatusAffects.LustAura ) ) {
			if( CoC.player.lust < 33 ) {
				MainView.outputText( 'Your groin tingles warmly.  The demon\'s aura is starting to get to you.\n\n', false );
			}
			if( CoC.player.lust >= 33 && CoC.player.lust < 66 ) {
				MainView.outputText( 'You blush as the demon\'s aura seeps into you, arousing you more and more.\n\n', false );
			}
			if( CoC.player.lust >= 66 ) {
				MainView.outputText( 'You flush bright red with desire as the lust in the air worms its way inside you.  ', false );
				MainView.outputText( Utils.randomChoice( 'You have a hard time not dropping to your knees to service her right now.\n\n', 'The urge to bury your face in her breasts and suckle her pink nipples nearly overwhelms you.\n\n', 'You swoon and lick your lips, tasting the scent of the demon\'s pussy in the air.\n\n', 'She winks at you and licks her lips, and you can\'t help but imagine her tongue sliding all over your body.  You regain composure moments before throwing yourself at her.  That was close.\n\n'), false );
			}
			EngineCore.dynStats( 'lus', (3 + Math.ceil( CoC.player.lib / 20 + CoC.player.cor / 30 )) );
		}
	};
	Monster.prototype.handleAwardItemText = function( itype ) { //New Function, override this function in child classes if you want a monster to output special item drop text
		if( itype !== null ) {
			MainView.outputText( '\nThere is ' + itype.longName + ' on your defeated opponent.  ' );
		}
	};
	Monster.prototype.handleAwardText = function() { //New Function, override this function in child classes if you want a monster to output special gem and XP text
		//This function doesn’t add the gems or XP to the player, it just provides the output text
		if( this.gems === 1 ) {
			MainView.outputText( '\n\nYou snag a single gem and ' + this.XP + ' XP as you walk away from your victory.' );
		} else if( this.gems > 1 ) {
			MainView.outputText( '\n\nYou grab ' + this.gems + ' gems and ' + this.XP + ' XP from your victory.' );
		} else if( this.gems === 0 ) {
			MainView.outputText( '\n\nYou gain ' + this.XP + ' XP from the battle.' );
		}
	};
	Monster.prototype.handleCombatLossText = function( inDungeon, gemsLost ) { //New Function, override this function in child classes if you want a monster to output special text after the player loses in combat
		//This function doesn’t take the gems away from the player, it just provides the output text
		if( !inDungeon ) {
			MainView.outputText( '\n\nYou\'ll probably come to your senses in eight hours or so' );
			if( CoC.player.gems > 1 ) {
				MainView.outputText( ', missing ' + gemsLost + ' gems.' );
			} else if( CoC.player.gems === 1 ) {
				MainView.outputText( ', missing your only gem.' );
			} else {
				MainView.outputText( '.' );
			}
		} else {
			MainView.outputText( '\n\nSomehow you came out of that alive' );
			if( CoC.player.gems > 1 ) {
				MainView.outputText( ', but after checking your gem pouch, you realize you\'re missing ' + gemsLost + ' gems.' );
			} else if( CoC.player.gems === 1 ) {
				MainView.outputText( ', but after checking your gem pouch, you realize you\'re missing your only gem.' );
			} else {
				MainView.outputText( '.' );
			}
		}
		return 8; //This allows different monsters to delay the player by different amounts of time after a combat loss. Normal loss causes an eight hour blackout
	};
	return Monster;
} );