'use strict';

angular.module( 'cocjs' ).factory( 'Doppleganger', function( EngineCore, MainView, CoC, Monster, AppearanceDefs, StatusAffects, Utils, SceneLib, Descriptors ) {
	function Doppleganger() {
		this.init(this, arguments);
	}
	angular.extend(Doppleganger.prototype, Monster.prototype);
	Doppleganger.prototype.mirrorAttack = function( damage ) {
		this.createStatusAffect( StatusAffects.MirroredAttack, 0, 0, 0, 0 );
		MainView.outputText( 'As you swing your [weapon] at the doppleganger, ' + CoC.player.mf( 'he', 'she' ) + ' smiles mockingly, and mirrors your move exactly, lunging forward with ' + CoC.player.mf( 'his', 'her' ) + ' duplicate ' + this.weaponName + '.' );
		// Cribbing from combat mechanics - if the number we got here is <= 0, it was deflected, blocked or otherwise missed.;
		// We'll use this as our primary failure to hit, and then mix in a bit of random.;
		// tl;dr this avoids a bunch of weapon effects and perks, but given the specific means of attack, I think it actually makes sense overall. (Basically having to pull back from what you would normally do mid-attack to successfully land any kind of hit).;
		if( damage > 0 && Utils.rand( 8 ) < 6 ) {
			MainView.outputText( '  At the very last moment, you twist downwards and strike into your opponent’s trunk, drawing a gasp of pain from ' + CoC.player.mf( 'him', 'her' ) + ' as ' + CoC.player.mf( 'he', 'she' ) + ' clumsily lashes ' + CoC.player.mf( 'his', 'her' ) + ' own ' + this.weaponName + ' over you. It’s your turn to mirror ' + CoC.player.mf( 'him', 'her' ) + ', smiling mockingly at ' + CoC.player.mf( 'his', 'her' ) + ' rabid snarls as ' + CoC.player.mf( 'he', 'she' ) + ' resets ' + CoC.player.mf( 'him', 'her' ) + 'self, ' + CoC.player.mf( 'his', 'her' ) + ' voice bubbling and flickering for a moment as ' + CoC.player.mf( 'he', 'she' ) + ' tries to maintain control. (' + damage + ')' );
			this.HP -= damage;
		} else {
			MainView.outputText( '  Your' );
			if( CoC.player.weaponName === 'fists' ) {
				MainView.outputText( ' [weapon]' );
			} else {
				MainView.outputText( ' [weapon]s' );
			}
			MainView.outputText( ' meet with a bone-jarring impact, and you are sent staggering backwards by a force exactly equal to your own.' );
			MainView.outputText( '\n\n“<i>Try again, [name],</i>” the doppelganger sneers, derisively miming your falter. “<i>C’mon. Really test yourself.</i>”' );
		}
		this.addTalkShit();
	};
	Doppleganger.prototype.mirrorTease = function( damage, successful ) {
		MainView.clearOutput();
		MainView.outputText( 'You move your hands seductively over your body, and - you stop. The doppelganger stops too, staring at you with wicked coyness, ' + CoC.player.mf( 'his', 'her' ) + ' hands frozen on ' + CoC.player.mf( 'his', 'her' ) + ' form exactly where yours are. Glaring back, you begin your slow, lustful motions again, as your reflection does the exact same thing. It’s a lust off!' );
		if( damage > 0 && successful ) {
			MainView.outputText( '\n\nYou determinedly display and twist your carnality to what you know are its best advantages, ignoring what the doppelganger is doing- you’re extremely familiar with it, after all. After a few slow seconds crawl past a blush settles upon your reflection’s face, and ' + CoC.player.mf( 'he', 'she' ) + ' hands falter and stop being able to follow yours as ' + CoC.player.mf( 'he', 'she' ) + ' stares at what you’re doing.' );
			MainView.outputText( '\n\n“<i>It’s- it’s been so long,</i>” ' + CoC.player.mf( 'he', 'she' ) + ' groans, managing to break away to stare into your smirking, smouldering eyes with lust-filled rage. “<i>But I’ll have that, I’ll have everything soon enough!</i>”' );
			this.applyTease( damage );
		} else {
			MainView.outputText( 'You keep moving and displaying your body as best you can, but an overwhelming amount of self-awareness creeps in as your doppelganger mockingly copies you. Is that really what you look like when you do this? It looks so cheap, so clumsy, so desperate. As a blush climbs onto your face you feel a vague sense of vertigo as control of the situation shifts- you copy the doppelganger as ' + CoC.player.mf( 'he', 'she' ) + ' cruelly continues to slide ' + CoC.player.mf( 'his', 'her' ) + ' hands over ' + CoC.player.mf( 'his', 'her' ) + ' body exaggeratedly.' );
			MainView.outputText( '\n\n“<i>What’s the matter, [name]?</i>” ' + CoC.player.mf( 'he', 'she' ) + ' breathes, staring lustfully into your eyes as ' + CoC.player.mf( 'he', 'she' ) + ' sinks both hands into ' + CoC.player.mf( 'his', 'her' ) + ' crotch and bends forward, forcing you close to ' + CoC.player.mf( 'his', 'her' ) + ' face. “<i>Never tried it in front of a mirror? You were missing out on the nasty little tramp you are.</i>”' );
			EngineCore.dynStats( 'lus', damage + (Utils.rand( 7 ) - 3) );
		}
		this.addTalkShit();
	};
	Doppleganger.prototype.addTalkShit = function() {
		MainView.statsView.show();
		if( this.HP < 1 ) {
			EngineCore.doNext( SceneLib.combatScene, SceneLib.combatScene.endHpVictory );
			return;
		}
		if( this.lust > 99 ) {
			EngineCore.doNext( SceneLib.combatScene, SceneLib.combatScene.endLustVictory );
			return;
		}
		if( CoC.player.HP < 1 ) {
			EngineCore.doNext( SceneLib.combatScene, SceneLib.combatScene.endHpLoss );
			return;
		}
		if( CoC.player.lust > 99 ) {
			EngineCore.doNext( SceneLib.combatScene, SceneLib.combatScene.endLustLoss );
			return;
		}
		switch( this._roundCount ) {
			case 0:
				MainView.outputText( '\n\n“<i>You feel it, don’t you?</i>” The doppelganger whispers, crooking your mouth into a vicious grin. “<i>The transfer. The mirror is a vacuum without a being inside it; it reaches out for someone to complete it. Your being, to be exact. Mine wants to be free a lot more than yours. Ten years more, to be exact.</i>”' );
				MainView.outputText( '\n\n[He] goes on in a dull croon as [he] continues to circle you, moving with the odd, syncopated jerks of a creature in a body that has only existed for a couple of minutes. “<i>Just let it happen, [name]. You can’t beat me. I am you, only with the knowledge and powers of a demon. Accept your fate.</i>”' );
				MainView.outputText( '\n\nA weird fluttering feeling runs up your arm, and with a cold chill you look down to see it shimmer slightly, as if you were looking at it through running water.' );
				MainView.outputText( '\n\n<b>You need to finish this as fast as you can.</b>' );
				break;
			case 1:
				MainView.outputText( '\n\n“<i>Do you know, I can’t even remember what gender I was before I got stuck in that mirror?</i>” the doppelganger says, as [he] slides a hand between your thighs’ mirror counterparts thoughtfully. “<i>I loved changing all the time. Being stuck as one gender seemed so boring when the tools to shift from one shape to the next were always there. That’s why this was my punishment. Forced to change all the time, at the unthinking behest of whoever happened to look into this cursed thing. You have to give Lethice credit, she’s not just cruel, she’s got imagination too. It’s a hell of a combination. I’d hate to see what she had in store for you.</i>”' );
				break;
			case 2:
				MainView.outputText( '\n\n“<i>This, though... this I like, [name].</i>” [He] closes [his] eyes and' );
				if( CoC.player.hasCock() ) {
					MainView.outputText( ' strokes [his] [cock]' );
				} else if( CoC.player.hasVagina() ) {
					MainView.outputText( ' slides two fingers into [his] [vagina] and gently frigs [himself]' );
				} else {
					MainView.outputText( ' slips a hand ' );
				}
				MainView.outputText( ' underneath [his] ' + this.armorName + '. The sheer bizarreness of seeing yourself masturbate gives you pause; again the unreality intensifies, and you feel yourself shimmer uncertainly. “<i>Once I’m out of here, I’m going to hang onto this. Revel in not changing my form for once, as a tribute to the kind soul who gave me it!</i>”' );
				MainView.outputText( '\n\nIt’s getting harder to ignore the way your body shimmers and bleeds contrast at the edges, whilst your reflection only becomes more and more sharply defined.' );
				MainView.outputText( '\n\n<b>This is something, you realize with a growing horror, which is really going to happen if you don’t stop it.</b>' );
				break;
			case 3:
				MainView.outputText( '\n\n“<i>Your memories flow to me [name], as you fade like a memory. I can taste them...</i>” You struggle to stay focused, try and force your body and mind not to blur like a fingerprint on a windowpane as the doppelganger sighs beatifically.' );
				MainView.outputText( '\n\n“<i>Not bad, not bad. You led quite an interesting life for an Ingnam peasant, didn’t you? Got around. Not enough sex, though. Nowhere near enough sex. Don’t worry- I’ll correct that mistake, in due course.</i>”' );
				break;
			case 4:
				MainView.outputText( '\n\n“<i>Did you really think you could defeat Lethice, peasant?</i>” the doppelganger roars. [He] moves and speaks with confidence now, [his] old twitchiness gone, revelling and growing into [his] new form.' );
				MainView.outputText( '\n\nYou don’t dare open your mouth to hear what pale imitation of that voice comes out. “<i>Oh, by grit, crook and luck you’ve gotten this far, but defeat the demon queen? You, who still cling onto your craven, simple soul and thus know nothing of demonhood, of its powers, of its sacrifices? I am doing you and the world a favor here, [name]-that-was, because I am not just taking this fine body but also the mantel it so clumsily carried. With my knowledge and your brute physicality, I will have my revenge on Lethice, and the world will be free of her and her cruelty!</i>” [He] screams with laughter. The ringing insanity of it sounds increasingly muffled to you, as if it were coming through a pane of glass.' );
				MainView.outputText( '\n\n<b>You have time and strength for one last gambit...</b>' );
				break;
			case 5:
				MainView.outputText( '\n\nThe shimmering intensifies for a moment as something... shifts....' );
				EngineCore.dynStats( 'lus+', 1000 );
				break;
			default:
				break;
		}
		this._roundCount++;
		SceneLib.combatScene.combatRoundOver();
	};
	Doppleganger.prototype.defeated = function() {
		CoC.dopplegangerScenes.punchYourselfInTheBalls();
	};
	Doppleganger.prototype.won = function() {
		CoC.dopplegangerScenes.inSovietCoCSelfFucksYou();
	};
	Doppleganger.prototype.handleSpellResistance = function( spell ) {
		MainView.outputText( 'The mirror demon barely even flinches as your fierce, puissant fire washes over [him].' );
		MainView.outputText( '\n\n“<i>Picked up a few things since you’ve been here, then?</i>” [he] yawns. Flickers of flame cling to [his] fingers, its radiance sputtering and burning away, replaced by a livid black color. “<i>Serf magic. Easy to pick up, easy to use, difficult to impress with. Let me show you how it’s really done!</i>” [He] thrusts [his] hands out and hurls a pitiless black fireball straight at you, a negative replica of the one you just shot at [him].' );
		if( spell === 'fireball' ) {
			MainView.outputText( ' (' + CoC.player.takeDamage( CoC.player.level * 10 + 45 + Utils.rand( 10 ) ) + ')' );
		} else if( spell === 'whitefire' ) {
			MainView.outputText( ' (' + CoC.player.takeDamage( 10 + (CoC.player.inte / 3 + Utils.rand( CoC.player.inte / 2 )) ) + ')' );
		}
		this.addTalkShit();
	};
	Doppleganger.prototype.handlePlayerWait = function() {
		MainView.outputText( 'Your doppleganger similarly opts to take a momentary break from the ebb and flow of combat.' );
		this.addTalkShit();
	};
	Doppleganger.prototype.doAI = function() {
		MainView.outputText( 'Your duplicate chuckles in the face of your attacks.' );
		this.addTalkShit();
	};
	Doppleganger.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		that.classNames.push('Doppleganger');
		that._roundCount = 0;
		that.a = 'the ';
		that.short = 'doppleganger';
		that.long = ''; // Needs to be set to supress validation errors, but is handled by an accessor override.
		that.imageName = 'doppleganger';
		that.plural = false;
		that.tallness = CoC.player.tallness;
		if( CoC.player.balls > 0 ) {
			that.balls = CoC.player.balls;
			that.ballSize = CoC.player.ballSize;
		} else {
			that.balls = 0;
			that.ballSize = 0;
		}
		that.hoursSinceCum = CoC.player.hoursSinceCum;
		that.hipRating = CoC.player.hipRating;
		that.buttRating = CoC.player.buttRating;
		that.lowerBody = CoC.player.lowerBody;
		that.skinDesc = CoC.player.skinDesc;
		that.initStrTouSpeInte( CoC.player.str, CoC.player.tou, CoC.player.spe, CoC.player.inte );
		that.initLibSensCor( CoC.player.lib, CoC.player.sens, CoC.player.cor );
		that.faceType = CoC.player.faceType;
		that.skinType = CoC.player.skinType;
		that.bonusHP = 250;
		that.weaponName = CoC.player.weaponName;
		that.weaponAttack = CoC.player.weaponAttack;
		that.weaponVerb = CoC.player.weaponVerb;
		that.armorDef = CoC.player.armorDef;
		that.armorName = CoC.player.armorName;
		that.level = CoC.player.level;
		that.ass.analLooseness = CoC.player.ass.analLooseness;
		that.ass.analWetness = CoC.player.ass.analWetness;
		_.forEach(CoC.player.cocks, function(cock) {
			that.createCock( cock.cockLength, cock.cockThickness, cock.cockType );
		});
		if( CoC.player.vaginas.length > 0 ) {
			that.createVagina();
			that.vaginas[ 0 ].vaginalLooseness = CoC.player.vaginas[ 0 ].vaginalLooseness;
			that.vaginas[ 0 ].vaginalWetness = CoC.player.vaginas[ 0 ].vaginalWetness;
			that.vaginas[ 0 ].virgin = CoC.player.vaginas[ 0 ].virgin;
		}
		//Genderless get forced to have a cunny;
		if( CoC.player.vaginas.length === 0 && CoC.player.cocks.length === 0 ) {
			that.createVagina();
			that.vaginas[ 0 ].vaginalLooseness = 2;
			that.vaginas[ 0 ].vaginalWetness = 6;
			that.vaginas[ 0 ].virgin = false;
		}
		that.breastRows = [];
		_.forEach(CoC.breastRows.cocks, function(breastRows) {
			that.createBreastRow();
			var tbr = that.breastRows[ that.breastRows.length ];
			tbr.breastRating = breastRows.breastRating;
			tbr.breasts = breastRows.breasts;
			tbr.fuckable = breastRows.fuckable;
			tbr.lactationMultiplier = breastRows.lactationMultiplier;
			tbr.milkFullness = breastRows.milkFullness;
			tbr.nipplesPerBreast = breastRows.nipplesPerBreast;
		});
		that.drop = Monster.NO_DROP;
		that.checkMonster();
	};
	Doppleganger.prototype._getLong = function() {
		var str = '';
		str += 'You are fighting the doppelganger. ' + CoC.player.mf( 'He', 'She' ) + ' is a ';
		str += String( Math.floor( CoC.player.tallness / 12 ) + ' foot ' + CoC.player.tallness % 12 + ' inch tall ' );
		str += CoC.player.race() + ', with ' + CoC.player.bodyType() + '. ';
		str += CoC.player.mf( 'His', 'Her' ) + ' face is ' + CoC.player.faceDesc() + '.';
		str += ' ' + CoC.player.mf( 'His', 'Her' ) + ' ' + CoC.player.hairDescript() + ' is parted by';
		switch( CoC.player.earType ) {
			case AppearanceDefs.EARS_HORSE:
				str += ' a pair of horse-like ears';
				break;
			case AppearanceDefs.EARS_FERRET:
				str += ' a small pair of rounded ferret ears';
				break;
			case AppearanceDefs.EARS_DOG:
				str += ' a pair of dog ears';
				break;
			case AppearanceDefs.EARS_COW:
				str += ' a pair of round, floppy cow ears';
				break;
			case AppearanceDefs.EARS_ELFIN:
				str += ' a large pair of pointy ears';
				break;
			case AppearanceDefs.EARS_CAT:
				str += ' a pair of cute, fuzzy cat ears';
				break;
			case AppearanceDefs.EARS_LIZARD:
			case AppearanceDefs.EARS_DRAGON:
				str += ' a pair of rounded protrusions with small holes';
				break;
			case AppearanceDefs.EARS_BUNNY:
				str += ' a pair of floppy rabbit ears';
				break;
			case AppearanceDefs.EARS_FOX:
				str += ' a pair of large, adept fox ears';
				break;
			case AppearanceDefs.EARS_RACCOON:
				str += ' a pair of vaugely egg-shaped, furry racoon ears';
				break;
			case AppearanceDefs.EARS_MOUSE:
				str += ' a pair of large, dish-shaped mouse ears';
				break;
			default:
				str += ' a pair of non-descript ears';
				break;
		}
		str += '. ' + CoC.player.mf( 'He', 'She' ) + ' keeps exploring the area around ' + CoC.player.mf( 'his', 'her' ) + ' mouth with ' + CoC.player.mf( 'his', 'her' ) + ' tongue with a horribly acquisitive, sensual interest.';
		str += ' ' + CoC.player.mf( 'He', 'She' ) + ' moves around on ' + CoC.player.mf( 'his', 'her' ) + ' ' + CoC.player.legs() + ' with a twitchy jerkiness, ' + CoC.player.mf( 'his', 'her' ) + ' ' + Descriptors.hipDescript() + ' swinging and tightening.';
		if( CoC.player.tailType !== 0 ) {
			str += ' ' + CoC.player.mf( 'His', 'Her' ) + ' tail flicks this way and that.';
		}
		str += ' ' + CoC.player.mf( 'He', 'She' ) + ' wields the exact same ' + CoC.player.weaponName + ' you do, and is dressed in the mirror image of your ' + CoC.player.armorName + '. ';
		if( CoC.player.biggestTitSize() >= 2 ) {
			str += 'It’s difficult not to notice the way the mirror image of your ' + CoC.player.breastDescript( CoC.player.biggestTitRow() ) + ' ebbs and heaves within it.';
		}
		return str;
	};

	var DopplegangerProxy = new Proxy( Doppleganger, {
		construct: function( Target ) {
			return new Proxy( new Target(), {
				get: function( target, name ) {
					if(_.has(target.prototype, name)) {
						return target.prototype[name];
					}
					if( name === 'long' ) {
						return target._getLong();
					}
					return target[ name ];
				},
				set: function( target, name, value ) {
					target[ name ] = value;
					return true;
				}
			} );
		}
	} );
	return DopplegangerProxy;
} );