'use strict';

angular.module( 'cocjs' ).factory( 'Izumi', function( SceneLib, $log, MainView, CoC, kFLAGS, EngineCore, Monster, Utils, AppearanceDefs, StatusAffects, Appearance, Combat ) {
	function Izumi() {
		this.init(this, arguments);
	}
	angular.extend(Izumi.prototype, Monster.prototype);
	// Set trace outout for this classes' content.
	Izumi.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		that.classNames.push('Izumi');
		that.a = '';
		that.short = 'Izumi';
		that.imageName = 'izumi';
		that.long = 'You\'re fighting the immense Oni, Izumi.  Standing around 9 feet tall and wielding little more than her fists, she is the picture of strength and power.  She is clad in a scandalous blue and white Kimono, the garment drawing your eyes to her humongous breasts, and her perfectly sculpted thighs.  A curious horn juts from her head, the texture of it almost lost amongst the rock lining the inside of the cave.\n\nA distinctly cocky grin is painted across her face, her undivided attention focused upon you.';
		that.createVagina( false, AppearanceDefs.VAGINA_WETNESS_SLICK, AppearanceDefs.VAGINA_LOOSENESS_NORMAL );
		that.createBreastRow( Appearance.breastCupInverse( 'FF' ) ); // The doc mentions her breasts would be around D/DD on a 'normal human' so err, winging this shit
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_TIGHT;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_DRY;
		that.tallness = 9 * 12 + 0;
		that.hipRating = AppearanceDefs.HIP_RATING_AVERAGE;
		that.buttRating = AppearanceDefs.BUTT_RATING_TIGHT;
		that.skinTone = 'creamy-white';
		that.hairColor = 'golden';
		that.hairLength = 25;
		that.initStrTouSpeInte( 90, 90, 90, 80 );
		that.initLibSensCor( 30, 25, 15 );
		that.weaponName = 'fist';
		that.weaponVerb = 'punch';
		that.armorName = 'silken kimono';
		that.bonusHP = 660;
		that.lust = 10;
		that.lustVuln = 0.33;
		that.temperment = Monster.TEMPERMENT_LOVE_GRAPPLES;
		that.level = 22;
		that.gems = 25 + Utils.rand( 25 );
		that.additionalXP = 75;
		that.drop = Monster.NO_DROP;
		that.checkMonster();
	};
	// Override won/lost calls
	Izumi.prototype.defeated = function( ) {
		this.cleanup();
		SceneLib.izumiScene.touchThatFluffyHorn();
	};
	// Monster won, not player, gg for descriptive method names
	Izumi.prototype.won = function() {
		CoC.flags[ kFLAGS.IZUMI_TIMES_LOST_FIGHT ]++;
		if( CoC.player.findStatusAffect( StatusAffects.Titsmother ) ) {
			this.cleanup();
			SceneLib.izumiScene.deathBySnuSnuIMeanGiantOniTits();
		} else {
			this.cleanup();
			SceneLib.izumiScene.fuckedUpByAFuckhugeOni();
		}
	};
	// Override combat AI
	Izumi.prototype.performCombatAction = function() {
		// Handle chokeslam mechanics
		if( CoC.player.findStatusAffect( StatusAffects.Chokeslam ) ) {
			$log.debug( 'ChokeSlam Rounds to Damage: ' + CoC.player.statusAffectv1( StatusAffects.Chokeslam ) );
			CoC.player.addStatusValue( StatusAffects.Chokeslam, 1, -1 );
			if( CoC.player.statusAffectv1( StatusAffects.Chokeslam ) <= 0 ) {
				this.chokeSlamDamage();
				this.cleanupChokeslam();
			}
			SceneLib.combatScene.combatRoundOver();
			return;
		}
		// Handle groundpound
		if( CoC.player.findStatusAffect( StatusAffects.Groundpound ) ) {
			CoC.player.addStatusValue( StatusAffects.Groundpound, 1, -1 );
			if( CoC.player.statusAffectv1( StatusAffects.Groundpound ) <= 0 ) {
				this.cleanupGroundpound();
			}
		}
		// Handle titsmother
		if( CoC.player.findStatusAffect( StatusAffects.Titsmother ) ) {
			SceneLib.combatScene.combatRoundOver();
			return;
		}
		// Titsmother toggle; gonna need to play with this, it should only be used once per fight
		if( this.HPRatio() <= 0.25 ) {
			if( !this.findStatusAffect( StatusAffects.UsedTitsmother ) ) {
				$log.debug( 'Could use titsmother...' );
			}
		}
		if( (this.HPRatio() <= 0.25) && !this.findStatusAffect( StatusAffects.UsedTitsmother ) ) {
			$log.debug( 'Using Titsmother!' );
			this.titSmother();
			this.createStatusAffect( StatusAffects.UsedTitsmother, 0, 0, 0, 0 );
			return;
		} else {
			var actions = [ this.straightJab, this.straightJab, this.straightJab, this.roundhouseKick, this.roundhouseKick, this.roundhouseKick, this.chokeSlam ];
			if( !CoC.player.findStatusAffect( StatusAffects.Groundpound ) ) {
				actions.push( this.groundPound );
				actions.push( this.groundPound );
			}
			actions[ Utils.rand( actions.length ) ]();
		}
	};
	// Remove any lingering effects from the player once combat is over
	Izumi.prototype.cleanup = function() {
		$log.debug( 'Cleaning up lingering effects...' );
		this.cleanupChokeslam();
		this.cleanupGroundpound();
		this.cleanupTitsmother();
	};
	// Quick punch at the player
	// Light damage
	Izumi.prototype.straightJab = function() {
		MainView.outputText( 'Quick as a flash, this.Izumi lashes out with her free hand, aiming for your head.' );
		var damage = Math.ceil( (this.str + 175) - Utils.rand( CoC.player.tou ) - CoC.player.armorDef );
		if( Combat.combatMiss() || Combat.combatEvade() || Combat.combatFlexibility() || Combat.combatMisdirect() ) {
			MainView.outputText( '  You deftly dodge under the lightning-quick punch.' );
		} else if( damage <= 0 ) {
			MainView.outputText( '  You lash out and manage to deflect the blow before it can connect.' );
		} else {
			MainView.outputText( '  Her fist connects with your chin with a mighty crack, sending you sailing across the cave.  this.Izumi smirks at you as you' );
			if( CoC.player.isNaga() ) {
				MainView.outputText( ' raise back up onto your [legs]' );
			} else {
				MainView.outputText( ' stand' );
			}
			MainView.outputText( ' and dust yourself off.' );
			damage = CoC.player.takeDamage( damage );
			MainView.outputText( ' (' + damage + ')' );
		}
		SceneLib.combatScene.combatRoundOver();
	};
	// Roundhouse Kick
	// Milkd lust increase
	Izumi.prototype.roundhouseKick = function() {
		MainView.outputText( 'Izumi leaps backwards onto one foot, spinning around and unleashing a thundering roundhouse kick.  Luckily, you manage to duck just in time, avoiding what surely would have been a monstrously powerful blow.  Unfortunately, as Izumi’s leg scythes through the air over your head, you find your gaze naturally following the line of her thigh muscles until you’re staring directly up the fluttering folds of Izumi’s increasingly impractical kimono.\n\n' );
		if( CoC.player.cor >= 50 || CoC.player.lib >= 50 || CoC.player.sens >= 50 ) {
			MainView.outputText( 'You fall backwards and stagger away, already feeling a flush of warmth colouring your cheeks, trying to drag your mind back to the fight and away from... other things.' );
			EngineCore.dynStats( 'lus', 10 + CoC.player.lib / 10 );
		} else {
			MainView.outputText( 'You furrow a brow at the Oni\'s ineffectual attack, not entirely sure if she was intending to hurt you or turn you on.  Her thighs did look rather tantalizing though...' );
			EngineCore.dynStats( 'lus', 5 + CoC.player.lib / 20 );
		}
		SceneLib.combatScene.combatRoundOver();
	};
	// Bind player for 3 turns. If the player doesn't break out in time, they take huge damage.
	// On escape, this.Izumi takes some damage
	Izumi.prototype.chokeSlam = function() {
		if( Combat.combatMiss() || Combat.combatEvade() || Combat.combatFlexibility() || Combat.combatMisdirect() ) {
			MainView.outputText( 'Izumi surges towards you, closing the distance between you within the blink of an eye. You narrowly avoid her crushing grip, twisting away from her grasp at the last moment.  The enormous Oni lets loose a deep, satisfied laugh.' );
		} else {
			MainView.outputText( 'Izumi surges towards you, smashing aside your guard and seizing you by the throat in the blink of an eye.  Lifting you above her head, you can only struggle to breathe as the enormous Oni grins at you like some sort of prize.' );
			CoC.player.createStatusAffect( StatusAffects.Chokeslam, 3, 0, 0, 0 );
			$log.debug( 'Applied Chokeslam effect' );
		}
		SceneLib.combatScene.combatRoundOver();
	};
	// Struggle against izumi's chokeslam
	Izumi.prototype.chokeSlamStruggle = function() {
		MainView.clearOutput();
		var brokeFree;
		if( Utils.rand( CoC.player.str ) > this.str / 2 ) {
			brokeFree = true;
		}
		if( brokeFree ) {
			$log.debug( 'Escaped from Chokeslam grapple' );
			this.chokeSlamEscape();
			SceneLib.combatScene.combatRoundOver();
		} else {
			MainView.outputText( 'Izumi\'s grip around your throat continues to strangle the breath from your lungs as she holds you aloft.  Your fingers tighten in turn around the Oni\'s wrist, fighting against her' );
			if( CoC.player.str < 90 ) {
				MainView.outputText( ' immense' );
			} else {
				MainView.outputText( ' impressive' );
			}
			MainView.outputText( ' strength, in an attempt to free yourself from her crushing embrace, without success.' );
			CoC.player.takeDamage( 75 + Utils.rand( 15 ) );
			this.doAI();
		}
	};
	// OH HEY ITS A THING
	Izumi.prototype.chokeSlamWait = function() {
		MainView.clearOutput();
		MainView.outputText( 'Your feet dangle uselessly in the air as Izumi holds you aloft.  Why bother resisting?  She\'s just so <i>strong</i>, her fingers wrapped so completely around your neck...' );
		CoC.player.takeDamage( 75 + Utils.rand( 15 ) );
		if( CoC.flags[ kFLAGS.PC_FETISH ] >= 2 ) {
			MainView.outputText( ' and to be honest, the grip isn\'t an entirely unplesent experience, either.  If only Izumi would stop playing around and just <i>take you</i> already.' );
			EngineCore.dynStats( 'lus', 5 );
		} else {
			MainView.outputText( '.' );
		}
		this.doAI();
	};
	// Player fails to escape from the chokeslam, and after 3 rounds gets nailed to the fuckin floor
	Izumi.prototype.chokeSlamDamage = function() {
		MainView.outputText( 'With a grunt of effort, this.Izumi hauls you through the air, her iron-like grip around your throat providing the perfect anchor to propel you towards the ground.  Before you have a chance to react, the Oni drives you into the unforgiving stone lining the floor of the cave.\n\n' );
		MainView.outputText( 'The hit is extreme enough to leave you dazed for a moment, splayed out across the floor.  When you rouse yourself back to full consciousness a few seconds later, the cave is still echoing with the sound of the impact, a testament to the strength of the Oni - and your resilience.' );
		var damage = Math.ceil( (this.str + 225) - Utils.rand( CoC.player.tou ) - CoC.player.armorDef );
		CoC.player.takeDamage( damage );
		MainView.outputText( '(' + damage + ')' );
		SceneLib.combatScene.combatRoundOver();
	};
	// Player escapes from the chokeslam attack
	Izumi.prototype.chokeSlamEscape = function() {
		$log.debug( 'Escaping from Chokeslam!' );
		MainView.outputText( 'Scrabbling desperately against her wrist, you narrow your eyes at the Oni woman’s superior expression,' );
		if( CoC.player.isBiped() ) {
			MainView.outputText( ' raise a [leg] and kick her roundly' );
		} else if( CoC.player.isNaga() ) {
			MainView.outputText( ' raise your tail and slap her solidly' );
		} else {
			MainView.outputText( ' and slap her square' );
		}
		MainView.outputText( ' in the face.  this.Izumi drops you, staggering back in surprise.  “Ow!”  She actually yelps, covering her face with her hands.\n\n' );
		MainView.outputText( 'You drop to the ground and roll away, expecting some form of retribution.  this.Izumi glares at you from behind her hand for a moment, then snickers.  Slowly, she drops back into her fighting stance and gestures for your bout to continue.' );
		this.cleanupChokeslam();
		this.HP -= 50 + Utils.rand( CoC.player.str );
		SceneLib.combatScene.combatRoundOver();
	};
	// Remove the effect post-combat
	Izumi.prototype.cleanupChokeslam = function() {
		if( CoC.player.findStatusAffect( StatusAffects.Chokeslam ) ) {
			$log.debug( 'Removing chokeslam' );
			CoC.player.removeStatusAffect( StatusAffects.Chokeslam );
		}
	};
	// Groundslam, does damage and slows the player if they don't dodge the hit
	Izumi.prototype.groundPound = function() {
		MainView.outputText( 'Izumi raises one mighty foot and slams it to the ground with a victorious yell.  The ground itself actually shakes below your feet, threatening to knock you off balance.\n\n' );
		if( Combat.combatMiss() || Combat.combatEvade() || Combat.combatFlexibility() || Combat.combatMisdirect() ) // TODO: ensure this is correct
		{
			MainView.outputText( 'Leaping to the side, you manage to steady yourself against the wall, keeping your footing.' );
		} else {
			MainView.outputText( 'The rumbling actually knocks you off your feet, sprawling on the ground and banging your head.  As the shaking subsides, you pull yourself upright, but you feel a little unsteady on your [feet] after the disorienting impact.' );
			var spdReducedBy = Math.ceil( CoC.player.spe * 0.25 );
			CoC.player.createStatusAffect( StatusAffects.Groundpound, 3, spdReducedBy, 0, 0 );
			EngineCore.dynStats( 'spe-', spdReducedBy );
			$log.debug( 'Applying Groundslam slow' );
		}
		SceneLib.combatScene.combatRoundOver();
	};
	// Remove the effect post-combat, fixup stats
	Izumi.prototype.cleanupGroundpound = function() {
		if( CoC.player.findStatusAffect( StatusAffects.Groundpound ) ) {
			// Can't use dynStats to achieve this, as it can give back more speed than we originally took away due to perks
			CoC.player.spe += CoC.player.statusAffectv2( StatusAffects.Groundpound );
			if( CoC.player.spe > 100 ) {
				CoC.player.spe = 100;
			}
			CoC.player.removeStatusAffect( StatusAffects.Groundpound );
			$log.debug( 'Removing Groundpound slow effect' );
		}
	};
	// Binding attack, mild lust increase per turn until the player breaks out. Not TOO hard to break out, though.
	// Attack will be used ONCE, when Izumi reaches ~25% hp.
	Izumi.prototype.titSmother = function() {
		$log.debug( 'Titsmother attack!' );
		// Attack will ALWAYS hit, but be relatively easy to break out of
		MainView.outputText( 'With a sudden burst of speed, the Oni woman bullrushes you, slapping aside your hasty defence.  You brace yourself for a powerful impact, but rather than strike you she instead thrusts her arm straight past your head.  Bemused, you turn your head to follow her fist, just in time to see her crook her elbow and yank you back towards her - hard.  Pulled right off your [feet] by the sudden strike, you slam' );
		if( CoC.player.hasMuzzle() ) {
			MainView.outputText( ' muzzle-' );
		} else {
			MainView.outputText( ' face-' );
		}
		MainView.outputText( 'first into Izumi - specifically, into her chest.  Shocked by suddenly having your face rammed into the pillowy soft expanse of Izumi’s bust, you rear back only to be slammed straight back into the mountainous expanse by Izumi’s arm.' );
		CoC.player.createStatusAffect( StatusAffects.Titsmother, 0, 0, 0, 0 );
		EngineCore.dynStats( 'lus', (CoC.player.lib / 15) + 5 + Utils.rand( 5 ) );
		SceneLib.combatScene.combatRoundOver();
	};
	// Remove the effect post-combat
	Izumi.prototype.cleanupTitsmother = function() {
		if( CoC.player.findStatusAffect( StatusAffects.Titsmother ) ) {
			CoC.player.removeStatusAffect( StatusAffects.Titsmother );
			$log.debug( 'Removing Titsmother' );
		}
	};
	// Struggle handler for titsmother attack
	Izumi.prototype.titSmotherStruggle = function() {
		$log.debug( 'Titsmother Struggle' );
		var brokeFree;
		if( Utils.rand( CoC.player.str ) > this.str / 4 ) {
			brokeFree = true;
		}
		if( brokeFree ) {
			$log.debug( 'Broke free of Titsmother!' );
			this.titSmotherEscape();
			SceneLib.combatScene.combatRoundOver();
		} else {
			if( Utils.rand( 2 ) === 0 ) {
				MainView.clearOutput();
				MainView.outputText( '“Hah!  Say goodnight, ‘cause I’m going to choke the fight right out of you!”  She cries exuberantly, forcibly mashing your face into her bosom.  It would appear that she is trying to throttle you, but only having one hand is making the task difficult.  You can breathe just fine, but having your face forced into the constantly jostling mass of tit-flesh before you is distracting to say the least.\n\n' );
				MainView.outputText( 'You scrabble desperately against Izumi’s grip, trying not to think about where you’re placing your hands, or how soft and pliant the flesh beneath you is, or any number of other upsetting little details - but to no avail.  Izumi’s grip is incredibly strong.  You hang there for a moment, trying to get your breath back for another attempt as Izumi jostles and presses against you from all sides.' );
			} else {
				MainView.clearOutput();
				if( CoC.player.hasCock() ) {
					MainView.outputText( 'Assaulted by the sensation of being pressed against such warm flesh, you can already feel [eachCock] starting to stiffen against your will.  Your hardening erection' );
					if( CoC.player.totalCocks() > 1 ) {
						MainView.outputText( 's' );
					}
					MainView.outputText( ' just makes things even more unbearable, as the harder' );
					if( CoC.player.totalCocks() > 1 ) {
						MainView.outputText( ' they get' );
					} else {
						MainView.outputText( ' it gets' );
					}
					MainView.outputText( ', the more insistently your' );
					if( CoC.player.totalCocks() > 1 ) {
						MainView.outputText( ' erections throb' );
					} else {
						MainView.outputText( ' erection throbs' );
					}
					MainView.outputText( ', pressed up against Izumi’s stomach muscles.  Her muscles ripple and undulate as she struggles to keep you in her grip, abs flexing, bumping, encircling your insistent erection' );
					if( CoC.player.totalCocks() > 1 ) {
						MainView.outputText( 's' );
					}
					MainView.outputText( ', stimulating you even further.  You realize in a flash of panic that if you don’t get out of this soon, you may actually... ' );
				} else {
					MainView.outputText( 'Izumi’s bust encloses you on all sides, leaving you feeling like you’re trapped in some kind of breast sarcophagus.  The heat radiating from the soft flesh combines with the scent of whatever strange drug Izumi had been smoking, now hanging around her like some heady perfume.' );
				}
			}
			EngineCore.dynStats( 'lus', CoC.player.lib / 15 + 5 + Utils.rand( 5 ) );
			this.doAI();
		}
	};
	// Player breaks free of tiSmother and applies damage to Izumi
	Izumi.prototype.titSmotherEscape = function() {
		$log.debug( 'Escaping TitSmother!' );
		MainView.clearOutput();
		if( CoC.player.str < 90 ) {
			MainView.outputText( 'Straining with all your might, you still can’t quite manage to break Izumi’s grip, but you do manage to somehow slide upwards through the valley of her bust.  Izumi’s face looms into view, the enormous woman gritting her teeth as she attempts to crush the fight out of you.  In an act of desperation, you rear back and then knife forwards in a brutal headbutt.\n\n' );
			MainView.outputText( '“Ack!”  Your forehead connects with her chin in a collision that probably hurts you as much as her, judging by the searing pain that lances through your forehead as she drops you to the floor. Meanwhile, this.Izumi staggers back, rubbing at her chin.  “Ow.  That hurt, kid!”  She says reproachfully.  The two of you take a moment to shake the cobwebs from your heads before dropping back into your combat stances, a little more wary this time around.\n\n' );
		} else {
			MainView.outputText( 'Locking your arms against Izumi’s shoulders, you heave with all your might against the musclebound Oni girl’s choke hold.  You can feel her arm straining to hold you, struggling to resist, giving ground....' );
			if( CoC.player.isBiped() ) {
				MainView.outputText( '  As soon as you can, you hike up your legs and place your feet firmly on Izumi’s stomach, adding your leg muscles to the effort.' );
			}
			MainView.outputText( '  this.Izumi grits her teeth and growls as she pulls with all her might, trying to force your limbs to give way, but to no avail - with a final thrust, this.Izumi lets out a yelp as you knock her arm aside and leap away.  this.Izumi rolls her arm around a little, massaging her shoulder as she regards you, thoughtfully.  Then she reaches up and fans at her face with one hand, grinning that suggestive grin.\n\n' );
		}
		MainView.outputText( '“Oh my,” she purrs, lasciviously. “Aren’t you the impressive one?  Keep surprising me like that and I might just forget about this handicap...”' );
		this.cleanupTitsmother();
		this.HP -= (15 + Utils.rand( CoC.player.str ));
		SceneLib.combatScene.combatRoundOver();
	};
	// Wait handler for titsmother attack
	Izumi.prototype.titSmotherWait = function() {
		MainView.clearOutput();
		$log.debug( 'Waiting during TitSmother' );
		MainView.outputText( 'With your face crushed into the Oni\'s cleavage, you can\'t help but wonder; why bother resisting?  She\'s just so <i>strong</i>, and her breasts feel so lushious against your [face]...' );
		EngineCore.dynStats( 'lus', CoC.player.lib / 10 + 5 + Utils.rand( 5 ) );
		if( CoC.flags[ kFLAGS.PC_FETISH ] >= 2 ) {
			MainView.outputText( ' and to be honest, her grip isn\'t an entirely unplesent experience, either.  If only Izumi would stop playing around and just <i>take you</i> already.' );
			EngineCore.dynStats( 'lus', 5 );
		} else {
			MainView.outputText( '.' );
		}
		this.doAI();
	};
	return Izumi;
} );