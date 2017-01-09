'use strict';

angular.module( 'cocjs' ).factory( 'MinotaurMob', function( SceneLib, MainView, CoC, kFLAGS, EngineCore, Monster, Utils, AppearanceDefs, StatusAffects, Combat, CockTypesEnum, Descriptors ) {
	function MinotaurMob() {
		this.init(this, arguments);
	}
	angular.extend(MinotaurMob.prototype, Monster.prototype);
	MinotaurMob.prototype.precumTease = function() {
		var teased = false;
		var damage = 0;
		var oldLust = CoC.player.lust;
		MainView.spriteSelect( 94 );
		//(Big taur pre-cum tease)
		if( Utils.rand( 2 ) === 0 ) {
			teased = true;
			if( Utils.rand( 5 ) > 0 ) {
				MainView.outputText( 'The biggest lifts his loincloth, giving you a perfect view of his veiny hardness.  Pre-cum visibly bubbles from his flared tip, splattering wetly on the rocks and filling the air with his bestial musk.  He says, "<i>See how much I need you?</i>"\n', false );
				damage = 7 + CoC.player.lib / 20;
			}
			//crit)
			else {
				MainView.outputText( 'The largest bull in the crowd flaps his cum-soaked loincloth up and wraps a massive, muscled hand around his incredible erection.  Shaking it back and forth, he flicks his bubbling pre-cum in your direction, letting it spatter noisily against the rocks around you.  A few droplets even land on your skin, fogging the air with minotaur pheromones.\n', false );
				damage = 13 + CoC.player.lib / 20;
			}
		}
		//(Middle Taur pre-cum tease)
		if( Utils.rand( 2 ) === 0 ) {
			teased = true;
			if( Utils.rand( 5 ) > 0 ) {
				MainView.outputText( '"<i>Hey, slut, look at this!</i>" taunts one of the beast-men.  He shakes his hips lewdly, spinning his thick horse-cock in wide circles and sending his potent pre flying through the air.  Droplets rain down around you, filling the air with even more of that delicious smell.\n', false );
				damage = 3 + CoC.player.lib / 30;
			} else {
				MainView.outputText( '"<i>Mom, you may as well spread your thighs now, I got a treat for ya!</i>" announces a well-built minotaur.  He shifts his coverings and pumps on his swollen shaft, tugging hard enough over the iron-hard erection to blast out huge blobs of pre-seed in your direction.  ', false );
				if( CoC.player.spe / 5 + Utils.rand( 20 ) > 20 ) {
					MainView.outputText( 'You avoid most of them, the blobs splattering against the mountain and still getting a little on you.  Regardless, the air stinks of their heavy spunk.', false );
					damage = 6 + CoC.player.lib / 20;
				} else {
					MainView.outputText( 'You try to avoid them, but one catches you in the face, a little getting into your mouth.  You swallow it reflexively and salivate some more, your eyes darting to look at the stained rocks around you.  Are you really considering licking it up from the ground?', false );
					damage = 15 + CoC.player.lib / 20;
				}
			}
			MainView.outputText( '\n', false );
		}
		//(Minitaur pre-cum tease)
		if( !teased || Utils.rand( 3 ) === 0 ) {
			MainView.outputText( 'The smallest of the beastmen, the minitaur, moans and begs, "<i>Please Mom, can we please fuck you?  I... I need it so bad.</i>"  He raises the edge of his loincloth to show exactly what he\'s talking about.  His member is limp but leaking.  What really catches your eyes sits behind that drizzling shaft - a pair of balls looking swollen and pent up beyond belief.  A sticky web of his leavings hangs between his genitals and his loincloth, showing you just how much he\'s been leaking at the thought of fucking you.  Fanning the sopping garment, he inadvertently blows a wave of his pheromones your way.\n', false );
			damage = 9 + CoC.player.lib / 20;
		}
		EngineCore.dynStats( 'lus', damage );
		damage = CoC.player.lust - oldLust;
		//UNIVERSAL pre-cum RESULT:
		//(Low damage taken)
		if( damage <= 8 ) {
			MainView.outputText( 'Though your body is tingling from the show the horny beasts are giving you, it doesn\'t effect you as much as it could have.', false );
			if( CoC.player.lust > 99 ) {
				MainView.outputText( '  Still, you\'re too horny to fight any longer.', false );
			}
		}
		//(Medium damage taken)
		else if( damage <= 14 ) {
			MainView.outputText( 'The powerful pheromones and scents hanging in the air around you make your body flush hotly.  Your ' + CoC.player.nippleDescript( 0 ) + 's grow harder', false );
			if( CoC.player.lust > 70 ) {
				MainView.outputText( ', though you didn\'t think such a thing was possible', false );
			} else {
				MainView.outputText( ', feeling like two bullets scraping along the inside of your ' + CoC.player.armorName, false );
			}
			MainView.outputText( ', but it... it could have been worse.  You shudder as a little fantasy of letting them dribble it all over your body works through your mind.', false );
			if( CoC.player.lust > 99 ) {
				MainView.outputText( '  Fuck it, they smell so good.  You want, no, NEED more.', false );
			} else {
				MainView.outputText( '  A growing part of you wants to experience that.', false );
			}
		}
		//(high damage taken)
		else {
			MainView.outputText( 'All that potent pre-ejaculate makes your cunny ', false );
			if( CoC.player.wetness() <= 1 ) {
				MainView.outputText( 'moisten', false );
			} else if( CoC.player.wetness() <= 2 ) {
				MainView.outputText( 'drip', false );
			} else if( CoC.player.wetness() <= 3 ) {
				MainView.outputText( 'drool', false );
			} else {
				MainView.outputText( 'juice itself', false );
			}
			MainView.outputText( ' in need.', false );
			if( CoC.player.minotaurNeed() ) {
				MainView.outputText( '  You need a fix so bad!', false );
				EngineCore.dynStats( 'lus', 5 );
			} else {
				MainView.outputText( '  You can understand firsthand just how potent and addictive that fluid is...', false );
			}
			if( CoC.player.hasCock() ) {
				MainView.outputText( '  ' + Descriptors.SMultiCockDesc() + ' twitches and dribbles its own pre-seed, but it doesn\'t smell anywhere near as good!', false );
			}
			MainView.outputText( '  Shuddering and moaning, your body is wracked by ever-increasing arousal.  Fantasies of crawling under the beast-men\'s soaked legs and lapping at their drooling erections inundate your mind, your body shivering and shaking in response.  ', false );
			if( CoC.player.lust <= 99 ) {
				MainView.outputText( 'You pull back from the brink with a start.  It\'ll take more than a little drugged pre-cum to bring you down!', false );
			} else {
				MainView.outputText( 'You sigh and let your tongue loll out.  It wouldn\'t so bad, would it?', false );
			}
		}
		SceneLib.combatScene.combatRoundOver();
	};
	//Grope
	MinotaurMob.prototype.minotaurGangGropeAttack = function() {
		MainView.spriteSelect( 94 );
		MainView.outputText( 'Strong hands come from behind and slide under your equipment to squeeze your ' + Descriptors.chestDesc() + '.  The brutish fingers immediately locate and pinch at your ' + Descriptors.nippleDescript( 0 ) + 's, the sensitive flesh on your chest lighting up with pain and pleasure.  You arch your back in surprise, utterly stunned by the violation of your body.  After a moment you regain your senses and twist away, but the damage is already done.  You\'re breathing a bit quicker now', false );
		if( CoC.player.lust >= 80 ) {
			MainView.outputText( ', and your pussy is absolutely soaking wet', false );
		}
		MainView.outputText( '.', false );
		EngineCore.dynStats( 'lus', (5 + CoC.player.sens / 10) );
		SceneLib.combatScene.combatRoundOver();
	};
	//Gang Grope
	MinotaurMob.prototype.minotaurGangGangGropeAttack = function() {
		MainView.spriteSelect( 94 );
		MainView.outputText( 'Before you can react, hands reach out from multiple angles and latch onto your body.  One pair squeezes at your ' + Descriptors.buttDescript() + ', the strong grip massaging your cheeks with loving touches.  Another set of hands are sliding along your tummy, reaching down for, but not quite touching, the juicy delta below.  Palms encircle your ' + CoC.player.chestDesc() + ' and caress them, gently squeezing in spite of the brutish hands holding you.  You wriggle and squirm in the collective grip of the many minotaurs for a few moments, growing more and more turned on by the treatment.  At last, you shake out of their hold and stand free, panting hard from exertion and desire.', false );
		EngineCore.dynStats( 'lus', (15 + CoC.player.sens / 10) );
		SceneLib.combatScene.combatRoundOver();
	};
	//Waste  a turn
	MinotaurMob.prototype.minotaurGangWaste = function() {
		CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00329 ] = 1;
		MainView.spriteSelect( 94 );
		MainView.outputText( '"<i>Oh man I can\'t wait to go hilt-deep in that pussy... I\'m going to wreck her,</i>" promises one bull to his brother.  The other laughs and snorts, telling him how he\'ll have to do the deed during sloppy seconds.  It quickly escalates, and soon, every single one of the beast-men is taunting the others, bickering over how and when they\'ll get to have you.  While they\'re wasting their time, it\'s your chance to act!', false );
		SceneLib.combatScene.combatRoundOver();
	};
	MinotaurMob.prototype.doAI = function() {
		MainView.spriteSelect( 94 );
		CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00329 ] = 0;
		var select = Utils.rand( 7 );
		if( select <= 2 ) {
			this.precumTease();
		} else if( select <= 4 ) {
			this.minotaurGangGropeAttack();
		} else if( select === 5 ) {
			this.minotaurGangGangGropeAttack();
		} else {
			this.minotaurGangWaste();
		}
	};

	MinotaurMob.prototype.defeated = function() {
		SceneLib.minotaurMobScene.victoryMinotaurGang();
	};
	/* jshint unused:true */
	MinotaurMob.prototype.won = function( hpVictory, pcCameWorms ) {
		if( pcCameWorms ) {
			MainView.outputText( '\n\nThe minutaurs share a laugh while you cum, but their throbbing erections don\'t subside in the slightest.' );
			EngineCore.doNext( SceneLib.combatScene, SceneLib.combatScene.endLustLoss );
		} else {
			SceneLib.minotaurMobScene.minotaurDeFeet();
		}
	};
	MinotaurMob.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		that.classNames.push('MinotaurMob');
		that.a = 'the ';
		if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00326 ] < 20 ) {
			that.short = 'minotaur gang';
		} else {
			that.short = 'minotaur tribe';
		}
		that.imageName = 'minotaurmob';
		that.long = Utils.Num2Text( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00326 ] ) + ' shaggy beastmen stand around you in a loose circle.  Their postures aren\'t exactly threatening.  If anything, they seem to be standing protectively around you, as if their presence would somehow shelter you from the rest of the mountain.  All of their features share a brotherly similarity, though there\'s still a fair bit of differences between your minotaur sons.  One of them is a head above the rest, a massive hulk of muscle so big he seems to dwarf the rest.  In stark contrast, a feminine minitaur keeps his distance in the rear.' + (CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00326 ] >= 20 ? '  The tribe constantly makes hoots and cat-calls, fully expecting to be fucking you soon.' : '');
		that.plural = true;
		that.pronoun1 = 'they';
		that.pronoun2 = 'them';
		that.pronoun3 = 'their';
		that.createCock( Utils.rand( 13 ) + 24, 2 + Utils.rand( 3 ), CockTypesEnum.HORSE );
		that.balls = 2;
		that.ballSize = 2 + Utils.rand( 13 );
		that.cumMultiplier = 1.5;
		that.hoursSinceCum = that.ballSize * 10;
		that.createBreastRow( 0 );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_STRETCHED;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_NORMAL;
		that.createStatusAffect( StatusAffects.BonusACapacity, 30, 0, 0, 0 );
		that.tallness = Utils.rand( 37 ) + 84;
		that.hipRating = AppearanceDefs.HIP_RATING_AVERAGE;
		that.buttRating = AppearanceDefs.BUTT_RATING_AVERAGE + 1;
		that.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_HOOFED;
		that.skinTone = 'red';
		that.skinType = AppearanceDefs.SKIN_TYPE_FUR;
		that.skinDesc = 'shaggy fur';
		that.hairColor = Utils.randomChoice( 'black', 'brown' );
		that.hairLength = 3;
		that.faceType = AppearanceDefs.FACE_COW_MINOTAUR;
		that.initStrTouSpeInte( 65, 60, 30, 20 );
		that.initLibSensCor( 40, 15, 35 );
		that.weaponName = 'fists';
		that.weaponVerb = 'punches';
		that.armorName = 'thick fur';
		var bonusHP = 340 + 50 * (CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00326 ] - 3);
		var lustVuln = 0.45;
		if( (CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00326 ] - 3) * 2 > 13 ) {
			lustVuln = 0.3;
		} else {
			lustVuln -= (CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00326 ] - 3) * 0.02;
		}
		that.bonusHP = bonusHP;
		that.lust = 30;
		that.lustVuln = lustVuln;
		that.temperment = Monster.TEMPERMENT_LUSTY_GRAPPLES;
		var level = 11 + Math.round( (CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00326 ] - 3) / 2 );
		if( level > 14 ) {
			level = 14;
		}
		that.level = level;
		that.gems = Utils.rand( 15 ) + 45;
		that.tailType = AppearanceDefs.TAIL_TYPE_COW;
		that.special1 = SceneLib.minotaurScene.minoPheromones;
		that.drop = Monster.NO_DROP;
		that.checkMonster();
	};
	return MinotaurMob;
} );