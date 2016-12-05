'use strict';

angular.module( 'cocjs' ).factory( 'Holli', function( SceneLib, CockTypesEnum, CoC, Monster, Utils, StatusAffects, Appearance, AppearanceDefs, Combat, EngineCore ) {
	function Holli() {
		this.init(this, arguments);
	}
	angular.extend(Holli.prototype, Monster.prototype);
	/*Fight -Z
	 Marae's offshoot, [monster] stands rooted in front of you.  Solid black eyes with golden pupils stare out at you.  Her normally-nude body is concealed inside her tree, though occasionally she will flash you the devilish grin of a sadistic temptress and the bark will split to reveal a pale, jiggling bit of flesh.  A pair of gnarled oak horns sprout from her forehead; leaves and flowers alternately bloom and wither on them as her face contorts with emotion.
	 stats:
	 -hella endurance, int, and str
	 -lots o' lust resist
	 -lots o' hp
	 -good armor and regenerates hp/lust every round; but much less so of all three if Jojo is burning her shit
	 -rooted in place, so med-low spd; however, if PC fails a run check he is automatically constricted
	 -not for pussies; this fight should be almost unwinnable without Jojo unless you are wicked lucky or have a super-sploity build
	 -basically requires luck plus any of firebreath level grindan, stun abuse, or blood mage whitefire/arouse abuse
	 */
	//Attack:;
	//[monster] whips out at you with branches and roots!;
	//attack noun: lash;
	//Failing to Escape -Z;
	Holli.prototype.escapeFailWithHolli = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'You ' );
		if( CoC.player.canFly() ) {
			EngineCore.outputText( 'beat your wings and ' );
		}
		EngineCore.outputText( 'try to escape, but ' + this.short + ' wraps one of her writhing roots around your [leg], slamming you to the ground and tying you up with several more!  "<i>And just where do you think you\'re going, my little meat?</i>" she hisses.  Her bark splits open, exposing her body, and a green shaft snakes out of her crotch, sprouting thorns and blooming into a rose at the tip.  She holds the drooling blossom over your [face] as she forces your mouth open with her roots!' );
		//hp loss, begin lust constrict next round;
		var damage = 15;
		damage = CoC.player.takeDamage( damage );
		EngineCore.outputText( ' (' + damage + ')\n\n' );
		CoC.player.createStatusAffect( StatusAffects.HolliConstrict, 0, 0, 0, 0 );
		Combat.combatRoundOver();
	};
	//End of Round, if no Jojo Fire -Z;
	Holli.prototype.holliBonusHealing = function() {
		//(CoC.monster hp < 100%);
		if( this.findStatusAffect( StatusAffects.HolliBurning ) < 0 ) {
			if( this.HPRatio() < 1 && this.HP > 1 ) {
				EngineCore.outputText( '\n\nWhat wounds you have inflicted on the tree-demon overflow with sap, and begin to close!  You are left to watch helplessly as she recovers, knotting up her damaged bark until it looks as formidable as before.' );
				this.addHP( 25 );
			}
			//[(CoC.monster lust > 0)];
			if( this.lust > 20 && this.lust <= 99 ) {
				EngineCore.outputText( '\n\nA single rent forms in the tree\'s armor-like surface; you can actually see the demon touching her pussy inside, and her eyes roll back as she comes!  It looks like teasing her won\'t be very effective if you can\'t distract her from pleasuring herself inside her shell.' );
				this.lust -= 10;
				//repair monster HP and lust by significant amounts;
			}
		}
		//End of Round, Round 1 with Jojo Helping - make a little woodpile;
		//output anything triggered under no Jojo Fire condition, then output;
		if( this.findStatusAffect( StatusAffects.JojoIsAssisting ) >= 0 ) {
			if( this.findStatusAffect( StatusAffects.HolliBurning ) >= 0 ) {
				EngineCore.outputText( '\n\nJojo continues to ferry firewood to stoke the blaze; flames lick at Holli, and her face contorts in anger.  Sap flows from her burn wounds, but much of it boils away before it can do her any good and her iron-hard bark is peeling in places.' );
				//much less HP regain, no lust regain, CoC.monster armor lowered;
				if( this.armorDef > 20 ) {
					this.armorDef = 20;
				}
				if( this.tou > 50 ) {
					this.tou = 50;
				}
				//Reduced Regen;
				this.addHP( 5 );
				this.lust -= 2;
				if( this.lust < 20 ) {
					this.lust = 20;
				}
			} else if( this.findStatusAffect( StatusAffects.JojoPyre ) < 0 ) {
				EngineCore.outputText( '\n\nJojo throws another handful of dry leaves and sticks on the growing pile at the demon\'s roots, then waves and calls to you.  "<i>[name]!  I\'ve got enough dry wood at her base and I\'m going to try to set it on fire!  Hold on just a bit longer; surcease is coming!</i>"' );
				this.createStatusAffect( StatusAffects.JojoPyre, 0, 0, 0, 0 );
			}
			//End of Round, Rounds 2 and 3 with Jojo Helping - light a spark;
			else if( this.statusAffectv1( StatusAffects.JojoPyre ) <= 1 ) {
				//display applicable EOR outputs for fire not lit, then these;
				//Round 2:;
				if( this.statusAffectv1( StatusAffects.JojoPyre ) === 0 ) {
					EngineCore.outputText( '\n\nJojo scurries toward the woodpile carrying a lit torch, but an eye opens on one of the demon\'s upper branches and she catches him with a root, sending him tumbling.  For a moment you lose hope, but the plucky monk rolls to the side before she can deliver another lash and from there to his feet.' );
					this.addStatusValue( StatusAffects.JojoPyre, 1, 1 );
				}
				//Round 3:;
				else {
					EngineCore.outputText( '\n\nWary of the constant surveillance from above, Jojo serpentines toward the tree at high speed, dodging roots and branches with a burning stick held in his teeth.  Just as he gets close enough to throw, a root sweeps low and sends him sprawling onto his own torch, catching some of his fur alight!  Without hesitation, he rolls toward the tinder pile and shoves a burning hand into the leaf litter.  As the ring of flammable material catches and the demon screams her frustration, he retreats to the woods, beating his arm with his dirt-smeared robe to put it out.' );
					this.createStatusAffect( StatusAffects.HolliBurning, 0, 0, 0, 0 );
				}
			}
		}
		Combat.combatRoundOver();
	};
	//if player uses whitefire/firebreath successfully, suppress these, go to 'Fire Lit' EOR events, and output additional line after the attack:;
	Holli.prototype.lightHolliOnFireMagically = function() {
		if( this.findStatusAffect( StatusAffects.JojoIsAssisting ) >= 0 ) {
			if( this.findStatusAffect( StatusAffects.HolliBurning ) < 0 ) {
				EngineCore.outputText( 'The magical fire effectively ignites a wide swath of Jojo\'s tinder, and the demon howls in rage.  Seeing this, Jojo drops the burning torch he carries and turns back toward the forest to fetch more tinder.\n\n' );
				this.createStatusAffect( StatusAffects.HolliBurning, 0, 0, 0, 0 );
			}
		}
	};
	//Monster Specials -Z;
	//fuckin' Jumanji flower darts -Z;
	Holli.prototype.fuckinJamanjiFlowerDarts = function() {
		EngineCore.outputText( 'A blossom opens up on a high branch of the tree, revealing an evil-looking eye surrounded by vicious spines.  With a gesture, ' + this.short + ' fires several at you!' );
		//Blinded - no hit penalty;
		if( this.findStatusAffect( StatusAffects.Blind ) >= 0 ) {
			EngineCore.outputText( '  Though the demon herself is blinded, the fresh eye on the flower seems more than capable of aiming for her!' );
		}
		if( Combat.combatMiss() || Combat.combatEvade() || Combat.combatFlexibility() || Combat.combatMisdirect() ) {
			EngineCore.outputText( '  Nimbly, you step aside and let the darts whistle by.' );
		}
		//Hit;
		else {
			EngineCore.outputText( '  The darts find flesh, and you feel yourself slowing down drastically; all you want to do as the plant woman\'s poison takes you is fuck and sleep.  "<i>Just give up,</i>" Holli coos.  "<i>Think how good it would be to fall into my arms and ' );
			if( CoC.player.hasCock() ) {
				EngineCore.outputText( 'come inside me' );
			} else {
				EngineCore.outputText( 'have me inside you' );
			}
			EngineCore.outputText( ', forever...</i>"' );
			//lust damage, EngineCore.fatigue damage, light HP damage;
			EngineCore.fatigue( 10 );
			EngineCore.dynStats( 'lus', 25 );
			var damage = 20 + Utils.rand( 10 );
			damage = CoC.player.takeDamage( damage );
			EngineCore.outputText( ' (' + damage + ')' );
		}
		Combat.combatRoundOver();
	};
	//constrict -Z;
	Holli.prototype.holliConstrictAttack = function() {
		EngineCore.outputText( 'A forest of thick roots bursts from the ground and several lash toward your [legs], trying to ensnare you!' );
		//Blinded - hit penalty, but not 100%;
		if( this.findStatusAffect( StatusAffects.Blind ) >= 0 && Utils.rand( 6 ) === 0 ) {
			EngineCore.outputText( '  Luckily, the demon\'s blindness makes it fairly easy to dodge the grasping roots, though there are a few close scrapes.' );
		}
		//Miss;
		if( Combat.combatMiss() || Combat.combatEvade() || Combat.combatFlexibility() || Combat.combatMisdirect() ) {
			EngineCore.outputText( '  It\'s a narrow thing, but you manage to avoid the roots - one of them almost grabs you, but you duck aside and let it find only its neighbor.' );
		}
		//Hit;
		else {
			EngineCore.outputText( '  She latches onto you with a painful smack and several more root tentacles join the first; as she pulls you close, her bark opens and a long, phallic stalk extends from her crotch, wrapped in thorns and flowering with a rose!  It caresses your face, then dangles the blossom above your mouth, dripping her sap.  Several of the roots pry your jaws apart, forcing you to drink the tainted fluids from her pseudo-cock!  "<i>What do you think of my little sap rose?</i>"' );
			//plus med HP damage on turn one, plus med-heavy lust damage every turn while constricted;
			//sap rose shitposting;
			var damage = 10 + Utils.rand( 5 );
			damage = CoC.player.takeDamage( damage );
			EngineCore.dynStats( 'lus', 15 );
			CoC.player.createStatusAffect( StatusAffects.HolliConstrict, 0, 0, 0, 0 );
		}
		Combat.combatRoundOver();
	};
	Holli.prototype.struggleOutOfHolli = function() {
		EngineCore.clearOutput();
		//Boost odds of success. Round 3 guaranteed.;
		CoC.player.addStatusValue( StatusAffects.HolliConstrict, 1, 9 );
		//Struggle Succeed;
		//if demon/dragon tongue, automatic success;
		if( CoC.player.tongueType > AppearanceDefs.TONUGE_HUMAN ) {
			EngineCore.outputText( 'You can\'t move an arm nor a [leg] to bat the flower away... but she\'s literally holding your mouth open.  Your long tongue rolls out, gripping and ripping out several of the petals on the end of her stalk!  Holli screams and her roots slacken, allowing you to batter your way out of them.' );
			CoC.player.removeStatusAffect( StatusAffects.HolliConstrict );
		}
		//else if normal str-based success;
		else if( CoC.player.str / 10 + Utils.rand( 20 ) + 1 + CoC.player.statusAffectv1( StatusAffects.HolliConstrict ) > 30 ) {
			EngineCore.outputText( 'You manage to force the roots open when the distracted Holli begins to stroke her plant-shaft, pulling out of the bindings just as a drop of sap oozes out and falls where you were standing.  You\'re free!' );
			//sap rose pls go;
			CoC.player.removeStatusAffect( StatusAffects.HolliConstrict );
		}
		//Struggle Fail/Wait;
		else {
			EngineCore.outputText( 'You try to escape the entangling roots, but cannot break their grip!  ' );
			this.waitForHolliConstrict( false );
			return;
		}
		Combat.combatRoundOver();
	};
	Holli.prototype.waitForHolliConstrict = function( newScreen ) {
		if( newScreen === undefined || newScreen ) {
			EngineCore.clearOutput();
		}
		EngineCore.outputText( 'The ominous roseate shaft hovers over you, and its owner strokes the base lewdly, moaning.  "<i>Oooh, gonna... cum!</i>" she shrieks.  As a low moan escapes her, the stalk bloats and begins to spill milky-white sap into your mouth!  Held rigid, you\'re eventually forced to swallow just to breathe; the sap slides into your stomach and warmth radiates to your midsection and groin, making you feel flushed and hot.  Holli sighs in satisfaction, evidently more relaxed after her climax.' );
		//lower monster lust by medium-lots and apply med sens-based lust damage;
		this.lust -= 20;
		if( this.lust < 20 ) {
			this.lust = 20;
		}
		EngineCore.dynStats( 'lus', 15 + CoC.player.sens / 5 );
		Combat.combatRoundOver();
	};
	//heal -Z;
	//used if monster HP < some level;
	Holli.prototype.healHolli = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'The bark splits part way and the woman\'s mouth suddenly explodes with color, her lips folding out into a rather yonic-looking orchid.  Copious white-tinted sap oozes from the bloom, coating her bark and healing the lesions.  Petals rustle as she speaks wetly through it.  "<i>Your efforts are nothing!  Throw yourself on my mercy; be my slave and do my bidding!</i>"' );
		//heal some fuckin' hp;
		this.addHP( 200 );
		Combat.combatRoundOver();
	};
	Holli.prototype.performCombatAction = function() {
		if( this.HP < 50 && Utils.rand( 2 ) === 0 ) {
			this.healHolli();
		} else if( Utils.rand( 4 ) === 0 && CoC.player.findStatusAffect( StatusAffects.HolliConstrict ) < 0 ) {
			this.holliConstrictAttack();
		} else if( Utils.rand( 2 ) === 0 ) {
			this.fuckinJamanjiFlowerDarts();
		} else {
			this.eAttack();
		}
		this.holliBonusHealing();
	};
	Holli.prototype.defeated = function() {
		SceneLib.holliScene.defeatHolli();
	};
	Holli.prototype.won = function() {
		SceneLib.holliScene.enjoyYourBadEndBIYAAAATCH();
	};

	Holli.prototype.teased = function( lustDelta ) {
		if( this.findStatusAffect( StatusAffects.HolliBurning ) >= 0 ) {
			EngineCore.outputText( 'Holli doesn\'t even seem to notice, so concerned is she with defeating you before the mounting bonfire causes her any more pain.' );
			lustDelta = 0;
		}
		this.applyTease( lustDelta );
	};
	Holli.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		that.classNames.push('Holli');
		that.a = '';
		that.short = 'Holli';
		that.imageName = 'holli';
		that.long = 'Marae\'s offshoot, Holli stands rooted in front of you.  Solid black eyes with golden pupils stare out at you.  Her normally-nude body is concealed inside her tree, though occasionally she will flash you the devilish grin of a sadistic temptress and the bark will split to reveal a pale, jiggling bit of flesh.  A pair of gnarled oak horns sprout from her forehead; leaves and flowers alternately bloom and wither on them as her face contorts with emotion.';
		that.createCock( 12, 2, CockTypesEnum.HUMAN );
		that.balls = 0;
		that.ballSize = 0;
		that.cumMultiplier = 3;
		that.hoursSinceCum = 20;
		that.createVagina( false, AppearanceDefs.VAGINA_WETNESS_WET, AppearanceDefs.VAGINA_LOOSENESS_LOOSE );
		that.createStatusAffect( StatusAffects.BonusVCapacity, 20, 0, 0, 0 );
		that.createBreastRow( Appearance.breastCupInverse( 'E' ) );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_TIGHT;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_NORMAL;
		that.tallness = Utils.rand( 12 ) + 55;
		that.hipRating = AppearanceDefs.HIP_RATING_CURVY;
		that.buttRating = AppearanceDefs.BUTT_RATING_LARGE;
		that.skinTone = 'black';
		that.hairColor = 'sandy-blonde';
		that.hairLength = 15;
		that.initStrTouSpeInte( 150, 80, 80, 85 );
		that.initLibSensCor( 75, 40, 80 );
		that.weaponName = 'branches';
		that.weaponVerb = 'branchy thwack';
		that.armorName = 'bark';
		that.armorDef = 40;
		that.bonusHP = 1000;
		that.lust = 20;
		that.lustVuln = 0.2;
		that.temperment = Monster.TEMPERMENT_RANDOM_GRAPPLES;
		that.level = 20;
		that.gems = 0;
		that.drop = Monster.NO_DROP;
		that.checkMonster();
	};
	return Holli;
} );