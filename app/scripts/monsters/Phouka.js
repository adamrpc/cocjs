'use strict';

angular.module( 'cocjs' ).factory( 'Phouka', function( SceneLib, MainView, CoC, Monster, Utils, StatusAffects, EngineCore, AppearanceDefs, Combat, CockTypesEnum, WeightedDrop, ConsumableLib ) {
	function Phouka() {
		this.init(this, arguments);
	}
	angular.extend(Phouka.prototype, Monster.prototype);
	Phouka.prototype.phoukaFightAttack = function() {
		var damage;
		//Only the bunny, goat and horse forms make physical attacks
		if( this.findStatusAffect( StatusAffects.Blind ) >= 0 && Utils.rand( 3 ) < 1 ) {
			MainView.outputText( this.getCapitalA() + this.short + ' completely misses you due to his blindness!\n', false );
		} else if( SceneLib.phoukaScene.phoukaForm === SceneLib.phoukaScene.PHOUKA_FORM_BUNNY ) {
			damage = Math.round( (60 + 30 + 10) - Utils.rand( CoC.player.tou ) - CoC.player.armorDef ); //60 === Bunny Strength, 30 === Bunny Weapon Attack
			MainView.outputText( 'The bunny morph hops towards you.  At the last second he changes direction and throws a kick toward you with his powerful hind legs.' );
			if( Combat.combatMiss() || Combat.combatEvade() || Combat.combatFlexibility() || Combat.combatMisdirect() ) {
				MainView.outputText( '\nThrowing yourself out of the way, you manage to avoid the kick.  The ' + this.short + ' hops out of reach and prepares for another attack.' );
			} else if( damage <= 0 ) {
				MainView.outputText( '\nYou block his attack by moving your shoulder in close, absorbing the energy of the kick harmlessly.' );
			} else {
				CoC.player.takeDamage( damage );
				MainView.outputText( '\nThe kick connects and leaves you reeling.' );
			}
		} else if( SceneLib.phoukaScene.phoukaForm === SceneLib.phoukaScene.PHOUKA_FORM_GOAT ) {
			damage = Math.round( (80 + 40 + 10) - Utils.rand( CoC.player.tou ) - CoC.player.armorDef ); //80 === Goat Strength, 40 === Goat Weapon Attack
			MainView.outputText( 'The goat morph races toward you, head down.' );
			if( Combat.combatMiss() || Combat.combatEvade() || Combat.combatFlexibility() || Combat.combatMisdirect() ) {
				MainView.outputText( '\nThrowing yourself out of the way, you manage to keep from getting skewered.' );
			} else if( damage <= 0 ) {
				MainView.outputText( '\nYou manage to smack the goat morph in the side of the head.  The horns pass you by harmlessly.' );
			} else {
				CoC.player.takeDamage( damage );
				MainView.outputText( '\nIts head and horns crash into you, leaving you winded and bruised.' );
			}
		} else { //HORSE
			damage = Math.round( (95 + 55 + 10) - Utils.rand( CoC.player.tou ) - CoC.player.armorDef ); //95 === Horse Strength, 55 === Horse Weapon Attack
			MainView.outputText( 'The stallion charges you, clearly intending to trample you under its hooves.' );
			if( Combat.combatMiss() || Combat.combatEvade() || Combat.combatFlexibility() || Combat.combatMisdirect() || (damage <= 0) ) {
				MainView.outputText( '\nAs the stallion passes you twist in place and manage to stay clear of its legs.' );
			} else {
				CoC.player.takeDamage( damage );
				MainView.outputText( '\nYou get clipped by the stallion\'s legs and hooves as he charges. As he comes around for another pass you check over your body, amazed none of your bones are broken after that.' );
			}
		}
		Combat.combatRoundOver();
	};
	Phouka.prototype.phoukaFightLustAttack = function() { //Only the faerie, bunny and horse forms make lust attacks
		if( SceneLib.phoukaScene.phoukaForm === SceneLib.phoukaScene.PHOUKA_FORM_FAERIE ) {
			MainView.outputText( 'The ' + this.short + ' uses his wings to climb high up in the air above you.  Then he starts jerking his cock at you with one hand while fondling his balls with the other.  ' );
		} else if( SceneLib.phoukaScene.phoukaForm === SceneLib.phoukaScene.PHOUKA_FORM_BUNNY ) {
			MainView.outputText( 'The bunny morph leaps forward, trying to catch you off guard and grapple you.  ' );
		} else {
			MainView.outputText( 'The stallion rears up on his hind legs, waving his massive cock at you.  ' );
		}
		if( Combat.combatMiss() || Combat.combatEvade() || Combat.combatFlexibility() || Combat.combatMisdirect() ) {
			if( SceneLib.phoukaScene.phoukaForm === SceneLib.phoukaScene.PHOUKA_FORM_BUNNY ) {
				MainView.outputText( 'You throw yourself out of the way at the last moment and succeed in throwing the ' + this.short + ' off balance. He staggers away, his attempted attack ruined.\n' );
			} else {
				MainView.outputText( 'You manage to look away in time and the ' + this.short + '\'s lewd display has no real effect on you.\n' );
			}
		} else {
			if( SceneLib.phoukaScene.phoukaForm === SceneLib.phoukaScene.PHOUKA_FORM_FAERIE ) {
				MainView.outputText( 'A drizzle of precum rains down around you.  The sight of the ' + this.short + ' pumping his shaft along with the smell of the salty yet sweet fluids makes you wish you could stop fighting and concentrate on pleasuring yourself.' );
			} else if( SceneLib.phoukaScene.phoukaForm === SceneLib.phoukaScene.PHOUKA_FORM_BUNNY ) {
				MainView.outputText( 'He grabs you and rubs up against your body.  For a moment you are lost in the feeling of his soft black fur.  Then you feel his cock pressing against your ribs and shove him away.' );
			} else {
				MainView.outputText( 'You are hypnotized by the equine cock jabbing at the air.  Then the ' + this.short + ' charges past you and you can taste the musk in the air.' );
			}
			EngineCore.dynStats( 'lus', 15 + CoC.player.lib / 10 + CoC.player.cor / 5 + Utils.rand( 10 ) );
		}
		Combat.combatRoundOver();
	};
	Phouka.prototype.phoukaFightSilence = function() { //Reuses the statusAffect Web-Silence from the spiders
		MainView.outputText( this.getCapitalA() + this.short + ' scoops up some muck from the ground and rams it down over his cock.  After a few strokes he forms the lump of mud and precum into a ball and whips it at your face.  ' );
		if( this.findStatusAffect( StatusAffects.Blind ) >= 0 && Utils.rand( 3 ) < 2 ) {
			MainView.outputText( 'Since he\'s blind the shot goes horribly wide, missing you entirely.' );
		} else if( Combat.combatMiss() ) {
			MainView.outputText( 'You lean back and let the muck ball whip pass to one side, avoiding the attack.' );
		} else if( Combat.combatEvade() ) {
			MainView.outputText( 'You pull back and to the side, blocking the shot with your arm. The muck splatters against it uselessly.' );
		} else if( Combat.combatMisdirect() ) {
			MainView.outputText( this.getCapitalA() + this.short + ' was watching you carefully before his throw.  That proves to be his undoing as your misleading movements cause him to lob the muck at the wrong time' );
		} else if( Combat.combatFlexibility() ) {
			MainView.outputText( 'As the ball leaves his fingers you throw yourself back, your spine bending in an inhuman way.  You feel the ball sail past, inches above your chest.' );
		} else {
			MainView.outputText( 'The ball smacks into your face like a wet snowball.  It covers most of your nose and mouth with a layer of sticky, salty mud which makes it hard to breathe.  You\'ll be unable to use your magic while you\'re struggling for breath!\n' );
			CoC.player.createStatusAffect( StatusAffects.WebSilence, 0, 0, 0, 0 ); //Probably safe to reuse the same status affect as for the spider morphs
		}
		Combat.combatRoundOver();
	};
	Phouka.prototype.performCombatAction = function() {
		var blinded = this.findStatusAffect( StatusAffects.Blind ) >= 0;
		if( (!blinded) && CoC.player.findStatusAffect( StatusAffects.WebSilence ) < 0 && Utils.rand( 4 ) === 0 ) {
			this.phoukaTransformToPhouka(); //Change to faerie form so that it can lob the ball of muck at you
			this.phoukaFightSilence();
		} else {
			var transformChance = Utils.rand( 9 ); //2 in 3 chance of staying in current form
			if( SceneLib.phoukaScene.phoukaForm === SceneLib.phoukaScene.PHOUKA_FORM_FAERIE ) {
				if( blinded ) {
					transformChance = Utils.rand( 3 );
				}//100% chance of change from blind phouka if not doing silence attack
				else {
					transformChance = Utils.rand( 4 );
				} //75% chance of change from phouka if not doing silence attack
			}
			switch( transformChance ) {
				case 0:
					this.phoukaTransformToBunny();
					break;
				case 1:
					this.phoukaTransformToGoat();
					break;
				case 2:
					this.phoukaTransformToHorse();
			}
			if( SceneLib.phoukaScene.phoukaForm === SceneLib.phoukaScene.PHOUKA_FORM_FAERIE ) {
				this.phoukaFightLustAttack();
			}//Can only get here if the phouka isn’t blind
			else if( (SceneLib.phoukaScene.phoukaForm === SceneLib.phoukaScene.PHOUKA_FORM_BUNNY) && (Utils.rand( 4 ) !== 0) && (!blinded) ) {
				this.phoukaFightLustAttack();
			}//Bunny has a 75% chance of teasing attack, no teasing while blind
			else if( (SceneLib.phoukaScene.phoukaForm === SceneLib.phoukaScene.PHOUKA_FORM_HORSE) && (Utils.rand( 4 ) === 0) && (!blinded) ) {
				this.phoukaFightLustAttack();
			}//Horse has a 25% chance of teasing attack, no teasing while blind
			else {
				this.phoukaFightAttack();
			}
		}
	};
	Phouka.prototype.teased = function( lustDelta ) {
		if( lustDelta >= 10 ) {
			MainView.outputText( '\n\nThe ' + this.short + ' breaks off its attack in the face of your teasing.  Its drooling member leaves a trail of precum along the ground and you get the feeling it needs to end this fight quickly.' );
		} else if( lustDelta >= 5 ) {
			MainView.outputText( '\n\nThe ' + this.short + ' stops its assault for a moment.  A glob of precum oozes from its cock before it shakes its head and gets ready to attack again.' );
		} else if( lustDelta > 0 ) {
			MainView.outputText( '\n\nThe ' + this.short + ' hesitates and slows down.  You see its cock twitch and then it readies for the next attack.', false );
		}
		this.applyTease( lustDelta );
	};
	Phouka.prototype.defeated = function( hpVictory ) {
		SceneLib.phoukaScene.phoukaPlayerWins( hpVictory );
	};
	Phouka.prototype.won = function( hpVictory, pcCameWorms ) {
		if( pcCameWorms ) {
			MainView.outputText( '\n\nThe ' + this.short + ' looks on, amused. <i>“Kinky! But those wee things can\'t handle whiskey, so I’m safe from ‘em. Now be a good ' );
			if( CoC.player.hasVagina() ) {
				MainView.outputText( 'lass and spread yer legs for me.”</i>\n\n' );
			} else {
				MainView.outputText( 'lad and spread yer asscheeks for me.”</i>\n\n' );
			}
			EngineCore.doNext( Combat, Combat.endLustLoss );
		} else {
			if( CoC.player.hasVagina() ) { //Phouka prefer vaginal if they can get it
				if( CoC.player.isTaur() || Utils.rand( 2 ) === 0 ) {
					SceneLib.phoukaScene.phoukaSexHorse( true, !hpVictory );
				}//And they love mating with female or herm centaurs in their horse form
				else {
					SceneLib.phoukaScene.phoukaSexBunny( true, !hpVictory );
				}
			} else {
				SceneLib.phoukaScene.phoukaSexGoat( true, !hpVictory );
			}
		}
	};
	Phouka.prototype.phoukaTransformToBunny = function() {
		if( SceneLib.phoukaScene.phoukaForm === SceneLib.phoukaScene.PHOUKA_FORM_BUNNY ) {
			return;
		} //Already a bunny, so no change
		if( SceneLib.phoukaScene.phoukaForm === SceneLib.phoukaScene.PHOUKA_FORM_FAERIE ) {
			MainView.outputText( 'The faerie suddenly drops out of the air.  A look of concentration sets in on its face and it begins to expand and warp.  You blink and see that in front of you there is now a 5 foot tall bunny morph.\n\n' );
		} else if( SceneLib.phoukaScene.phoukaForm === SceneLib.phoukaScene.PHOUKA_FORM_GOAT ) {
			MainView.outputText( 'As the goat morph charges towards you it starts to grow.  By the time it gets close it has changed completely and you now face a 5 foot tall bunny morph.\n\n' );
		} else { //Was a horse
			MainView.outputText( 'As the horse morph charges towards you it quite suddenly shrinks.  You have to adjust your defence as a 5 foot tall bunny morph is now hopping your way.\n\n' );
		}
		this.long = 'The ' + this.short + ' is hopping around near you, waiting for an opening.  He has the general appearance of a bunny with coal black fur.  A large cock stands erect between his legs.  His cat-like green eyes, filled with lust, follow your every motion.';
		this.armorValue = 60;
		this.spe = 90;
		SceneLib.phoukaScene.phoukaForm = SceneLib.phoukaScene.PHOUKA_FORM_BUNNY;
	};
	Phouka.prototype.phoukaTransformToGoat = function() {
		if( SceneLib.phoukaScene.phoukaForm === SceneLib.phoukaScene.PHOUKA_FORM_GOAT ) {
			return;
		} //Already a goat, so no change
		if( SceneLib.phoukaScene.phoukaForm === SceneLib.phoukaScene.PHOUKA_FORM_FAERIE ) {
			MainView.outputText( 'The faerie suddenly drops out of the air.  A look of concentration sets in on its face and it begins to expand and warp.  You blink and see that in front of you there is now a 4 foot tall goat morph.\n\n' );
		} else if( SceneLib.phoukaScene.phoukaForm === SceneLib.phoukaScene.PHOUKA_FORM_BUNNY ) {
			MainView.outputText( 'The bunny morph hops back from you and starts to melt and change.  You blink and see that in front of you there is now a 4 foot tall goat morph.\n\n' );
		} else { //Was a horse
			MainView.outputText( 'As the horse morph charges towards you it quite suddenly shrinks.  You have to adjust your defence as it is now a 4 foot tall goat morph.\n\n' );
		}
		this.long = 'The ' + this.short + ' is charging back and forth just out of reach, waiting for an opening.  He has the general appearance of a goat with coal black fur.  He has large glossy black horns and a large cock between his legs.  His cat-like green eyes, filled with lust, follow your every motion.';
		this.armorValue = 60;
		this.spe = 70;
		SceneLib.phoukaScene.phoukaForm = SceneLib.phoukaScene.PHOUKA_FORM_GOAT;
	};
	Phouka.prototype.phoukaTransformToHorse = function() {
		if( SceneLib.phoukaScene.phoukaForm === SceneLib.phoukaScene.PHOUKA_FORM_HORSE ) {
			return;
		} //Already a horse, so no change
		if( SceneLib.phoukaScene.phoukaForm === SceneLib.phoukaScene.PHOUKA_FORM_FAERIE ) {
			MainView.outputText( 'The faerie suddenly drops out of the air.  A look of concentration sets in on its face and it begins to grow larger and larger.  You watch amazed as the creature\'s form stretches.  Finally it seems unable to grow further and settles into the form of a massive stallion.\n\n' );
		} else if( SceneLib.phoukaScene.phoukaForm === SceneLib.phoukaScene.PHOUKA_FORM_BUNNY ) {
			MainView.outputText( 'The bunny morph hops back from you and starts to grow and melt.  You watch amazed as the creature\'s form stretches.  Finally it seems unable to grow further and settles into the form of a massive stallion.\n\n' );
		} else { //Was a goat
			MainView.outputText( 'The goat morph eyes you then seems to think better of charging again.  It backs away and starts to grow larger and larger, its features and body shape twisting and reforming.  Finally it seems unable to grow further and settles into the form of a massive stallion.\n\n' );
		}
		this.long = 'The ' + this.short + ' is running in a wide circle around you, waiting for an opening.  He has the general appearance of a stallion with coal black fur.  A massive cock stands erect between his legs.  His cat-like green eyes, filled with lust, follow your every motion.';
		this.armorValue = 75;
		this.spe = 55;
		SceneLib.phoukaScene.phoukaForm = SceneLib.phoukaScene.PHOUKA_FORM_HORSE;
	};
	Phouka.prototype.phoukaTransformToPhouka = function() {
		if( SceneLib.phoukaScene.phoukaForm === SceneLib.phoukaScene.PHOUKA_FORM_FAERIE ) {
			return;
		} //Already a faerie, so no change
		if( SceneLib.phoukaScene.phoukaForm === SceneLib.phoukaScene.PHOUKA_FORM_BUNNY ) {
			MainView.outputText( 'The bunny morph hops back from you and starts to melt and shrink.  In seconds only a tiny faerie is left floating in the air where the bunny once was.\n\n' );
		} else if( SceneLib.phoukaScene.phoukaForm === SceneLib.phoukaScene.PHOUKA_FORM_GOAT ) {
			MainView.outputText( 'The goat morph bounds away from you and starts to melt and deform.  In seconds only a tiny faerie is left floating in the air where the goat once was.\n\n' );
		} else { //Was a horse
			MainView.outputText( 'The horse morph charges past you.  You look over your shoulder and wonder where the stallion could have gone.  Then you see the tiny faerie zipping back for another attack.\n\n' );
		}
		this.long = 'The ' + this.short + ' is flying around near you, waiting for an opening.  He has the general appearance of a faerie, though he is slightly larger and his skin and wings are coal black.  A large cock stands erect between his legs.  His cat-like green eyes, filled with lust, follow your every motion.';
		this.armorValue = 80;
		this.spe = 80;
		SceneLib.phoukaScene.phoukaForm = SceneLib.phoukaScene.PHOUKA_FORM_FAERIE;
	};
	Phouka.prototype.handleAwardItemText = function( itype ) {
		MainView.outputText( '  You are just about to leave when you remember that glint from the hollow of that nearby tree.' );
		if( itype === null ) {
			MainView.outputText( '\n\nYou take a look and curse the ' + this.short + '.  Looks like it used a piece of a broken bottle to lure you in.  At least you learned more about fighting the little pests.  You gain ' + this.XP + ' XP from your victory.' );
		} else {
			MainView.outputText( '\n\nYou look inside the hollow and are pleased to find ' + itype.longName + '.  You also gain ' + this.XP + ' XP from your victory, since you learned a bit more about fighting these little pests.\n\n' );
		}
	};
	Phouka.prototype.handleAwardText = function() {
		//Talk about gems and XP when the player looks in the hollow of the tree instead of here
	};
	/* jshint unused:true */
	Phouka.prototype.handleCombatLossText = function( inDungeon, gemsLost ) {
		if( CoC.player.gems > 1 ) {
			MainView.outputText( '  Once free you check your gem pouch and realize the ' + this.short + ' took ' + gemsLost + ' of your gems.' );
		} else if( CoC.player.gems === 1 ) {
			MainView.outputText( '  Once free you check your gem pouch and realize the ' + this.short + ' took your only gem.' );
		}
		return 1; //Only use up one hour after combat loss
	};
	Phouka.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		that.classNames.push('Phouka');
		that.a = 'the ';
		that.short = args[0];
		that.long = 'The ' + that.short + ' is flying around near you, waiting for an opening.  He has the general appearance of a faerie, though he is slightly larger and his skin and wings are coal black.  A large cock stands erect between his legs.  His cat-like green eyes, filled with lust, follow your every motion.';
		that.createCock( 1, 0.5, CockTypesEnum.HUMAN );
		that.balls = 2;
		that.ballSize = 1;
		that.cumMultiplier = 5;
		that.hoursSinceCum = 20;
		that.createBreastRow( 0 );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_TIGHT;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_NORMAL;
		that.tallness = 5;
		that.hipRating = AppearanceDefs.HIP_RATING_SLENDER;
		that.buttRating = AppearanceDefs.BUTT_RATING_TIGHT;
		that.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_HUMAN;
		that.armType = AppearanceDefs.ARM_TYPE_HUMAN;
		that.skinTone = 'black';
		that.hairColor = 'black';
		that.hairLength = 1;
		that.earType = AppearanceDefs.EARS_ELFIN;
		that.initStrTouSpeInte( 55, 25, 80, 40 );
		that.initLibSensCor( 75, 35, 100 );
		that.weaponName = 'claws';
		that.weaponVerb = 'claw';
		that.weaponAttack = 15;
		that.armorName = 'skin';
		that.armorDef = 80;
		that.bonusHP = 300;
		that.lust = 30;
		that.lustVuln = 0.5;
		that.level = 14;
		that.gems = 0;
		that.drop = new WeightedDrop().add( ConsumableLib.BLACK_D, 20 )
			.add( ConsumableLib.RIZZART, 10 )
			.add( ConsumableLib.GROPLUS, 2 )
			.add( ConsumableLib.SDELITE, 13 )
			.add( ConsumableLib.P_WHSKY, 35 )
			.add( null, 20 );
		that.wingType = AppearanceDefs.WING_TYPE_GIANT_DRAGONFLY; //Maybe later, if the PC can get them, make a Faerie wing type.
		that.wingDesc = 'small black faerie wings';
		that.checkMonster();
	};
	return Phouka;
} );