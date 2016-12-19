'use strict';

angular.module( 'cocjs' ).factory( 'CorruptedDrider', function( SceneLib, MainView, AbstractSpiderMorph, AppearanceDefs, Descriptors, WeightedDrop, ConsumableLib, UseableLib, Appearance, CockTypesEnum, CoC, EngineCore, Monster, Utils, StatusAffects, Combat, PerkLib ) {
	function CorruptedDrider() {
		this.init(this, arguments);
	}
	angular.extend(CorruptedDrider.prototype, AbstractSpiderMorph.prototype);
	CorruptedDrider.prototype.driderKiss = function() {
		var temp;
		MainView.outputText( 'The corrupted drider closes in on your web-bound form, cooing happily at you while you struggle with the sticky fibers.\n\n', false );
		//Blind dodge change;
		if( this.findStatusAffect( StatusAffects.Blind ) >= 0 && Utils.rand( 3 ) < 2 ) {
			MainView.outputText( 'She\'s too blind to get anywhere near you.\n', false );
		}
		//Dodge;
		else if( CoC.player.spe - this.spe > 0 && Math.ceil( Math.random() * (((CoC.player.spe - this.spe) / 4) + 80) ) > 80 ) {
			MainView.outputText( 'Somehow, you manage to drag yourself out of the way.  She sighs and licks her lips.  "<i>', false );
			temp = Utils.rand( 4 );
			if( temp === 0 ) {
				MainView.outputText( 'I just wanted to give my delicious morsel a kiss...</i>"\n', false );
			} else if( temp === 1 ) {
				MainView.outputText( 'Why won\'t you let me kiss you?</i>"\n', false );
			} else if( temp === 2 ) {
				MainView.outputText( 'Mmm, do you have to squirm so much, prey?</i>"\n', false );
			} else {
				MainView.outputText( 'Just look at my glossy, dripping lips.  Imagine how great it would feel to have them locked against you.  Why resist?</i>"\n', false );
			}
		}
		//Determine if evaded;
		else if( CoC.player.findPerk( PerkLib.Evade ) >= 0 && Utils.rand( 100 ) < 10 ) {
			MainView.outputText( 'Somehow, you manage to evade her lusty attack.  She sighs and licks her lips.  "<i>', false );
			temp = Utils.rand( 4 );
			if( temp === 0 ) {
				MainView.outputText( 'I just wanted to give my delicious morsel a kiss...</i>"\n', false );
			} else if( temp === 1 ) {
				MainView.outputText( 'Why won\'t you let me kiss you?</i>"\n', false );
			} else if( temp === 2 ) {
				MainView.outputText( 'Mmm, do you have to squirm so much, prey?</i>"\n', false );
			} else {
				MainView.outputText( 'Just look at my glossy, dripping lips.  Imagine how great it would feel to have them locked against you.  Why resist?</i>"\n', false );
			}
		}
		//('Misdirection';
		else if( CoC.player.findPerk( PerkLib.Misdirection ) >= 0 && Utils.rand( 100 ) < 10 && CoC.player.armorName === 'red, high-society bodysuit' ) {
			MainView.outputText( 'You manage to misdirect her lusty attack, avoiding it at the last second.  She sighs and licks her lips.  "<i>', false );
			temp = Utils.rand( 4 );
			if( temp === 0 ) {
				MainView.outputText( 'I just wanted to give my delicious morsel a kiss...</i>"\n', false );
			} else if( temp === 1 ) {
				MainView.outputText( 'Why won\'t you let me kiss you?</i>"\n', false );
			} else if( temp === 2 ) {
				MainView.outputText( 'Mmm, do you have to squirm so much, prey?</i>"\n', false );
			} else {
				MainView.outputText( 'Just look at my glossy, dripping lips.  Imagine how great it would feel to have them locked against you.  Why resist?</i>"\n', false );
			}
		}
		//Determine if cat'ed;
		else if( CoC.player.findPerk( PerkLib.Flexibility ) >= 0 && Utils.rand( 100 ) < 6 ) {
			MainView.outputText( 'You manage to twist your cat-like body out of the way at the last second, avoiding it at the last second.  She sighs and licks her lips.  "<i>', false );
			temp = Utils.rand( 4 );
			if( temp === 0 ) {
				MainView.outputText( 'I just wanted to give my delicious morsel a kiss...</i>"\n', false );
			} else if( temp === 1 ) {
				MainView.outputText( 'Why won\'t you let me kiss you?</i>"\n', false );
			} else if( temp === 2 ) {
				MainView.outputText( 'Mmm, do you have to squirm so much, prey?</i>"\n', false );
			} else {
				MainView.outputText( 'Just look at my glossy, dripping lips.  Imagine how great it would feel to have them locked against you.  Why resist?</i>"\n', false );
			}
		} else if( CoC.player.findStatusAffect( StatusAffects.DriderKiss ) < 0 ) {
			//(HIT? + 10 lust);
			EngineCore.dynStats( 'lus', 10 );
			MainView.outputText( 'Before you can move, she\'s right on top of you, leaning ', false );
			if( CoC.player.tallness < 72 ) {
				MainView.outputText( 'down', false );
			} else {
				MainView.outputText( 'over', false );
			}
			MainView.outputText( ' to plant a sloppy, wet kiss upon your lips.  Her glossy lip-venom oozes everywhere, dribbling down your collective chins and sliding into your mouth.  You shudder, trying to resist, but your tongue betrays you.  It slides between her moist, puffy entrance, lapping at her venom and making love to her tongue.', false );
			if( CoC.player.lust <= 99 ) {
				MainView.outputText( '  Somehow, you work up the willpower to back away, but your body slowly begins to burn hotter and harder, afflicted with a slowly-building lust.', false );
			}
			CoC.player.createStatusAffect( StatusAffects.DriderKiss, 0, 0, 0, 0 );
		}
		//Get hit 2nd time) ;
		else {
			CoC.player.addStatusValue( StatusAffects.DriderKiss, 1, 1 );
			if( CoC.player.statusAffectv1( StatusAffects.DriderKiss ) === 1 ) {
				//(HIT? + 15 lust);
				EngineCore.dynStats( 'lus', 15 );
				MainView.outputText( 'Again, the drider ties your mouth up in her syrupy lip-lock, seeming to bind your mouth as effectively as her webs bind your body.  Her sweet venom bubbles and froths at the corners of the oral embrace, dripping over her many-breasted bosom and your ' + CoC.player.chestDesc() + '.', false );
				if( CoC.player.hasCock() ) {
					MainView.outputText( '  ' + Descriptors.SMultiCockDesc() + ' spews a rope of pre-cum into your ' + CoC.player.armorName + ', desperate to get out and fuck.', false );
				}
				if( CoC.player.hasVagina() ) {
					MainView.outputText( '  Fem-cum dribbles down your ' + CoC.player.legs() + ' while your ' + CoC.player.clitDescript() + ' gets so hard you think it\'ll explode.', false );
				}
				MainView.outputText( '  This time, the drider is the one to break the kiss.  She asks, "<i>Are you ready, my horny little morsel?</i>"\n', false );
				if( CoC.player.lust <= 99 ) {
					MainView.outputText( 'You shake your head \'no\' and stand your ground!\n', false );
				}
			}
			//(Get hit 3rd+ time);
			else {
				MainView.outputText( 'This time you barely move.  Your body is too entranced by the idea of another venom-laced kiss to resist.  Glorious purple goo washes into your mouth as her lips meet yours, sealing tight but letting your tongue enter her mouth to swirl around and feel the venom drip from her fangs.  It\'s heavenly!  Your ' + CoC.player.skin() + ' grows hot and tingly, and you ache to be touched so badly.  Your ' + Descriptors.nippleDescript( 0 ) + 's feel hard enough to cut glass, and a growing part of you admits that you\'d love to feel the drider\'s chitinous fingers pulling on them.', false );
				//(HIT? + 20 lust);
				EngineCore.dynStats( 'lus', 20 );
				if( CoC.player.hasCock() || CoC.player.hasVagina() ) {
					MainView.outputText( '  The moisture in your crotch only gets worse.  At this point, a ', false );
					if( CoC.player.wetness() < 3 && CoC.player.cumQ() < 200 ) {
						MainView.outputText( 'small', false );
					} else if( CoC.player.wetness() < 5 && CoC.player.cumQ() < 500 ) {
						MainView.outputText( 'large', false );
					} else {
						MainView.outputText( 'massive', false );
					}
					MainView.outputText( ' wet stain that reeks of your sheer sexual ache has formed in your ' + CoC.player.armorName + '.', false );
					if( CoC.player.lust <= 99 ) {
						MainView.outputText( '  Amazingly, you resist her and pull back, panting for breath.', false );
					}
				}
			}
		}
		Combat.combatRoundOver();
	};
	CorruptedDrider.prototype.driderMasturbate = function() {
		//-Masturbate - (Lowers lust by 50, raises PC lust);
		this.lust -= 30;
		EngineCore.dynStats( 'lus', (10 + CoC.player.lib / 20) );
		MainView.outputText( 'The spider-woman skitters back and gives you a lusty, hungry expression.  She shudders and moans, "<i>Mmm, just watch what you\'re missing out on...</i>"\n\n', false );
		MainView.outputText( 'As soon as she finishes, her large clit puffs up, balloon-like.  A second later, it slides forward, revealing nine inches of glossy, girl-spunk-soaked shaft.  Nodules ring the corrupted penis\' surface, while the tiny cum-slit perched atop the tip dribbles heavy flows of pre-cum.  She pumps at the fleshy organ while her other hand paws at her jiggling breasts, tugging on the hard ', false );
		if( this.nipplesPierced > 0 ) {
			MainView.outputText( 'pierced ', false );
		}
		MainView.outputText( 'nipple-flesh.  Arching her back in a lurid pose, she cries out in high-pitched bliss, her cock pulsing in her hand and erupting out a stream of seed that lands in front of her.\n\n', false );
		MainView.outputText( 'The display utterly distracts you until it finishes, and as you adopt your combat pose once more, you find your own needs harder to ignore, while hers seem to be sated, for now.\n', false );
		Combat.combatRoundOver();
	};
	CorruptedDrider.prototype.performCombatAction = function() {
		MainView.spriteSelect( 77 );
		if( this.lust > 70 && Utils.rand( 4 ) === 0 ) {
			this.driderMasturbate();
		}//1/4 chance of silence if pc knows spells;
		else if( Combat.hasSpells() && CoC.player.findStatusAffect( StatusAffects.WebSilence ) < 0 && Utils.rand( 4 ) === 0 ) {
			this.spiderSilence();
		}
		//1/4 chance of disarm;
		else if( CoC.player.findStatusAffect( StatusAffects.Disarmed ) < 0 && CoC.player.weaponName !== 'fists' && Utils.rand( 4 ) === 0 ) {
			this.spiderDisarm();
		}
		//Always web unless already webbed;
		else if( CoC.player.spe >= 2 && (CoC.player.findStatusAffect( StatusAffects.Web ) < 0 || Utils.rand( 2 ) === 0) ) {
			this.spiderMorphWebAttack();
		}
		//Kiss!;
		else {
			this.driderKiss();
		}
	};
	CorruptedDrider.prototype.defeated = function() {
		SceneLib.corruptedDriderScene.defeatDriderIntro();
	};
	/* jshint unused:true */
	CorruptedDrider.prototype.won = function( hpVictory, pcCameWorms ) {
		if( pcCameWorms ) {
			MainView.outputText( '\n\nThe drider licks her lips in anticipation...' );
			EngineCore.doNext( Combat, Combat.endLustLoss );
		} else {
			SceneLib.corruptedDriderScene.loseToDrider();
		}
	};
	CorruptedDrider.prototype.init = function(that, args) {
		AbstractSpiderMorph.prototype.init(that, args);
		that.classNames.push('CorruptedDrider');
		var hairColor = Utils.randomChoice( 'red', 'orange', 'green' );
		var skinTone = Utils.randomChoice( 'yellow', 'purple', 'red', 'turquoise' );
		var pierced = Utils.rand( 2 ) === 0;
		that.a = 'the ';
		that.short = 'corrupted drider';
		that.imageName = 'corrupteddrider';
		that.long = 'This particular spider-woman is a drider - a creature with a humanoid top half and the lower body of a giant arachnid.  From a quick glance, you can tell that this one has fallen deeply to corruption.  She is utterly nude, exposing her four well-rounded, D-cup breasts with their shiny black nipples.  ' + (pierced ? 'Gold piercings and chains link the curvy tits together, crossing in front of her four mounds in an \'x\' pattern.  ' : '') + 'On her face and forehead, a quartet of lust-filled, ' + skinTone + ' eyes gaze back at you.  Behind her, the monster-girl\'s ' + hairColor + ' hair drapes down her back like a cloak.  The drider\'s lips seem to shine with a light all their own, and a steady trickle of purple, reflective fluid beads and drips from them.  At her waist, there\'s a juicy looking snatch with a large, highly visible clit.  From time to time it pulsates and grows, turning part-way into a demon-dick.  Her spider-half has eight spindly legs with black and ' + that.hairColor + ' stripes - a menacing display if ever you\'ve seen one.';
		that.createCock( 9, 2, CockTypesEnum.DEMON );
		that.createVagina( false, AppearanceDefs.VAGINA_WETNESS_DROOLING, AppearanceDefs.VAGINA_LOOSENESS_GAPING );
		that.createStatusAffect( StatusAffects.BonusVCapacity, 70, 0, 0, 0 );
		that.createBreastRow( Appearance.breastCupInverse( 'DD' ) );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_TIGHT;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_DRY;
		that.createStatusAffect( StatusAffects.BonusACapacity, 70, 0, 0, 0 );
		that.tallness = 10 * 12;
		that.hipRating = AppearanceDefs.HIP_RATING_CURVY + 2;
		that.buttRating = AppearanceDefs.BUTT_RATING_LARGE + 1;
		that.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_DRIDER_LOWER_BODY;
		that.skinTone = skinTone;
		that.skinType = AppearanceDefs.SKIN_TYPE_PLAIN;
		that.hairColor = hairColor;
		that.hairLength = 24;
		that.initStrTouSpeInte( 100, 50, 70, 100 );
		that.initLibSensCor( 80, 50, 90 );
		that.weaponName = 'claws';
		that.weaponVerb = 'claw';
		that.weaponAttack = 30;
		that.armorName = 'carapace';
		that.armorDef = 55;
		that.armorPerk = '';
		that.armorValue = 70;
		if( pierced ) {
			that.nipplesPierced = 1;
			that.bonusHP = 325;
			that.lust = 35;
			that.lustVuln = 0.25;
			that.temperment = Monster.TEMPERMENT_RANDOM_GRAPPLES;
			that.level = 15;
			that.gems = Utils.rand( 10 ) + 30;
		} else {
			that.bonusHP = 250;
			that.lust = 30;
			that.lustVuln = 0.4;
			that.temperment = Monster.TEMPERMENT_RANDOM_GRAPPLES;
			that.level = 14;
			that.gems = Utils.rand( 10 ) + 20;
		}
		that.drop = new WeightedDrop().add( ConsumableLib.B_GOSSR, 5 )
			.add( UseableLib.T_SSILK, 1 )
			.add( null, 4 );
		that.checkMonster();
	};
	return CorruptedDrider;
} );