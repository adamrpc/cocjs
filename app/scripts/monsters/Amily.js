'use strict';

angular.module( 'cocjs' ).factory( 'Amily', function( EventParser, SceneLib, CoC_Settings, MainView, CoC, Monster, Utils, StatusAffects, Appearance, AppearanceDefs, Combat, EngineCore, PerkLib ) {
	function Amily() {
		this.init(this, arguments);
	}
	angular.extend(Amily.prototype, Monster.prototype);
	Amily.prototype.performCombatAction = function() {
		if( this.findStatusAffect( StatusAffects.Concentration ) < 0 && Utils.rand( 4 ) === 0 ) {
			this.amilyConcentration();
		} else if( Utils.rand( 3 ) === 0 ) {
			this.amilyDartGo();
		} else if( Utils.rand( 2 ) === 0 ) {
			this.amilyDoubleAttack();
		} else {
			this.amilyAttack();
		}
	};
	//COMBAT AMILY STUFF;
	//(Has regular attack);
	Amily.prototype.amilyAttack = function() {
		var dodged = 0;
		var damage;
		//return to combat menu when finished;
		EngineCore.doNext( MainView.playerMenu );
		//Blind dodge change;
		if( this.findStatusAffect( StatusAffects.Blind ) >= 0 && Utils.rand( 3 ) < 2 ) {
			EngineCore.outputText( this.getCapitalA() + this.short + ' completely misses you with a blind attack!\n', false );
			Combat.combatRoundOver();
			return;
		}
		//Determine if dodged!;
		if( CoC.player.spe - this.spe > 0 && Math.ceil( Math.random() * (((CoC.player.spe - this.spe) / 4) + 80) ) > 80 ) {
			dodged = 1;
		}
		//Determine if evaded;
		if( CoC.player.findPerk( PerkLib.Evade ) >= 0 && Utils.rand( 100 ) < 10 ) {
			dodged = 2;
		}
		//('Misdirection';
		if( CoC.player.findPerk( PerkLib.Misdirection ) >= 0 && Utils.rand( 100 ) < 10 && CoC.player.armorName === 'red, high-society bodysuit' ) {
			dodged = 3;
		}
		//Determine if cat'ed;
		if( CoC.player.findPerk( PerkLib.Flexibility ) >= 0 && Utils.rand( 100 ) < 6 ) {
			dodged = 4;
		}
		//Determine damage - str modified by enemy toughness!;
		damage = Math.ceil( (this.str + this.weaponAttack) - Math.random() * (CoC.player.tou + CoC.player.armorDef) );
		//Dodged;
		if( dodged > 0 ) {
			EngineCore.outputText( 'Amily dashes at you and swipes her knife, but you quickly sidestep the blow.', false );
			//Add tags for miss/evade/flexibility/etc.;
			switch( dodged ) {
				case 1:
					EngineCore.outputText( ' [Dodge]', false );
					break;
				case 2:
					EngineCore.outputText( ' [Evade]', false );
					break;
				case 3:
					EngineCore.outputText( ' [Misdirect]', false );
					break;
				case 4:
					EngineCore.outputText( ' [Flexibility]', false );
					break;
				default:
					CoC_Settings.error();
					EngineCore.outputText( ' <b>[ERROR]</b>', false );
					break;
			}
		}
		//Blocked;
		else if( damage <= 0 ) {
			damage = 0;
			//Due to toughness or amor...;
			if( Utils.rand( CoC.player.armorDef + CoC.player.tou ) < CoC.player.armorDef ) {
				EngineCore.outputText( 'Your ' + CoC.player.armorName + ' absorb and deflect every ' + this.weaponVerb + ' from ' + this.a + this.short + '.', false );
			} else {
				EngineCore.outputText( 'You deflect and block every ' + this.weaponVerb + ' ' + this.a + this.short + ' throws at you.', false );
			}
		}
		//Got hit!;
		else {
			damage = CoC.player.takeDamage( damage );
			EngineCore.outputText( 'Amily dashes at you and swipes her knife, cutting you (' + damage + ').', false );
		}
		if( damage > 0 ) {
			if( this.lustVuln > 0 && CoC.player.armorName === 'barely-decent bondage straps' ) {
				if( !this.plural ) {
					EngineCore.outputText( '\n' + this.getCapitalA() + this.short + ' brushes against your exposed skin and jerks back in surprise, coloring slightly from seeing so much of you revealed.', false );
				} else {
					EngineCore.outputText( '\n' + this.getCapitalA() + this.short + ' brush against your exposed skin and jerk back in surprise, coloring slightly from seeing so much of you revealed.', false );
				}
				this.lust += 10 * this.lustVuln;
			}
		}
		EngineCore.statScreenRefresh();
		EngineCore.outputText( '\n', false );
		Combat.combatRoundOver();
	};
	//(Special Attacks);
	//-Double Attack: Same as a normal attack, but hits twice.;
	Amily.prototype.amilyDoubleAttack = function() {
		var dodged = 0;
		var damage = 0;
		//return to combat menu when finished;
		EngineCore.doNext( MainView.playerMenu );
		//Blind dodge change;
		if( this.findStatusAffect( StatusAffects.Blind ) >= 0 && Utils.rand( 3 ) < 2 ) {
			dodged++;
		}
		//Determine if dodged!;
		if( CoC.player.spe - this.spe > 0 && Math.ceil( Math.random() * (((CoC.player.spe - this.spe) / 4) + 80) ) > 80 ) {
			dodged++;
		}
		//Determine if evaded;
		if( CoC.player.findPerk( PerkLib.Evade ) >= 0 && Utils.rand( 100 ) < 10 ) {
			dodged++;
		}
		//('Misdirection';
		if( CoC.player.findPerk( PerkLib.Misdirection ) >= 0 && Utils.rand( 100 ) < 10 && CoC.player.armorName === 'red, high-society bodysuit' ) {
			dodged++;
		}
		//Determine if cat'ed;
		if( CoC.player.findPerk( PerkLib.Flexibility ) >= 0 && Utils.rand( 100 ) < 6 ) {
			dodged++;
		}
		//Get hit!;
		if( dodged < 2 ) {
			//Determine damage - str modified by enemy toughness!;
			damage = Math.ceil( (this.str + this.weaponAttack) - Math.random() * (CoC.player.tou + CoC.player.armorDef) );
			//Double damage if no dodge.;
			if( dodged === 0 ) {
				damage *= 2;
			}
			//Blocked?;
			if( damage === 0 ) {
				EngineCore.outputText( 'Amily dashes at you and slashes at you twice in the time it would take most to throw a single blow, but she can\'t cut deep enough to wound you!', false );
			}
			//NOT BLOCKED!;
			else {
				damage = CoC.player.takeDamage( damage );
				if( dodged > 0 ) {
					EngineCore.outputText( 'Amily dashes at you and quickly slashes you twice; you manage to avoid the first blow, but the second one hits home, cutting you', false );
				} else {
					EngineCore.outputText( 'Amily dashes at you and slashes at you twice in the time it would take most to throw a single blow', false );
				}
				EngineCore.outputText( ' (' + damage + ')!', false );
			}
		}
		//Dodge all!;
		else {
			EngineCore.outputText( 'Amily dashes at you and quickly slashes you twice, but you quickly sidestep her first blow and jump back to avoid any follow-ups.', false );
		}

		Combat.combatRoundOver();
	};
	//-Poison Dart: Deals speed and str damage to the PC. (Not constant);
	Amily.prototype.amilyDartGo = function() {
		var dodged = 0;
		//Blind dodge change;
		if( this.findStatusAffect( StatusAffects.Blind ) >= 0 && Utils.rand( 3 ) < 2 ) {
			EngineCore.outputText( this.getCapitalA() + this.short + ' completely misses you with a blind attack from her dartgun!\n', false );
			Combat.combatRoundOver();
			return;
		}
		//Determine if dodged!;
		if( CoC.player.spe - this.spe > 0 && Math.ceil( Math.random() * (((CoC.player.spe - this.spe) / 4) + 80) ) > 80 ) {
			dodged = 1;
		}
		//Determine if evaded;
		if( CoC.player.findPerk( PerkLib.Evade ) >= 0 && Utils.rand( 100 ) < 10 ) {
			dodged = 2;
		}
		//('Misdirection';
		if( CoC.player.findPerk( PerkLib.Misdirection ) >= 0 && Utils.rand( 100 ) < 15 && CoC.player.armorName === 'red, high-society bodysuit' ) {
			dodged = 3;
		}
		//Determine if cat'ed;
		if( CoC.player.findPerk( PerkLib.Flexibility ) >= 0 && Utils.rand( 100 ) < 15 ) {
			dodged = 4;
		}
		//Dodged;
		if( dodged > 0 ) {
			EngineCore.outputText( 'Amily dashes at you and swipes her knife rather slowly. You easily dodge the attack; but it was all a feint, her other hands tries to strike at you with a poisoned dart. Luckily you manage to avoid it.', false );
			//Add tags for miss/evade/flexibility/etc.;
			switch( dodged ) {
				case 1:
					EngineCore.outputText( ' [Dodge]', false );
					break;
				case 2:
					EngineCore.outputText( ' [Evade]', false );
					break;
				case 3:
					EngineCore.outputText( ' [Misdirect]', false );
					break;
				case 4:
					EngineCore.outputText( ' [Flexibility]', false );
					break;
				default:
					CoC_Settings.error( '' );
					EngineCore.outputText( ' <b>[ERROR]</b>', false );
					break;
			}
		}
		//Else hit!;
		else {
			EngineCore.outputText( 'Amily dashes at you and swipes her knife at you, surprisingly slowly.  You easily dodge the attack; but it was a feint - her other hand tries to strike at you with a poisoned dart. However, she only manages to scratch you, only causing your muscles to grow slightly numb.', false );
			//Set status;
			if( CoC.player.findStatusAffect( StatusAffects.AmilyVenom ) < 0 ) {
				CoC.player.createStatusAffect( StatusAffects.AmilyVenom, 0, 0, 0, 0 );
			}
			var poison = 2 + Utils.rand( 5 );
			while( poison > 0 ) {
				poison--;
				if( CoC.player.str >= 2 ) {
					CoC.player.str--;
					MainView.statsView.showStatDown( 'str' );
					CoC.player.addStatusValue( StatusAffects.AmilyVenom, 1, 1 );
				}
				if( CoC.player.spe >= 2 ) {
					CoC.player.spe--;
					MainView.statsView.showStatDown( 'spe' );
					CoC.player.addStatusValue( StatusAffects.AmilyVenom, 2, 1 );
				}
			}
			//If PC is reduced to 0 Speed and Strength, normal defeat by HP plays.;
			if( CoC.player.spe <= 2 && CoC.player.str <= 2 ) {
				EngineCore.outputText( '  You\'ve become so weakened that you can\'t even make an attempt to defend yourself, and Amily rains blow after blow down upon your helpless form.', false );
				CoC.player.takeDamage( 8999 );
			}
		}
		Combat.combatRoundOver();
	};
	//Concentrate: always avoids the next attack. Can be disrupted by tease/seduce.;
	Amily.prototype.amilyConcentration = function() {
		EngineCore.outputText( 'Amily takes a deep breath and attempts to concentrate on your movements.', false );
		this.createStatusAffect( StatusAffects.Concentration, 0, 0, 0, 0 );
		Combat.combatRoundOver();
	};
	//(if PC uses tease/seduce after this);
	//Deals big lust increase, despite her resistance.;
	Amily.prototype._superTeased = Amily.prototype.teased;
	Amily.prototype.teased = function( lustDelta ) {
		if( this.findStatusAffect( StatusAffects.Concentration ) >= 0 ) {
			EngineCore.outputText( 'Amily flushes hotly; her concentration only makes her pay more attention to your parts!', false );
			lustDelta += 25 + lustDelta;
			this.removeStatusAffect( StatusAffects.Concentration );
			this.applyTease( lustDelta );
		} else {
			this._superTeased( lustDelta );
		}
	};
	Amily.prototype.defeated = function() {
		SceneLib.amilyScene.conquerThatMouseBitch();
	};
	Amily.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		that.classNames.push('Amily');
		that.a = '';
		that.short = 'Amily';
		that.imageName = 'amily';
		that.long = 'You are currently fighting Amily. The mouse-morph is dressed in rags and glares at you in rage, knife in hand. She keeps herself close to the ground, ensuring she can quickly close the distance between you two or run away.';
		that.createVagina( false, AppearanceDefs.VAGINA_WETNESS_NORMAL, AppearanceDefs.VAGINA_LOOSENESS_NORMAL );
		that.createStatusAffect( StatusAffects.BonusVCapacity, 48, 0, 0, 0 );
		that.createBreastRow( Appearance.breastCupInverse( 'C' ) );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_VIRGIN;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_DRY;
		that.tallness = 4 * 12;
		that.hipRating = AppearanceDefs.HIP_RATING_AMPLE;
		that.buttRating = AppearanceDefs.BUTT_RATING_TIGHT;
		that.skinTone = 'tawny';
		that.skinType = AppearanceDefs.SKIN_TYPE_FUR;
		that.hairColor = 'brown';
		that.hairLength = 5;
		that.initStrTouSpeInte( 30, 30, 85, 60 );
		that.initLibSensCor( 45, 45, 10 );
		that.weaponName = 'knife';
		that.weaponVerb = 'slash';
		that.weaponAttack = 6;
		that.armorName = 'rags';
		that.armorDef = 1;
		that.bonusHP = 20;
		that.lust = 20;
		that.lustVuln = 0.85;
		that.level = 4;
		that.gems = 2 + Utils.rand( 5 );
		that.drop = Monster.NO_DROP;
		that.checkMonster();
	};
	return Amily;
} );