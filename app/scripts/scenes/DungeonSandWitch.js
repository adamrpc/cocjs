'use strict';

angular.module( 'cocjs' ).run( function( SandMother, PregnancyStore, MainView, CumWitch, Combat, Appearance, ConsumableLib, Utils, PerkLib, StatusAffects, Descriptors, CockTypesEnum, EventParser, OnLoadVariables, AppearanceDefs, kFLAGS, CoC, EngineCore ) {
	function DungeonSandWitch() {
	}

	DungeonSandWitch.DUNGEON_WITCH_ENTRANCE_GATEWAY = 23;
	DungeonSandWitch.DUNGEON_WITCH_CAVERNOUS_COMMONS = 24;
	DungeonSandWitch.DUNGEON_WITCH_WEST_WARRENS_MAIN = 25;
	DungeonSandWitch.DUNGEON_WITCH_CHILDRENS_PLAYROOM = 26;
	DungeonSandWitch.DUNGEON_WITCH_PREGNANT_LUST_ROOM = 27;
	DungeonSandWitch.DUNGEON_WITCH_WEST_WARRENS_WEST = 28;
	DungeonSandWitch.DUNGEON_WITCH_NURSERY = 29;
	DungeonSandWitch.DUNGEON_WITCH_PHARMACY = 30;
	DungeonSandWitch.DUNGEON_WITCH_EAST_WARRENS_MAIN = 31;
	DungeonSandWitch.DUNGEON_WITCH_SLEEPING_CHAMBER = 32;
	DungeonSandWitch.DUNGEON_WITCH_BATH_ROOM = 33;
	DungeonSandWitch.DUNGEON_WITCH_EAST_WARRENS_EAST = 34;
	DungeonSandWitch.DUNGEON_WITCH_CUM_WITCH_BEDROOM = 35;
	DungeonSandWitch.DUNGEON_WITCH_CUM_WITCH_OFFICE = 36;
	DungeonSandWitch.DUNGEON_WITCH_SACRIFICIAL_ALTAR = 37;
	DungeonSandWitch.DUNGEON_WITCH_THRONE_ROOM = 38;
	DungeonSandWitch.prototype.enterBoobsDungeon = function() {
		CoC.getInstance().scenes.dungeonCore.dungeonEnterRoom( DungeonSandWitch.DUNGEON_WITCH_ENTRANCE_GATEWAY );
	};
	DungeonSandWitch.prototype.leaveBoobsDungeon = function() {
		OnLoadVariables.dungeonLoc = 0;
		EngineCore.clearOutput();
		EngineCore.outputText( 'You leave the door behind and take off through the desert back towards camp.' );
		EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
	};
	DungeonSandWitch.prototype.fightCumWitch = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'A robed witch crests one of the dunes, her sable skin glistening with moisture in the unforgiving desert sun.  She spies you, and her dusky lips curl up in a smile while a white staff materializes in her hands.  Playfully, the woman calls, "<i>I\'m going to cast a spell on you...</i>"' );
		Combat.startCombat( new CumWitch() );
	};
	DungeonSandWitch.prototype.openZeDoorToParadize = function() {
		EngineCore.clearOutput();
		//Touch Sphere to Open: ;
		if( CoC.getInstance().flags[ kFLAGS.ENTERED_SANDWITCH_DUNGEON ] === 0 ) {
			EngineCore.outputText( 'You hesitantly touch the dark sphere, admiring its smooth, glossy finish.  Almost as soon as you come in contact with it, it recedes into the wall.  The doorway rumbles, a giant slab vanishing into the sandy depths, opening a portal to the inside.  Meticulous carvings inlaid with pearl depict large breasted witches in great quantity, and though the specific means of the glyphs are foreign to you, it\'s clear this place is some kind of sanctuary for sand witches.' );
			CoC.getInstance().flags[ kFLAGS.ENTERED_SANDWITCH_DUNGEON ] = 1;
		}
		//Repeat;
		else {
			EngineCore.outputText( 'Just ahead is the familiar sight of the sand witches\' coven.  It\'s hewn from a sandstone archway buried in the side of a dune.  Pearl-inlays of big-breasted, lactating witches decorate the way inside, making it clear what you can expect to find inside.' );
		}
		CoC.getInstance().scenes.dungeonCore.dungeonEnterRoom( DungeonSandWitch.DUNGEON_WITCH_CAVERNOUS_COMMONS );
	};

	/*Sand Witch Mob
	 Very high hit points, not much stronger than a regular sand witch
	 {Standard Descript} You are surrounded by a veritable tribe of sand witches. Having cast off their protective, concealing robes in the safety of their den they stand before you almost completely naked, little more than double-bikinis and loincloths protecting their modesty.  They glower at you hatefully, outraged that you would invade their home, and ready themselves to drag you down with sheer numbers.
	 {Bonus Lust Descripts}
	 (40) You are surrounded by myriad flushed faces and erect nipples as your licentious temptations begin working their way through the rage of the sand witches.
	 (60) Loincloths are soaked all around and milk trickles from quadruplet breasts almost in sympathy. A number of the sand witches seem more interested in their sisters than in facing you, but there's still plenty of them with their mind on your defeat.
	 (80) There's not much fight left in these sand witches now; they have other things on their mind. Maybe a third of them are starting to openly jill themselves off or make out with their fellows, distracting those who are still trying to fight with their licentious acts. You doubt it will take much more to drive them all over the edge...
	 */

	//*Females & Small-DIcked Males Lose:;
	//https://docs.google.com/document/d/1UnXTFRvGS7TJF8KqMo2XSRo9qSpG8JM2aHc9c5RwPP8/edit#;
	//PC Loses;
	DungeonSandWitch.prototype.loseToSammitchMob = function() {
		if( CoC.getInstance().player.hasCock() && CoC.getInstance().player.biggestCockArea() >= 6 ) {
			this.memeberedFolksFindTrueWuv();
			return;
		}
		EngineCore.clearOutput();
		//[If defeated by HP loss];
		if( CoC.getInstance().player.HP < 1 ) {
			EngineCore.outputText( 'You fall to the dirt floor, beaten and bruised, no longer having the will to keep fighting.  The sand witches all gather around you, snickering on how weak you are.  Your vision is blurry as you look up at the dark figures towering over your prone form, you can only wonder what they\'ll do to you.' );
		}
		//[If defeated by Lust gain];
		else {
			EngineCore.outputText( 'Your frustration is too much to bear and you fall over, using your [weapon] to support yourself.  Your vision is blurry and your loins ache to be touched as all of the sand-witches gather around you.  One of them walks up to your panting form and kicks your [weapon] out from under you, making you fall flat on your face, producing a few laughs and giggles out of these girls.  You turn onto your back and look up at the figures looming over you.' );
		}

		EngineCore.outputText( '\n\nThey rip off every piece of your [armor] and throw it ' );
		if( CoC.getInstance().flags[ kFLAGS.SAND_WITCHES_FRIENDLY ] === 0 ) {
			EngineCore.outputText( 'into the fire like it was trash' );
		} else {
			EngineCore.outputText( 'off to the side' );
		}
		EngineCore.outputText( ', leaving you naked and exposed before these ravishing women.' );
		if( CoC.getInstance().player.hasCock() ) {
			this.getMockedForSmallDongBySammitchMob();
		} else {
			this.femaleGirlsLoseToSammitches();
		}
	};
	//Loss Orgies;
	//Male;
	//-Small cock, they all mock your size and each takes a turn making the PC cum;
	DungeonSandWitch.prototype.getMockedForSmallDongBySammitchMob = function() {
		EngineCore.outputText( '\n\nOne witch yells out "<i>Look how small ' + CoC.getInstance().player.mf( 'his', 'her' ) + ' cock is!</i>"  All their eyes are directed to your crotch and grins of mockery crack their faces.  "<i>It could fit in the palm of my hand.</i>" "<i>My nipples are bigger than that!</i>" "<i>Do we have a magnifying glass, I can\'t see it.</i>"  They keep on this teasing of you until one kneels down and squeezes your [cock smallest] between her middle and index finger.  "<i>Let\'s see if this tiny dick can even cum at all...</i>"' );
		EngineCore.outputText( '\n\nShe starts massaging your cock, not really a stroke, more like flicking her wrist so her fingers can go down your small shaft.  All the other sand-witches look on, amused as your tiny hardness tries to look big and intimidating.  They even make cute kissy faces at your itsy-bitsy [cock smallest], the kind of expression you give to small animals.' );
		EngineCore.outputText( '\n\nLittle drops of pre-cum bead up on your [cockHead smallest] and spill over, lubing your tormentor\'s fingers as she continues to degrade you, saying how you\'ll cum like a virgin bitch and how you can only dream of a proper fuck with this equipment.' );
		EngineCore.outputText( '\n\nYou try not to give these sand-witches the satisfaction of seeing you cum but you\'re completely at their mercy, what little they have.' );
		if( CoC.getInstance().player.cumQ() < 250 ) {
			EngineCore.outputText( '  A little squirt of spooge dirties the witch\'s two fingers, creating a small web of spunk between them.  "<i>Heh, knew it</i>" the witch smugly says, giving you a pathetic look.' );
		} else if( CoC.getInstance().player.cumQ() < 500 ) {
			EngineCore.outputText( '  Spurts of sweet release shoot from your [cock smallest], glopping the bitch-witch\'s hand.  "<i>Nothing too impressive</i>" she snidely remarks as she rubs your spunk off on the dirt floor.' );
		} else {
			EngineCore.outputText( '  Your [cock smallest] shoots out a barrage of cum onto the bitch\'s face, caking her disbelieving features into a thick layer of slimy goop as her fellow sisters laugh, pointing at her spunk-covered face.' );
		}

		EngineCore.outputText( '\n\n"<i>Oh look, it\'s getting even smaller</i>" one slut witch says, pointing out your receding cock.  You\'re kinda glad it\'s happening.  Their abuse of you is over!  They look a bit sad that their fun is softening until one chimes up, reaches into her cleavage with one hand and pulls a bottle out of her top.  All the witches start giving you impish smiles.' );
		EngineCore.outputText( '\n\nThey hold your head down, pinch your nose shut, and force your mouth open as the one with the bottle pours the concoction down your throat.  You try your best not to swallow the stuff, but they force your mouth closed and massage your throat to make the vile fluid go down.  Your reflexes betray you, and you swallow all of it.  Satisfied, the witches let you breathe again and watch excitedly for what happens next.' );
		EngineCore.outputText( '\n\nIt starts with a warm feeling in the pit of your stomach, traveling to your micro cock and immediately stiffening it to be as hard as it was moments ago.  Your torturous pleasure  isn\'t over yet.  Another witch places her dirty foot on your chemically hardened member.  Claiming how pathetic it is for her dainty feet to cover the entire length of your [cock smallest], she lightly steps on your sensitive meat, your weak little cock trying to push against her soft, bare sole as she crushes you with it.  Then, her soft stepping turns to rubs, and you feel the smooth creases of her foot rub against your small length.' );
		EngineCore.outputText( '\n\nThe drug they gave you must have made your body very sensitive as you already feel a new orgasm pulsing through your cock.  You grit your teeth and try to hold it back.  The sand-witches all laugh at your poor attempt at defiance.  This only encourages the witch stepping on you, and she pushes down harder as she strokes and flicks your [cock smallest] with her toes.' );
		EngineCore.outputText( '\n\nYou try to deny her advances, but her fun isn\'t going to stop until you cum.  You grit your teeth and try to hold it back, but she\'s too good for you.  You cum a few pathetic drops onto her sole.' );
		if( CoC.getInstance().player.balls > 0 ) {
			EngineCore.outputText( '  Your [balls] didn\'t have enough time to make another full batch.' );
		}
		EngineCore.outputText( '  It\'s very watery, dripping down between her toes. Your cock has a dirty smudge of where her foot was.' );
		EngineCore.outputText( '\n\nShe holds her foot up to your face and orders you to lick.  In your weak state of mind, you follow her orders,sticking out your tongue to taste the mix of dirt and thin cum off her foot.  You lick every little drip of spunk, and she lets you keep licking long after all the cum is gone. Now you\'re just licking the crud off her foot.' );
		EngineCore.outputText( '\n\nYou keep on licking until the sole of her foot has turned back to the light tan color it once was.  Then she steps on the dirt floor with it, undoing all your tongue work.' );
		EngineCore.outputText( '\n\nYour cock is still hard and wanting, and the next sand-witch kneels down ' );
		if( CoC.getInstance().player.isBiped() ) {
			EngineCore.outputText( 'between your legs' );
		} else {
			EngineCore.outputText( 'to your side' );
		}
		EngineCore.outputText( '.  She takes your dirty cock in her hand.  She must have been dared to do something.  Looking at her peers with pleading eyes, she says, "<i>Are you sure about this?</i>"  A small group of witches egg her on, telling her to "<i>do it.</i>"' );
		EngineCore.outputText( '\n\nThe witch huffs out like she\'s in a pickle and takes in a deep breath.  She forces your entire cock in her mouth and begins rolling it around with her tongue.  Cleaning up the dirty mess the last witch left behind, she pleases you out of peer-pressure.' );
		EngineCore.outputText( '\n\nShe huffs and puffs her hot breath on you, her tongue pleasing the entire length of your cock.  The few witches that encouraged her, look on in shock and humor, not believing their fellow witch is doing this; you would feel insulted if you cared, but this witch is really good at it.' );
		//If balls:;
		//[If balls & pussy:];
		if( CoC.getInstance().player.balls > 0 && CoC.getInstance().player.hasVagina() ) {
			EngineCore.outputText( '  She even cups your [balls] but moves to touch your [vagina] when she feels its wetness dripping off the testes.' );
		} else if( CoC.getInstance().player.balls > 0 ) {
			EngineCore.outputText( '  She even cups your tender [balls] and lightly massages them.' );
		} else if( CoC.getInstance().player.hasVagina() ) {
			EngineCore.outputText( '  She even lightly caresses the lips of your pussy.' );
		}
		EngineCore.outputText( '\n\nYou cum a hot shot down the sand-witch\'s throat.  She swallows the seed and opens her mouth, but not to show you how good of a slut she is.  No, she does it to show her "<i>friends</i>" she did their dare.  The girls cheer at the cock sucking whore as she stands with the smell of cum on her breath and joins them in spectating.' );
		EngineCore.outputText( '\n\nThe sand witches keep taking turns humiliating you by making your little cock shoot and leak out cum, draining of you of all your seed until you finally black-out from dehydration.' );
		//[if for fun];
		if( CoC.getInstance().flags[ kFLAGS.SAND_WITCHES_FRIENDLY ] > 0 ) {
			EngineCore.outputText( '\n\nYou wake up hours later outside the dungeon with all your belongs and surprisingly not missing any gems.' );
			OnLoadVariables.dungeonLoc = 0; //Replaces		inDungeon = false;
			CoC.getInstance().player.orgasm();
			EngineCore.dynStats( 'lib', 1, 'sen', -1 );
			Combat.cleanupAfterCombat();
		}
		//[Bad end for small cocks];
		EngineCore.outputText( '\n\nYou spend the rest of your life being a bitch to the sand witches.  Kept naked and hard all the time, you\'re chained-up like an animal in the chamber with your hands tied behind your back, making sure you don\'t play with yourself.  The witches do mess with you from time to time, but mostly they just let you drown in your lust.  Many nights you yearn to feel the touch of your mistresses. You want them to humiliate you if it means they\'ll pleasure your little cock.  Sometimes, when a group of witches walk by, you try to look as wanting as possible.  They just walk by, saying how desperate and sad you look, leave you alone with that raging hard-on.' );
		EngineCore.outputText( '\n\nYour only saving grace are the new witches who came of age throughout the years and join the rest of their sisters in the fun.  A lot of them seem to like you, and sometimes they use you to practice spells.  Your hair has been sandy blond for a long time now, and your chest has been leaking milk too.  Besides the spells, they like to practice fucking with you.  They are nice and gentle at first but become more demanding and demeaning as time goes on, up until they forget about you.' );
		//[END];
		CoC.getInstance().player.orgasm();
		EngineCore.dynStats( 'lib', 1, 'sen', -1 );
		EventParser.gameOver();
		CoC.getInstance().player.HP = CoC.getInstance().player.maxHP();
	};
	//Female;
	//Lesbian gang-bang;
	DungeonSandWitch.prototype.femaleGirlsLoseToSammitches = function() {
		//Lesbian gang-bang, some leave and come back with sex toys.;
		EngineCore.outputText( '\n\nTwo witches spread your [legs] and hold them apart.  You\'re about to yell out in protest, but one witch plants her two cunts over your face and begins riding your [face], quickly muffling you before you can make a peep.' );
		if( CoC.getInstance().player.hasMuzzle() ) {
			EngineCore.outputText( '  She fucks your muzzle like a cock as it goes into one cunt while she plays with the other one.' );
		} else {
			EngineCore.outputText( '  She grinds her dampening pussies against your lips while her clits are pressed up against your nose.' );
		}

		EngineCore.outputText( '\n\nYou try to thrash your arms, but two more witches sit on them, grinding their slut-holes onto your arms in a perverted way to restrain you.  The witches on your [legs] see how creative their sisters are being and follow their example, spreading your [legs] farther apart turning them into their pleasure toys as their wet pussies start to rock back and forth.' );
		EngineCore.outputText( '\n\nTwo witches leave the room while the other ones wait in line for a spot on the new slut.  The four girls getting off on your limbs are moaning in delight as they play with their milky rows, squeezing some out onto your body.  ' );
		if( !CoC.getInstance().player.hasVagina() ) {
			EngineCore.outputText( 'Amazingly, as the oil spreads over your crotch, the flesh splits, revealing a small, wet entrance with a little clit.' );
			CoC.getInstance().player.createVagina();
			CoC.getInstance().player.clitLength = 0.25;
		}
		EngineCore.outputText( 'Their warm streams run all over your form: down your [chest], off your [hips] and teasingly around your [vagina].  At this point, you want it so badly that you squeeze your chest, pinch your nipples and stroke your [clit].' );
		EngineCore.outputText( '\n\nHowever these girls hold you from that pleasure, leaking their juices all over your limbs, as they moan with the bliss you so want to feel right now.  The other witches, how you envy them, are able to feed their wanting with light strokes and gropes as they watch their sisters in action.  Some even lend a helping hand to the more lusty witches, fingering their wet pussies and groping their milk-filled teats as the horny whore holds onto them in her lust filled daze.  If only you were so lucky.' );
		EngineCore.outputText( '\n\nYour [vagina] is so hungry to feel the touch of anything right now, "<i>They\'re doing this to you on purpose,</i>" you think as your [vagina] trembles with cock-milking clutches.  Your eyes are dazed in agonizing lust, and you see the two witches who left have came back through an archway into the chamber, carrying bundles of something in their arms.  The other witches all look glad to see those two girls.' );
		EngineCore.outputText( '\n\n"<i>Sorry it took so long, the pregnant slut wanted to do some role-playing,</i>" one sand-witch says as she drops her bundle to reveal that she\'s fully naked and wearing a huge dragon cock strap-on.  The dropped bundle is a variety of attachable sex-toys.  Many have multiple shafts and come in shapes from standard to canine to obscenely equine.' );
		EngineCore.outputText( '\n\nAll the spectating witches go over to the pile of sex toys while casually discarding their clothing to the side, leaving you alone with the slut ' );
		if( !CoC.getInstance().player.hasMuzzle() ) {
			EngineCore.outputText( 'grinding on your face' );
		} else {
			EngineCore.outputText( 'fucking your muzzle while she plays with herself' );
		}
		EngineCore.outputText( ' and the four others whining out their enjoyment, making your own pussy feel neglected and needing something to fill it.' );
		EngineCore.outputText( '\n\nThe witches by the fake dick pile are kneeling down, each selecting their equipment in their own unique way.  Some just hold a cock in their grip, look at it, and just throw it back into the pile.  Others measure theirs by sucking on it like a real cock, shoving the monstrous toys down their throats.  It\'s amazing how much they can take.  Finally, the other few take a test ride on the pricks they pick.  All of the riding witches take more than one of the obscene toys into their bodies, their stomachs becoming deformed as two phallic shapes push up against their flesh.  These girls make some of the loudest moans you\'ve ever heard as they pound and slam their cunts on the toys, spraying out large rivers of girl-cum onto their sisters and the others toys as they make climatic moans.' );
		EngineCore.outputText( '\n\nYour attention is brought back to the sand-witches on your body as the one on your face cums directly into your mouth, making you flinch.  The warm flood of cum spill over your arms and [legs] as well.  The witches on you are pushing their cunts as hard as possible, and they hold onto your body, making one last booming moan.  Grinding their cum-sloobering pussies in the afterglow, they pant out in exhaustion.  Once they finally devour every little bit of pleasure they can get from you, they get up and join their sisters in the sex toy display, leaving you alone, covered in milk and cum, eyes practically glued shut with caked-on lady-cum.' );
		EngineCore.outputText( '\n\nWho cares-your hands are finally free.  You shoot one down to your sex, happily fingering the soaked hole and stroking the [clit].  One witch who already picked her strap-on, a hard cat cock with soft rubbery barbs, sees you having fun and runs over to stop you.  There\'s a quaint struggle, but she holds your hands up and saddles herself on your stomach, her kitty cock resting ' );
		if( CoC.getInstance().player.biggestTitSize() >= 1 ) {
			EngineCore.outputText( 'between' );
		} else {
			EngineCore.outputText( 'on' );
		}
		EngineCore.outputText( ' your [chest].' );
		EngineCore.outputText( '\n\n"<i>Hey girls, hurry up and pick a cock already!  The ' );
		if( CoC.getInstance().flags[ kFLAGS.SAND_WITCHES_FRIENDLY ] > 0 ) {
			EngineCore.outputText( 'slut' );
		} else {
			EngineCore.outputText( 'initiate' );
		}
		EngineCore.outputText( ' is getting a bit randy!</i>"' );
		if( CoC.getInstance().flags[ kFLAGS.SAND_WITCHES_FRIENDLY ] > 0 ) {
			EngineCore.outputText( '\n\nYou would think more on that word, but you\'re too focused on the cock toy on your chest. You look at it with lust in your eyes and beg its owner to fuck you with it, make you cum with it, to make you her bitch.' );
		}

		EngineCore.outputText( '\n\nAll the other witches gather a great variety of fake cocks to surround you.  The witch sitting on top of you gets off and sits you up on your knees, keeping your hands behind your back and whispering in your ear that they\'ll all give you all the "<i>cock</i>" you want, but you have to show them you have the skills.  She throws you onto your hands, and three witches stand before you. Their fake animal cocks all point at your face as they smirk at you.' );
		EngineCore.outputText( '\n\nYou reach out and grip the cocks to your left and right while your mouth sucks on the one in the middle.  The sand-witches smile like fiends as you try your best to serve them, though the only pleasure they\'ll get is seeing how desperate you look.  You\'re so willing to please them in hopes that they will fuck you.  The witch with the cock is groping your [chest], playing with and pitching your [nipples] as she slides the barded-covered cock between the lips of your [vagina].  The small little nubs scratch at your cunt and tease your clit, as the toy rapidly grows lubricated with your own juices.  She murmurs in your ear.  "<i>Good little cock sucker.  Do you want your rewards?</i>"  With a toy-prick still in your mouth, you smile and shake your head \'yes\'.  The kitty-witch pulls you off the cocks you\'re pleasing and turns you around, making you sit on her crossed [legs], her kitten dick pushing against your [vagina] and stomach like it was alive.' );
		EngineCore.outputText( '\n\nYou bend your knees up and hover your drooling pussy over the cat-cock and slam down onto it with no hesitation.  You feel so full and blissed as splashes of your fuck-lube squirt from how hard you\'re pounding yourself onto the sand-witch\'s "<i>cock</i>".  You ride her like a crazed slut, moaning and screaming as your fucking shakes the witch\'s body, jiggling her milky mounds.  Other witches present their faux erections to you, and you happily take one, suckling on anything you can while the other ones rub them on your ' + CoC.getInstance().player.skinFurScales() + '.  They can\'t feel the sensations like proper penies but they\'re getting off on the very act of rubbing phallic objects over every inch of such a whorish individual.  These girls proceed to kiss and lick each other as they massage their strap-ons all over your body.' );
		CoC.getInstance().player.cuntChange( 30, true, true, false );
		EngineCore.outputText( '\n\nYou\'re already messily cumming on the crotch of the cat-cocked witch.  Not taking one moment to stop for your climax, you continue to fuck the artificial erection you so desperately wanted.  The witch grabs your [butt] and lifts you up as she stands, even though you\'re still thrusting your [hips] towards her cooch.  She spreads your asscheeks and announces, "<i>Which one of you other sluts wants this ass?</i>"' );
		EngineCore.outputText( '\n\nThe witch with the rigid draconic cock steps up and helps her sister support you as she directs her toy tool towards your [asshole].  Your cheeks clench around the dragon-toy as you feel it push against the hole.  You ignore it, much to the witch\'s frustration as she tries to penetrate you.  The only thing you care about is stuffing your pussy right now. The dragon-endowed witch has to memorize your thrusting and waits for the right moment.' );
		EngineCore.outputText( '\n\nWith a well-timed thrust, she impales her entire plastic pecker into your [asshole], making you freeze in surprise.  You would have fallen butt naked to the ground if you weren\'t being held up by these witches and their "<i>cocks</i>".   At least they have the courtesy to keep giving you pleasure while you\'re stopped.  Both of  their unique cocks are inside you, the barbed cock pleasingly scratching your pussy walls while the ridged cock pushes and pulls through your ass.  You can feel them rubbing against each other from within their respective fuck-holes.  All the sensation you were craving is now being given to you.  Your mind is hazy as you look at the witch\'s black glossed lips, your own parted in your daze.' );
		EngineCore.outputText( '\n\nThe witch licks her lips as she sees how interested you are in them; she pouts her lips for a moment, giving an invitation for you to go for it.  You move in close and dreamily kiss her, your tongues dancing with one another as both your [asshole] and [vagina] keep getting fucked with artificial cocks.' );
		EngineCore.outputText( '\n\nYou cum, seemingly without any build-up, and then it happens again, and again... It just comes and keeps coming.' );
		EngineCore.outputText( '\n\nThe next few hours are a blur.  You remember being on your knees then sucking a cock while your pussy is licked, stroking three cocks with your hands and [feet] and even being completely upside down at one point.  Then things gradually fade to black...' );
		CoC.getInstance().player.orgasm();
		EngineCore.dynStats( 'lib', 1 );
		//[Next];
		EngineCore.menu();
		if( CoC.getInstance().flags[ kFLAGS.SAND_WITCHES_FRIENDLY ] > 0 ) {
			EngineCore.addButton( 0, 'Next', this.sandWitchMobNotBadEnd );
		} else {
			EngineCore.addButton( 0, 'Next', this.sandWitchMobBadEnd );
		}
	};
	//[if for fun];
	DungeonSandWitch.prototype.sandWitchMobNotBadEnd = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'You wake up hours later outside the dungeon with all your belongings, surprisingly not missing any gems.' );
		OnLoadVariables.dungeonLoc = 0; //Replaces	inDungeon = false;
		CoC.getInstance().player.orgasm();
		EngineCore.dynStats( 'lib', 1, 'sen', -1 );
		Combat.cleanupAfterCombat();
	};
	//[Sand-witch mob Bad end for Females];
	DungeonSandWitch.prototype.sandWitchMobBadEnd = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'When your mind finally starts straightening things out, you wake up on a bed with your ass, cunt, and more sore than you can remember.  You rub the achy bits as you notice a cloaked figured with a wide-brimmed pointy hat sitting by your bedside, reading a white book.  When the figure sees you\'ve awaken from your slumber, she places a bookmark in the volume and sets it on the nearby nightstand.' );
		EngineCore.outputText( '\n\n"<i>Good morning sister, did you have a nice nap?</i>"' );
		EngineCore.outputText( '\n\nSister? You\'re not related to this girl... are you?' );
		EngineCore.outputText( '\n\n"<i>Looks like you stumbled into the commons again. You know you\'re not supposed to go there until you\'ve learned all your spells. Those girls will fuck you raw... which they did.</i>"' );
		EngineCore.outputText( '\n\nOh yes, how could you forget something like that? You\'ve been told hundreds of times before to avoid that place.  Well, you won\'t forget that anytime soon with how sore and tender your holes are.' );
		EngineCore.outputText( '\n\nThe cloaked girl stands up and pulls the blanket off your naked body.  You have bronzed skin, sandy blonde hair, two sore pussies and three rows of decently sized, milk-leaking breasts.  The cloaked girl hands you a mirror for you to look at yourself with.  Yep, you have a normal feminine, human face like you\'ve had your whole life... right?' );
		EngineCore.outputText( '\n\nShe helps you out of the bed, and you get a better look at her face, which is almost as dark as the cloak and hat she wears.  The ebony girl reminds you that you can\'t leave the sanctuary until you\'ve learned your spells and then, pulls you in close, explaining that you\'ll never get to experience a proper fucking or taste her cum until then.  You look down at the crotch of her robes and see she\'s pitching a very big cock-tent.  You promise the well-endowed herm that you\'ll try to do your best, and she gives you a nice pat and grab on your [butt] as you run back to start studying.' );
		EngineCore.outputText( '\n\n<b>A few months later...</b>\n' );
		EngineCore.outputText( 'After weeks of studying hard, you\'ve finally learned everything there is to know about being a sand-witch. You\'ve been given your desert-colored robes and are allowed to join the other witches in the commons, and can even leave the sanctuary.  After your first appointment with the Cum-Witch, you take a nice walk outside with cum drooling from both your cunts, travelling down your legs and leaving a soaked trail to follow. It feels a bit like deja vu as you take your first steps into the world.  You just shake it off.' );
		EngineCore.outputText( '\n\nYou wander around the desert for a while, muttering an introduction of who you are and what you want to do.  Then, you see a figure walking along the dunes. Okay, time to show them your stuff.  Getting to the figure, you announce yourself:' );
		EngineCore.outputText( '\n\n"<i>Excuse me, I\'m a sand witch, may I cast a spell on you?</i>"' );
		CoC.getInstance().player.HP = CoC.getInstance().player.maxHP();
		EventParser.gameOver();
	};
	//*Membered Folks Get Milked;
	DungeonSandWitch.prototype.memeberedFolksFindTrueWuv = function() {
		EngineCore.clearOutput();
		//HP;
		if( CoC.getInstance().player.HP < 1 ) {
			EngineCore.outputText( 'Slumping down under the weight of your myriad injuries, you fitfilly struggle to hold yourself upright.  The struggle proves to be in vain when your [legs] fold and the ground rushes up, filling your view with hard-packed earth for the split-second before you impact.  Stars and blackness fill your vision as you lie there dazed, too hurt to even make an attempt at rising.  High-pitched, feminine titters of laugher irritate your ears as the girls react to your state.  Well, you\'ll show them.  You use every ounce of your willpower to force your arms into action, and with all the speed of a wallowing pig, you roll yourself over.  The effect is less than impressive, but at least you can see the crowd of woman looming over you.  The shadows from their numerous, milky bosoms cast you into darkness as the enormity of your defeat sets in.' );
			EngineCore.outputText( '\n\nA short witch shoulders through her sisters to appraise you.  Her sisters part before her confident strides with a suprising degree of deference, even though this woman is at least a foot shorter than most of them.  She doesn\'t even have huge breasts!  They might be double-D\'s or E\'s if she\'s lucky.  Obscuring a great deal of the right half of her face, a swirling tattoo with patterns intricate enough to make your vision swim clearly differentiates her from her cohorts.' );
			EngineCore.outputText( '\n\n"<i>An interloper, huh?  Well, now that you\'ve found us, we can\'t exactly let you go free, can we, sisters?</i>" the diminutive enchantress says with an icy undercurrent of dark promise.  A murmured but incomprehensive babble of assent is voiced by the crowd.  Shit, you\'re in deep here.  The tattooed tramp casually hovers her palm over your face and begins to chant nonsensical words.  Any second now, there\'ll be an explosion of flame, or a clap of sandstone, and you\'ll be burned or pulped into the next world...  You close your eyes and breathe deep, savoring what\'s sure to be your last breath of cool, fresh air.' );
			EngineCore.outputText( '\n\nYour pain fades under a numbing explosion of warmth, leaving you feeling whole and hale.  Is this... death?  The pleasant heat slowly circulates through your extremities before nestling in your chest.  Your heart beats faster, pounded on by an overexcited drummer somewhere inside you.  Wait, dead people don\'t have heartbeats.  You open your eyes and look up into the witch\'s smiling face, illuminated by her glowing tattoos as the rest of your injuries vanish.  Rolling her wrist to make her hand and fingers twirl above you, she stokes the artificial calefaction hotter.  A twitch within your [armor] alerts you to a new feeling that\'s spreading through you - lust.  The hotter it gets, the faster your heart beats and the harder [eachCock] grows.  You whimper as the ardor savages your restraint, causing you to whimper and paw at your tenting, twitching bulge.  Scraping against the insides of your gear, your [nipples] are in no better shape.  They faintly ache to be touched' );
			if( CoC.getInstance().player.hasFuckableNipples() ) {
				EngineCore.outputText( ', fondled, and fucked' );
			} else {
				EngineCore.outputText( ' and fondled' );
			}
			EngineCore.outputText( '.' );
			if( CoC.getInstance().player.hasVagina() ) {
				EngineCore.outputText( '  Your [vagina] even gets in on the action, converting your undergarments into a swampy mess of female pheromones and dripping lubricant.' );
			}
		}
		//Lust;
		else {
			EngineCore.outputText( 'How... how can you resist any longer?  The witches step closer, their heaving chests just out of arms\' reach, tented by hard nipples, some moist with milk while others are barely lifting the fabric.  Maybe some of those puffy areolas are hiding some cute, little inverted nipples?  Gasping at how hard [eachCock] has become, you sink down on your [butt] and start to grope yourself through your [armor].  Fuck, you hope these hot babes are going to have their way with you...' );
			EngineCore.outputText( '\n\nOne of them, a shorter girl with a mass of interlocking arcane tattoos emerges from the crowd.  She\'s got a tight body with two surprisingly modest sets of DD-cup tits.  If she weren\'t nearly a foot taller than the rest, those boobs would look tiny by comparison, but they\'re perfectly proportional for her frame.  The other girls give her plenty of room as she closes in on you, perhaps out of respect or fear.  She eyes you while you lewdly grope yourself, eventually speaking.' );
			EngineCore.outputText( '\n\n"<i>Interloper, you have found our coven.  Regretfully, we cannot allow you to leave with this knowledge.  From this moment forward, you are dead to the outside world.</i>"' );
			EngineCore.outputText( '\n\n...What!?  The thought is enough to stay your hands and aching genitals.  Are they going to... kill you?  The panicked look must be showing on your face, because the spellcaster suddenly starts laughing.' );
		}
		//MERGE;
		EngineCore.outputText( '\n\n"<i>You didn\'t think we were going to kill you, did you?</i>" purrs the petite witch.  "<i>Just because we can\'t let you leave doesn\'t mean you have to die.</i>"  Slowly caressing your chin, she admits, "<i>You can serve us in other ways.</i>"  Her hand slips through your [armor] to affectionately squeeze [oneCock].  You groan as your fingers dig into the dirt and your back arches to lift your [hips] firmly into the palm of her hands.  A whisper of excitement runs through the crowd at your intense reaction.  Slowly starting to stroke it, she purrs, "<i>Girls, I don\'t think the Sand Mother will object if we claim this one as the coven\'s newest toy.  Let\'s take ' + CoC.getInstance().player.mf( 'him', 'her' ) + ' back and have some fun.</i>"' );
		EngineCore.outputText( '\n\nWhen the palm removes itself from your stiff protrusion, you cry out in disappointment, pleading with her to continue.  Your need is almost supernatural at this point - if you don\'t get some friction on [oneCock] soon, you\'re sure you\'ll go insane!' );
		EngineCore.outputText( '\n\n"<i>Now now, patience, pet.  We\'ll have you comfortable soon enough,</i>" the leader promises with an undercurrent of... is that compassion?   She pets your head as her sisters cluster around you, dozens of breasts pressing in on you from all sides as you\'re lifted up by a crowd of lustful arms.  More than one hand finds a nipple to tweak, a butt-cheek to squeeze, or orifice to play with, and as you\'re carried down the tunnels your [armor] vanishes, bit by bit, pulled away by the crowd\'s kleptomaniacal grip.' );
		EngineCore.outputText( '\n\nA hand discovers [oneCock]' );
		if( CoC.getInstance().player.cockTotal() === 2 ) {
			EngineCore.outputText( ' while another grabs your other one' );
		} else if( CoC.getInstance().player.cockTotal() > 2 ) {
			EngineCore.outputText( ' while others latch onto the rest' );
		}
		EngineCore.outputText( ', and the stroking starts up again with an immediacy that\'s too much for your overstimulated body.  [EachCock] belches out a stream of white liquid love, straight into the crowd of giggling women, but they don\'t seem to mind you stickying their hands, robes, and skin with your spermy deposits.  It\'s an intriguing new experience for them - it must have been some time since they\'ve had the chance to dominate a penis so completely.  Moaning, you bounce along in an orgasmic haze, spurting the whole way into your new home, not registering your own arrival until the splooge-slicked palms release your ' + CoC.getInstance().player.multiCockDescriptLight() + ' and leave you to blurt a small rope onto your own belly.' );
		EngineCore.outputText( '\n\n"<i>Oh, that won\'t do,</i>" the short witch coyly proclaims, "<i>We\'re going to have to work on your stamina if you\'re going to be a good toy for us.  Lucky for you, we have just the thing for that!  Bernice, bring our other captive over here!</i>"' );
		EngineCore.outputText( '\n\nAnother robed woman, who must be Bernice, comes out dragging a wheeled cart.  A shiny cage covered in seals and scrolls sits on top of it.  The papery coverings rustle ominously as it comes closer, barely allowing you a peek at coils of purple skin within, their moist, rubbery texture glinting through the bars.  Bernice bows before the tattooed boss-woman and says, "<i>Here she is, Dara, but why can\'t we play with the new toy first?</i>"' );
		EngineCore.outputText( '\n\nDara, the one who\'s been in charge this whole time answers, both to her subordinate and you at the same time, "<i>The new pet already blew ' + CoC.getInstance().player.mf( 'his', 'her' ) + ' load all over us, remember?</i>"  She licks some of your salty issue from her thumb.  "<i>We\'ll let her train our drained arrival until ' + CoC.getInstance().player.mf( 'he', 'she' ) + '\'s up for playing whenever we are.</i>"  This seems to satisfy Bernice, but you\'re dealing with equal parts fear and confusion.  What the fuck is this thing, and if it\'s a tentacle monster, why is it a \'her\'?' );
		EngineCore.outputText( '\n\nDara shoos her compatriots towards the exit and approaches the cage.  Tearing off one of the seals, she holds her palm in front of the gap, looking at you expectantly.  A purple-hued tendril emerges from the opening, placing itself obediently into Dara\'s sperm-slicked palm.  At the salty contact, the phallic-looking tip folds back on itself, exposing a pinkish maw that drips clear strings of lubricant.  It mashes itself against the nutritious moisture while its hundreds of cilia stretch out to lick every bit of goo, only stopping when the tattooed caster\'s hand is cleaned of sperm and soaked with lubricant.' );
		EngineCore.outputText( '\n\n"<i>She wandered in from the desert.  A few of the girls found her dying in the dunes, a wilted, pathetic little thing.  It was awful!  We brought her back and nursed her back to health with milk and what cum the Cum Witch would spare for us.  The Mother didn\'t approve, but we kept it contained, and we\'ve been purifying it ever since.  You see, these beasts aren\'t demons, though they are corrupt.  That means they can be purified, and this one has been... mostly.  We-we\'re still working on it.</i>"  Dara rubs her hands together a little nervously, inadvertently smearing the creature\'s juices around and shuddering.  "<i>Uh...  anyway, she\'s been a real trooper through it all, and she doesn\'t talk much, but she\'s very attentive, and in a few months she might even be able to go around on her own.  Of course, she\'ll still need milk and cum to live, so you two are a natural fit!</i>"' );
		EngineCore.outputText( '\n\nDara releases the probing vine-cunt and steps back to you, taking ' );
		if( CoC.getInstance().player.cockTotal() > 1 ) {
			EngineCore.outputText( 'a ' );
		} else {
			EngineCore.outputText( 'your ' );
		}
		EngineCore.outputText( 'flaccid penis in her hand and beginning to smear it with the tentacle-creature\'s leavings.  You begin to flush with heat immediately, going rock-hard in her grip with three hard hammers of your heart.  Your tanned captor smirks as she releases your tumescent shaft, stepping back towards the throng of smiling girls at the doorway.  She\'s blushing quite a bit, but her voice is steady as tempered steal as she says, "<i>By the way, its lubricant is an aphrodisiac.  We\'ll check back on you in a week or so.</i>"  One side of the cage opens, and the witches leave, sealing the door behind them.' );
		EngineCore.outputText( '\n\nThe female tentacle beast, if that\'s what it is, doesn\'t look much like what you would expect.  Most of its bulk seems to be comprised of wiggly, wet protrusions, each long and prehensile, stacked up so that the creature\'s resting posture reminds you of a plate of spaghetti with a big purple meatball on top of it.  That central bulb, for lack of a better term, is smooth, mottled purple and green, and wet with glossy moisture.  You can\'t see eyes or a mouth, but it pivots upon its limbs to regard you all the same.  It locomotes out of its cave in a flailing crowd of wiggling limbs, stretching out to fill the bulk of the room with phallic, vermillion protrusions.  A few of them have already opened up to expose their textured, contoured interiors.  Some have long fibrous cilia thin enough to appear like pink lace inside them.  Others have coarse nubs.  Some gape wide at their entrance, moulded to accommodate obscene, canine swelling.  This creature seems made to please penises, but it hasn\'t forced itself upon you just yet...' );
		EngineCore.outputText( '\n\n"<i>Hi,</i>" the creature suddenly intones, its voice sounding a set of quadruplets speaking in perfect harmony.  "<i>I hope, uh, you don\'t mind me... um... ooooh!</i>"  She interrupts herself when one of the floral pussies darts forward, latching onto [oneCock] with unquenchable hunger.  The slimy interior isn\'t as warm as you would have thought, but it is filled with tiny, vibrating nubs, large enough to press on your sensitive nerves while her lubricants seep into your skin, bringing with them even more unnatural excitement.  [EachCock] puffs up with unspent need, swelling to a full, aching hardness' );
		if( CoC.getInstance().player.balls > 0 ) {
			EngineCore.outputText( ' while your [balls] start to work, clenching and relaxing as they brew a thick load of fuckbatter thanks to the chemical jump-start.' );
		} else {
			EngineCore.outputText( ' while your body starts to work, clenching and relaxing as it rushes to brew a thick load of fuckbatter thanks to the chemical jump-start.' );
		}
		EngineCore.outputText( '\n\n"<i>Whoops!</i>" the creature says, "<i>It\'s so hard not to...  Mmm... that feels good...</i>"  Its rounded surface blushes a darker purple.  "<i>Right!  I don\'t get much cum, and having someone like you here is pretty great for me.  Bernice said I can.... ugh... yeah...</i>"  The purplish, prehensile pussy bottoms out around your [sheath] and the lumps begin to vibrate faster and faster.' );
		if( CoC.getInstance().player.cockTotal() > 1 ) {
			EngineCore.outputText( '  Similarly textured cunnies playfully snake around your other phallus' );
			if( CoC.getInstance().player.cockTotal() > 2 ) {
				EngineCore.outputText( 'es' );
			}
			EngineCore.outputText( ', gleefully slurping up your twitching hardness inside ' );
			if( CoC.getInstance().player.cockTotal() === 2 ) {
				EngineCore.outputText( 'itself' );
			} else {
				EngineCore.outputText( 'themselves' );
			}
			EngineCore.outputText( '.' );
		}
		EngineCore.outputText( 'Slurping noisily, the cunt' );
		if( CoC.getInstance().player.cockTotal() > 1 ) {
			EngineCore.outputText( 's piston' );
		} else {
			EngineCore.outputText( ' piston' );
		}
		EngineCore.outputText( ' and bob, splattering ' );
		if( CoC.getInstance().player.cockTotal() > 1 ) {
			EngineCore.outputText( 'their' );
		} else {
			EngineCore.outputText( 'its' );
		}
		EngineCore.outputText( ' dripping saliva all over your exposed crotch.  Your [hips] lurch up to meet the hungry tentacles.  Feeding the creature\'s cum-lust is something your body seems driven to do at this point, and you gurgle in wordless delight at her ministrations.' );
		EngineCore.outputText( '\n\nThe creature darkens, its central core wobbling in a decidedly jello-like fashion as it breathily says, "<i>Wow, you taste good!  Mmmm, we\'ll be good friends, right?</i>"' );
		EngineCore.outputText( '\n\nYou grunt and cum to the sound of her melodious voices.  Offering up a torrent of sordid semen, [eachCock] packs its tubular mate with a big, thick load.  The surface of the cock-stuffed tendril distends from the weight of your sensual deposit, forming a bulb that is slowly pulled towards the core just in time to make room for your next ejaculation.  A pleasant yet painful ache develops in your [balls] by the time you finish and flop nervelessly onto your back.' );
		EngineCore.outputText( '\n\n"<i>Oh no!  Here, drink some of this!  It\'ll make you all better!</i>" the monstrous female offers, pressing a pouty pussy to your mouth.  You\'re too drained to fight and too thirsty not to drink.  Besides, the way her aphrodisiacs are affecting you, having a mouth full of cunny seems kind of good.  You weakly grab hold of the tubular organ and begin to explore it with your tongue, moaning when a gush of fresh, fruity fem-jism explodes into your throat.  It\'s... it\'s... delicious!  You swallow the nectar with gusto, chugging the stuff, oblivious to the way it makes your ' + CoC.getInstance().player.skin() + ' burn with heat or how cum has begun flooding and bubbling in your [balls].' );
		EngineCore.outputText( '\n\nA slobbery cunt trails its moist juices on your cheek tenderly, and her voices proudly say, "<i>You must really like me!  Wow, what a relief.  You seem pretty busy, and ummm... that feels really, REALLY good, so I think I\'ll just- unghhhhh...</i>"  She pants a few times.  "<i>...uh, feed you while you feed me!  My juices are supposed to make you cummy and horny enough to keep up with me.  Isn\'t that great?</i>"' );
		EngineCore.outputText( '\n\nYou nod into her pussy as the immense, swelling load inside you grows larger yet.  Feeding her is going to be lots of fun...' );
		CoC.getInstance().player.orgasm();
		EngineCore.dynStats( 'lib', 5 );
		//[Nest];
		EngineCore.menu();
		EngineCore.addButton( 0, 'Next', this.memeberedFolksFindTrueWuv2 );
	};
	DungeonSandWitch.prototype.memeberedFolksFindTrueWuv2 = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( '<b><u>One week later...</u></b>\n' );
		EngineCore.outputText( 'The door cracks open, shedding light on the sordid, coiled scene that you\'ve spend the past few days languishing in.  At some point, you learned that your companion had been named Ophelia by the sisters, and as your cum-spurting, pussy-licking, cock-milking orgy continued, you were drawn closer and closer to her.  Sure, the first night you slept alone (or as alone as you can be with a bundle of tentacles ' );
		if( CoC.getInstance().player.cockTotal() === 1 ) {
			EngineCore.outputText( 'fighting over your cock' );
		} else {
			EngineCore.outputText( 'milking your cocks' );
		}
		EngineCore.outputText( ', forcing you to wet dream after wet dream), but she was always kind to you, even if you didn\'t get a choice in how often you\'d be brought to orgasm.  The second night you slept in her coils.  The third night, you had begun to genuinely like her.  The fourth, she showed you her primary vagina, and you slept beneath her, letting her ride you through the night.' );
		EngineCore.outputText( '\n\nNow, you\'re cum-drunk on love and the tender affections of your aphrodisiac-drugging lover.  You\'ve fed on nothing but her juices this whole time, but she has LOTS of juices, all of varying flavors and consistencies.  You\'ve sampled every one of her tentacles orally and phallically, and you still haven\'t picked a favorite.  Well, her primary cunt, on the bottom of her bulb is a maestro that can direct a sexual symphony around [oneCock], but it doesn\'t taste as great as some of the others.  Your waist is pinned in there right now, though you\'re sitting up and hugging her smooth, moist mass, grinning dopily at the doorway as Dara smells the scent of a week of solid sex.' );
		EngineCore.outputText( '\n\nJuice gushes out between her thighs as her nostrils flare, drinking down days of distilled pheromones.  Her skin flushes red and her knees quake.  Grabbing hold of the doorway for support, she meekly gurgles, "<i>Oh gods,</i>" before cumming again, splattering her juices all over the floor.  With her tongue lolling out, she maintains the strength of mind to advance through the fuck-mist and grab you around the shoulders.  Ophelia plucks a number of bottles from Dara\'s waist with her limbs, but otherwise, she doesn\'t resist.  Her voice bubbles happily even as you\'re pulled out of her cunt, "<i>I\'ll see you soon, love.  I\'m sure our owners have some more things to teach us both before we meet again!</i>"' );
		EngineCore.outputText( '\n\nDara slams the door and collapses onto you, both bodies tumbling to the floor.  Her face lands on your hips, just close enough that her lips and nose rub along [oneCock].  The tanned, tattooed beauty moans out loud, shivering with untapped need while her dual cunts drool like sieves.  She climbs atop you with a second thought, taking you in the middle of the hall while her sisters watch, many of them already jilling off after catching a hint of the sealed-off breeding aroma.  "<i>Fuckfuckfuckfuckohgodsitssogooooood....</i>" Dara cries.  Her sexual utterances are muffled by a second pair of curvy hips when Bernice sits on your face, rubbing your nose against her stiff clit while her juices gush down your throat.' );
		EngineCore.outputText( '\n\nYour body is well trained by its time in captivity, and you immediately and messily orgasm for your feminine overlords.  Your hands are stuffed up waiting, well-stretched pussies as you thrash in sensual ecstasy.  Bliss and conditioning take over, forcing you to slurp and lick, to please the pussy before you while cumming for another.  The Sand Witches seemed to have expected something like this, but not to such a powerful degree.  They make the most of the situation by fucking you, one after another.  Sometimes they fist their creamed-cunts on you or make out with you while you\'re breeding their sisters.  Other times, you\'re only dealing with fresh, unfucked pussies.' );
		CoC.getInstance().player.orgasm();
		EngineCore.dynStats( 'lib', 5 );
		//[Next];
		EngineCore.menu();
		EngineCore.addButton( 0, 'Next', this.memeberedFolksFindTrueWuv3 );
	};
	DungeonSandWitch.prototype.memeberedFolksFindTrueWuv3 = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'You wake from your stupor in a room full of sex toys, some of them being used by the busty witches.  It doesn\'t take long for one of them to see your state, offer you food and a drink, and present her sopping cunts to you.  You note that these women are both pregnant, but their libidos have obviously gone through the roof.  Thrusting inside her immediately, you gorge yourself on the proffered nourishment and do your duty as a captive love-slave, pleasing their holes again and again until they\'re so full of your cum that it slops from their lips in lewd waves with every virile ejaculation.' );
		EngineCore.outputText( '\n\nSometimes, when you seem unhappy, they let you spend the night with Ophelia.  She\'s as attentive and caring as when you first met, even if she has grown larger and more powerful.  Her sweet personality shines through despite her inhuman appearance, and she\'ll tenderly milk you all night long while the two of you share stories of your lives.' );
		EngineCore.outputText( '\n\nEventually, she\'s deemed purified enough to traverse the caves on her own, and though Ophelia does not lactate, the sisters make great use of her fluids.  Your monstrous lover spends most of her time with you, however.  Your adventure ended, but you found a love who genuinely treasures you and ensures that you get to experience dozens of orgasms an hour for days at a time...' );
		CoC.getInstance().player.orgasm();
		EngineCore.dynStats( 'lib', 5 );
		EventParser.gameOver();
	};
	//PC Wins;
	DungeonSandWitch.prototype.yoYouBeatUpSomeSandWitchesYOUMONSTER = function() {
		EngineCore.clearOutput();
		CoC.getInstance().flags[ kFLAGS.SANDWITCH_MOB_DEFEATED ] = 1;
		EngineCore.outputText( 'The sand witches all collapse to the floor in a vast puddle of milk and pussy juice, ' );
		if( CoC.getInstance().monster.HP < 1 ) {
			EngineCore.outputText( 'nursing their wounds' );
		} else {
			EngineCore.outputText( 'frantically making out with each other, huddling into a squirming orgy on the floor' );
		}
		EngineCore.outputText( '.  You stand alone, the sole victor, triumphant against your enemies; you can easily continue deeper into the caves, now.' );
		//PC has sufficient lust:;
		EngineCore.menu();
		if( CoC.getInstance().player.lust >= 33 ) {
			EngineCore.outputText( '\n\nThen again, given you\'ve now proven your superiority over these witches, maybe it\'s time to blow off a little steam, hmm?' );
			if( CoC.getInstance().player.hasCock() ) {
				EngineCore.addButton( 0, 'Fuck One', this.dicksHaveSexWithAWitch );
			}
			if( CoC.getInstance().player.hasVagina() ) {
				EngineCore.addButton( 1, 'Forced Lick', this.forceCunnilingusRimjobClitAndNipple );
			}
		}
		//Present PC with Leave and Orgy options;
		EngineCore.addButton( 9, 'Leave', Combat.cleanupAfterCombat );
	};
	//Dicked Win Sex;
	DungeonSandWitch.prototype.dicksHaveSexWithAWitch = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'Looking over the ' );
		if( CoC.getInstance().monster.HP < 1 ) {
			EngineCore.outputText( 'painfully ' );
		}
		EngineCore.outputText( 'writhing pile of female flesh, you place your hands on your [hips] and survey the pile for the prettiest of the litter.  They\'re all gorgeously tanned with lustrous, blonde hair, but there\'s enough variety in facial features, hair style, breast size, and hips for you to narrow down which one you\'d like to take the most.  She\'s a true beauty in the classical sense, at least facially.  She has a small, button nose, ripe lips, and hair that\'s tied back in a waist-length ponytail.  Her four breasts are well-rounded E-cups, big and round enough for your fingers to sink into but just barely pert enough not to show any sag.' );
		EngineCore.outputText( '\n\nBig, brown eyes look up at you with obvious fear as you approach.  Well, that won\'t do.  You hold your hand out to her calmly, putting as welcoming a smile as you can for your fallen foe.  She looks around her ' );
		if( CoC.getInstance().monster.lust > 99 ) {
			EngineCore.outputText( 'masturbating companions' );
		} else {
			EngineCore.outputText( 'groaning companions' );
		}
		EngineCore.outputText( ' for advice but finds none, and with no other choice, she takes your hand and allows you to separate her from her kin.  You put a hand to her cheek and tell her that you won\'t hurt her.  She and her kind have incited a great deal of lust in you, and while you intend to vent it on her, you don\'t see why it has to be unpleasant for her.' );
		if( CoC.getInstance().monster.lust > 99 ) {
			EngineCore.outputText( '  Judging by the omnipresent flush on her cheeks and the scent of female honey inundating the air, she\'s more than ready to help you with your problem.' );
		} else {
			EngineCore.outputText( '  Her cheekbones slowly color at the thought, turning almost entirely beet-red.  At the same time, her nipples seem to tighten beneath her robes, signalling her body\'s acceptance of your intent.' );
		}

		EngineCore.outputText( '\n\nThe beautiful sand witch shudders and shrugs out of her robes, allowing her four, sweat-glossed breasts to sway free just inches away.  You immediately grasp one in your hand and grope it - not too forcefully, just enough to admire her curvy bosom properly.  She flinches at the contact, but when your exploratory thumb caresses the side of her areola, she tilts her head back and sighs.  A single drop of milk escapes her lusty teat onto your finger, and you lift it to your lips to taste.  Creamy, sweet flavor tickles your tongue.  You hum in unexpected delight, how marvellous!' );
		EngineCore.outputText( '\n\nCircling behind the lactating spellcaster, you undress one-handed while you fondle her.  Her perky, hard nipple drips faster and faster as her breast is squeezed and fondled with increasing vigor, your touches spurred on by the burgeoning heat in your ' + CoC.getInstance().player.multiCockDescriptLight() + '.  Discarding your [armor], you kiss her delicate shoulders and neck, lingering at the edge of her jaw before you suckle her earlobe briefly.  She shivers against you but doesn\'t pull away.  In fact, her back arches to press her more firmly against you.  The sorceress practically melts into your arms when you bring your other hand to bear on the other side of her chest.' );
		EngineCore.outputText( '\n\n[EachCock] rises up ' );
		if( CoC.getInstance().player.tallness < 60 ) {
			EngineCore.outputText( 'through her buttcheeks' );
		} else {
			EngineCore.outputText( 'along her arched spine' );
		}
		EngineCore.outputText( ', fully engorged and ready for action.  For now, you\'re content to continue to molest your chosen fuck-toy, dipping a pair of fingers into her ' );
		if( CoC.getInstance().monster.lust > 99 ) {
			EngineCore.outputText( 'well-soaked' );
		} else {
			EngineCore.outputText( 'rapidly-moistening' );
		}
		EngineCore.outputText( ' cunts in order to make sure she\'s prepared.  The witch bites her lip to stifle a lewd moan, so you drag the pads of your fingers across each of her clits simultaneously.  This shatters whatever restraint she was showing into a little more than slick cunt-juice.  Even now, it\'s dripping down her inner thighs.  She\'s properly moaning with your strokes now, and you judge she\'s ready.' );
		//DAT SHIT FITS;
		if( CoC.getInstance().player.smallestCockArea() <= CoC.getInstance().monster.vaginalCapacity() ) {
			var x = CoC.getInstance().player.cockThatFits( CoC.getInstance().monster.vaginalCapacity() );
			var y = CoC.getInstance().player.cockThatFits2( CoC.getInstance().monster.vaginalCapacity() );
			EngineCore.outputText( '\n\nPutting her down on all fours, you admire the curve of her bouncy bottom and the glossy moisture that\'s beading on her numerous, plump cunt-lips.  The witch\'s pussy is tinged red with her feverish lust and totally engorged.  You can see her twin clits peeking out of her their hoods, just begging to be touched.  Who are you to deny them?  Reaching around her hip, you start to circle a finger around one of the lucky buzzers while you get your ' + Descriptors.cockDescript( x ) + ' lined up with one of her cunts' );
			if( y >= 0 ) {
				EngineCore.outputText( ' and your ' + Descriptors.cockDescript( y ) + ' aimed at her other one' );
			}
			EngineCore.outputText( '.  Her knees buckle, but you\'re ready for it, and she slides straight onto your supporting shaft' );
			if( y >= 0 ) {
				EngineCore.outputText( 's' );
			}
			EngineCore.outputText( ', impaling herself to the hilt.' );
			EngineCore.outputText( '\n\n"<i>Oooohhhh...</i>" the sorceress sighs as she settles into place.  You cradle her body in your arms, squeezing her four breasts together, enjoying the warmth of her dribbling milk as her ' );
			if( y < 0 ) {
				EngineCore.outputText( 'pussy clings tight to you' );
			} else {
				EngineCore.outputText( 'pussies cling tightly to you' );
			}
			EngineCore.outputText( '.  Supported entirely by your body, the sand witch\'s muscles go slack (aside from the ones hugging your dick' );
			if( y >= 0 ) {
				EngineCore.outputText( 's' );
			}
			EngineCore.outputText( ').  She\'s breathing nice and heavy as you lift her and swing your hips back, pulling most of your ' + Descriptors.cockDescript( x ) );
			if( y >= 0 ) {
				EngineCore.outputText( ' and ' + Descriptors.cockDescript( y ) );
			}
			EngineCore.outputText( ' out before reversing the motion nigh-instantly, slamming yourself in to the hilt.  The once proud enchantress is reduced to a quivering puddle of fuck by your jackhammering thrusts, so taken by the sensations in her quim' );
			if( y >= 0 ) {
				EngineCore.outputText( 's' );
			}
			EngineCore.outputText( ' that her brains are practically drooling out of her cunts.' );
			EngineCore.outputText( '\n\nYou continue to fuck the pretty, big-breasted sand witch faster and faster, enjoying the way her tits bounce and dribble in your palms, her sisters forced to watch the lascivious way you take her.  They\'re no strangers to lust, and many of them are openly jilling themselves off to the show in between sucking on the closest girl\'s teats.  You take one hand back to your partner\'s mons and press your index and middle fingers onto her clits.  The whimpering sex-puddle in your arms gasps.' );
			EngineCore.outputText( '\n\nCircling her buttons as you plow her, you watch with almost detached curiosity as she creams herself around your ' );
			if( y < 0 ) {
				EngineCore.outputText( Descriptors.cockDescript( x ) );
			} else {
				EngineCore.outputText( 'double dongs' );
			}
			EngineCore.outputText( '.  Waves of rippling contractions sheath you in shimmering, ephemeral ecstasy.  Like something clicking into place in your brain, a biological prerogative asserts itself, unleashing a heat that boils up out of your core like lava from a volcano.  [EachCock] spasms and releases a flow of salty jism.  The witch must feel it, because as soon as your seed makes contact with her juicy cunt' );
			if( y >= 0 ) {
				EngineCore.outputText( 's' );
			}
			EngineCore.outputText( ', her clingy lips seem to tighten around your girth to seal it in.' );
			if( CoC.getInstance().player.cumQ() >= 400 ) {
				EngineCore.outputText( '  That fails to contain the totality of your virile offshoots, and ribbons of the stuff squirt out the sides of her lips.' );
				if( CoC.getInstance().player.cumQ() < 2000 ) {
					EngineCore.outputText( '  You do manage to gift her with a nice little cum-paunch for her efforts, though.' );
				} else {
					EngineCore.outputText( '  You\'re cumming so fast that that venting doesn\'t help her much.  Slowly, her belly begins to bulge outward.  It stretches and wobbles as it fills with spunk, not stopping until she looks months pregnant.  The liquid way that it jiggles with every movement will reveal the contents of her middle to any who dares look at her.' );
				}
			}
			EngineCore.outputText( '\n\nSetting her down in front of her sisters, you let her slide off your ' );
			if( y >= 0 ) {
				EngineCore.outputText( 'twin cocks' );
			} else {
				EngineCore.outputText( Descriptors.cockDescript( x ) );
			}
			EngineCore.outputText( ' onto the floor as an example of just what you\'re capable of.  You can beat the best they have and fuck them into a twitching puddle in the dirt.  Though the mob seems cowed by your display of authority, they\'re still fucking themselves to the sight of what you\'ve done to their sister.  You make the rest of them take turns licking your spent spunk and caked-on cunt-juice from your phallus' );
			if( y >= 0 ) {
				EngineCore.outputText( 'es' );
			}
			EngineCore.outputText( ' before getting dressed and getting back to business.' );
		}
		//Too Big For Fucks;
		else {
			EngineCore.outputText( '\n\nYou spin her around without a single word of warning, gently bearing her to the ground.  She groans in disappointment when your fingers leave her silky slits, but when you climb on top of her, her attitude changes.  Your [cock biggest] drops down onto her chest, nudging aside her four pillowy boobs.  Once you\'re in position, you take her arms and press them down towards her juicy clefts, positioning her forearms on both sides of her busts so that her soft flesh is cushioned and squeezed around your length.  Of course, the extra pressure releases four trickles of milk that dribble onto your [cock biggest] from all sides and turn the witch\'s chest into a four-piece cock-sleeve for your dick to traverse.' );
			EngineCore.outputText( '\n\nThe pretty girl goes knuckle-deep in her multiple vaginas.  Parting in a wordless sigh of pleasure, her lips slowly open, just in time to receive your cock when you make your first thrust.  Your [cockHead biggest] butts past those very same lips, pushing just far enough to bump her teeth before you saw your [hips] back for the next push.  The blonde\'s legs twitch whenever she hits a particularly sensitive spot.  Grabbing hold of her leaky teats, you start to fuck her quartette of jiggly breasts faster and faster, watching the big boobs jiggle from the fierce tit-fucking you\'re dishing out, twisting the nipples slightly until she whimpers and groans, all four of her udders fountaining milk.' );
			EngineCore.outputText( '\n\nThe splattering boob geysers provide even more lubrication for your furious tit-fucking.  You groan as the hot moisture wicks into your skin and hers alike, revelling in the hot, wet, sloppy tit-fuck.  Dripping with pre-cum, your [cockHead biggest] smashes into her pursed lips again and again, and the witch seems to love it, because she has her tongue swirl in circles around you every time you get within range of her gasping, moaning lips.  The simmering warmth just behind your package incites you to go faster and faster.  You move so quickly that you\'ve broken out in a fresh sheen of sweat, and the heat grows hotter, accompanied by a telltale clenching a surging heat that indicate you\'re about to crest over the edge of orgasm and cum this girl\'s pretty face white.' );
			EngineCore.outputText( '\n\nMoaning and leaning up, the masturbating witch gratefully takes as much of your [cock biggest] in to her mouth as she can.  It\'s just in time for her to taste the first ejaculation for a split-second before ' );
			if( CoC.getInstance().player.cumQ() >= 500 ) {
				EngineCore.outputText( 'struggling to swallow it' );
			} else {
				EngineCore.outputText( 'swallowing it' );
			}
			EngineCore.outputText( '.  She squeezes her arms together, which pushes her boobs tighter around your orgasmically pulsating length.  It feels so good that it feels like a whole new orgasm kicks off in your [balls], even though you\'ve already started to cum!  ' );
			if( CoC.getInstance().player.cumQ() < 250 ) {
				EngineCore.outputText( 'The cute woman swallows every single drop.  She even gives up a satisfied moan when she finishes.' );
			} else if( CoC.getInstance().player.cumQ() < 1000 ) {
				EngineCore.outputText( 'The cute woman\'s cheeks balloon as she tries to contain it all.  She swallows admirably in spite of your heavy jizz-flow, only losing a few white trickles out the corners of her stretched mouth.' );
			} else {
				EngineCore.outputText( 'The cute woman\'s cheeks flood with your obscene cum-flow.  She tries to swallow it down, but no matter how fast her fevered gulps are, the stuff still floods in with such force that it squirts from the corners of her mouth.  She just gives up after a few moments and lets it run down her chin in a waterfall.  Most of the jism puddles on the floor below her, soaking into her ponytail and matting it with salty spunk.' );
			}

			EngineCore.outputText( '\n\nFinishing up, you pull yourself out of her tits wipe up with her robes, tossing the musky robes on her face as she begins to sluttily keen in an orgasm of her own.  Now to explore the rest of this desert rat cellar.' );
		}
		CoC.getInstance().player.orgasm();
		EngineCore.dynStats( 'sen', -1 );
		Combat.cleanupAfterCombat();
	};
	//*Sapphic Win Sex;
	//Forced cunnlingus, rimjob, and clit-and-nipple sucking.;
	DungeonSandWitch.prototype.forceCunnilingusRimjobClitAndNipple = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'You eye the defeated mob' );
		if( CoC.getInstance().player.HP < 1 ) {
			EngineCore.outputText( ' through their torn-up robes, noting many large, dripping breasts and more than a few pairs of supple cunt-lips' );
		} else {
			EngineCore.outputText( ' through their squirming, orgiastic motions, noting their many large, dripping breasts and gushing multi-cunts' );
		}
		EngineCore.outputText( '.  They may ' );
		if( CoC.getInstance().player.cor < 33 ) {
			EngineCore.outputText( 'be misguided in fighting you' );
		} else if( CoC.getInstance().player.cor < 66 ) {
			EngineCore.outputText( 'be a little over-zealous in defending their home' );
		} else {
			EngineCore.outputText( 'be crappy fighters' );
		}
		EngineCore.outputText( ', but feeling a stirring in your nethers, you can think of at least one good use for them.  You start to strip out of your [armor], groping your butt with one hand; maybe there\'s a second purpose they can serve...' );
		EngineCore.outputText( '\n\n"<i>Oi, milk bitches!  Get over here!</i>" you call.  The defeated women morosely respond, though there\'s more than one gaze simmering with lust as it takes in your nude form.  You ' );
		if( CoC.getInstance().player.isNaga() ) {
			EngineCore.outputText( 'slither' );
		} else if( CoC.getInstance().player.isTaur() ) {
			EngineCore.outputText( 'clop' );
		} else if( CoC.getInstance().player.isGoo() ) {
			EngineCore.outputText( 'ooze' );
		} else if( CoC.getInstance().player.isDrider() ) {
			EngineCore.outputText( 'clatter' );
		} else {
			EngineCore.outputText( 'stride' );
		}
		EngineCore.outputText( ' up to the nearest one and grab her amber tresses in your hand, pulling her face into your [vagina], her nose squishing partway into your cleft as you grind on her pretty, young mouth.  Oh, that\'s the stuff.  Her tongue flutters out almost immediately to lap at your moisture.  You\'d swear she absolutely loved it if it wasn\'t for the angry cast of her eyebrows.  No matter.' );
		EngineCore.outputText( '\n\nLike the director of a play, you begin to direct the rest of the girls.  First, you want this bitch to enjoy herself like a proper sapphic slave, so you command two of her sisters to eat her out.  They seem reluctant, but they dig into the moist quims all the same.  Oh gods, the difference is night and day.  The tanned sorceress\'s eyes drift closed, lulled into complacency by the lapping licks her sisters are giving her.  Boldly stroking across your folds, her tongue is eagerly attending to your needs, stirring your body to secrete more of your sticky love-juice, a treat she consumes with gusto.  You pat her head as she settles into a rhythm and try your best to focus on standing upright.' );
		EngineCore.outputText( '\n\nThere\'s still quite a few of them left, so you spread them around in similar fashion - two mouths per witch crotch in an ever-widening pyramid of cunnilingual ecstasy.  You save the lustiest of the pack for last; they\'re turned on enough to savage their own aching boxes with their fingers while they munch on clam, no stimulation necessary.  Two of them make the twat-centric pyramid look off-balance, so you call them back to you.' );
		EngineCore.outputText( '\n\nThe shortest one is going to get the most humiliating job today.  Putting your hands on your [butt], you pull your cheeks apart and command, "<i>Lick it.</i>"' );
		EngineCore.outputText( '\n\nShuddering, the witch plaintively asks, "<i>Do I have to?</i>"' );
		EngineCore.outputText( '\n\n"<i>Yes.</i>"' );
		EngineCore.outputText( '\n\nDropping to her knees, the tanned milk-dispenser slowly extends her tongue towards your [asshole], her four tits smushing up against the back of your [legs] as you shudder in anticipation.  Contact.  You lean on the slit-licker in front of you for support when you nearly collapse, moaning in delight at the feeling of her warm oral organ tickling your nerves as it slithers over your butthole.  Yes, that\'s nice...  You slowly undulate your [hips] back and forth as your holes are licked and lapped exquisitely.  The heat in your loins is growing hotter, and you know just what you need to cool down the roaring, vaginal fire.' );
		EngineCore.outputText( '\n\nGrabbing the taller of the two, you pull her down towards your [clit], hedonistically chasing the seemingly unquenchable lust within.  ' );
		//Normal/biggish clit;
		if( CoC.getInstance().player.clitLength < 3 ) {
			EngineCore.outputText( 'She slurps it right into her mouth with aplomb.  Dancing across the incredibly sensitive surface of your feminine organ, her salacious salivations have an extraordinary level of skill behind them.  You\'d be surprised if this was her first time engaging in such an act.  The way she\'s slobbering at you is making her spit froth, and you smile when her lips meet her quim-bound sisters.  They exchange a happy slurp and muffled moan, half on your [vagina] and half on the other\'s mouth before returning to their respective tasks.  A pleased hum shivers through your most tender place, and you realize that you\'re going to cream yourself all over these exotic women.' );
		}
		//cock-sized clitty;
		else if( CoC.getInstance().player.clitLength < 12 ) {
			EngineCore.outputText( 'She slurps it right into her mouth with aplomb, even though it\'s big and thick enough to give most male\'s cocks a run for their money.  The way that she salaciously salivates across the surface of your none-too-feminine female organ hints at some practice with someone a little less than female, but you doubt any of these ladies could have given her such training.  Taking it all the way to your cooch, she lets her lips meet her quim-bound sister\'s, and they share a tender kiss whilst half-engaged with your anatomy.  The pleased hums vibrate all the way through your swollen she-cock, making you realize that you\'re going to cream yourself all over these exotic women.' );
		}
		//big ol clitty;
		else {
			EngineCore.outputText( 'She dives down onto it as best she can, even though it\'s a gigantic, throbbing button so large that most men would be shamed to lay eyes on it.  The way she\'s salaciously salavating over your \'crown\' indicates she\'s no stranger to sucking cocks, but you\'re sure she couldn\'t have gotten such practice with these other sluts.  Regardless, she plunges down on your sensitive clit-cock, taking as much of the immense nerve-bundle into her mouth as she can.  Her head bobs tenderly along the length while her hand pumps it fast enough to make her drooling spit froth.  Idly, you realize that you\'re going to cream yourself all over her and her sister.' );
		}

		EngineCore.outputText( '\n\nA thunderclap of cunt-squeezing pleasure explodes through your body from head to [feet], forcing your [hips] to jackhammer against one witch\'s face.  The girl at your [butt] stays determinately attached to your [asshole] as you cum' );
		if( CoC.getInstance().player.wetness() >= 4 ) {
			EngineCore.outputText( ', spraying your musky girl-goo across the pretty faces at your groin, soaking them all the way to their first rows of tits.  Your juices mix with the milk dripping from their nipples into a sticky alabaster treat that makes you lick your lips and shudder in delight. The seductress on your [vagina] gurgles and sighs as she tries to keep up with your copious lady-spunk, but the way you squirt, she seems doomed to failure.' );
		} else if( CoC.getInstance().player.wetness() >= 2 ) {
			EngineCore.outputText( ', sluicing secretions down the lips of your would-be pussy-slave, forcing her to work her throat in order to try and keep up with it.  You\'re so goddamned wet, and the way your channel is clenching and undulating around her tongue just forces out more of your juice.' );
		} else {
			EngineCore.outputText( ', dribbling your slippery girl-cum straight into your would-be pussy-slave, forcing her to swallow your tangy flavor.  It\'s hard not to turn into a dripping mess with the way her tongue works your spasming pussy, but neither of you seems to mind.' );
		}
		if( CoC.getInstance().player.hasCock() ) {
			EngineCore.outputText( '  Above, [eachCock] fires lances of proper, virile spunk onto the girls\' exposed backs to properly mark them.' );
			if( CoC.getInstance().player.cumQ() >= 500 ) {
				EngineCore.outputText( '  It turns their bronzed skin into a soupy white, then dangles to the ground in thick ropes' );
				if( CoC.getInstance().player.cumQ() >= 1500 ) {
					EngineCore.outputText( ', each of which begins pooling into a puddle' );
				}
				if( CoC.getInstance().player.cumQ() >= 2500 ) {
					EngineCore.outputText( '.  Those puddles combine to form a lake of jism beneath these lusty slaves bodies, putting their combined milky tits to shame' );
				}
				EngineCore.outputText( '.' );
			}
		}
		EngineCore.outputText( '\n\nYou flop onto your back, pulling the closest bronzed bodies down with you.  This sets off a domino effect of collapsing witches, all of them falling as the wet honey-pots that they had been leaning into are rudely yanked away.  Lips find your [nipples], and you let them' );
		if( CoC.getInstance().player.lactationQ() >= 200 ) {
			EngineCore.outputText( ' drink their fill' );
		}
		if( CoC.getInstance().player.lactationQ() >= 1000 ) {
			EngineCore.outputText( ', or at least as much as they can handle of your lactic capacity,' );
		} else if( CoC.getInstance().player.lactationQ() < 200 ) {
			EngineCore.outputText( ' slowly suckle you' );
		}
		EngineCore.outputText( ' while you come down from your high.  Why couldn\'t they have just done this to start?' );
		EngineCore.outputText( '\n\nAfter that morale boost, you climb out of the writhing orgy of fem-flesh and dust yourself off, ready to explore further inside this den of inequity.' );
		CoC.getInstance().player.orgasm();
		EngineCore.dynStats( 'sen', -1 );
		Combat.cleanupAfterCombat();
	};
	//Sand Witch Mob Attacks:;
	//Swarm;
	//-Mob gangrushes the PC; multiple hits, light damage;
	DungeonSandWitch.prototype.gangrush = function() {
		EngineCore.outputText( 'The witches close ranks and advance with raised fists, intent on beating you into submission!\n' );
		//3-5 attacks.at half strength;
		CoC.getInstance().monster.str -= 10;
		CoC.getInstance().monster.createStatusAffect( StatusAffects.Attacks, 2 + Utils.rand( 3 ), 0, 0, 0 );
		CoC.getInstance().monster.eAttack();
		CoC.getInstance().monster.str += 10;
	};
	//Headbutt;
	//Single, high damage attack;
	//High hit chance;
	DungeonSandWitch.prototype.headbuttABitch = function() {
		EngineCore.outputText( 'The crowd parts, and a stockier, sturdier sorceress ambles out, fists up and head cocked back.  She makes to punch at you before pulling her fist at the last second, snapping her head forward in a powerful headbutt!  You barely have time to react!' );
		var damage = Math.round( (CoC.getInstance().monster.str + CoC.getInstance().monster.weaponAttack + 10) - Utils.rand( CoC.getInstance().player.tou ) - CoC.getInstance().player.armorDef );
		//Dodge;
		if( Combat.combatMiss() || Combat.combatEvade() || Combat.combatFlexibility() || Combat.combatMisdirect() ) {
			EngineCore.outputText( '\nThrowing yourself out of the way, you manage to avoid the hit.  Your foe doesn\'t seem nearly as pleased while she fades back in between her sisters.' );
		}
		//Block;
		else if( damage <= 0 ) {
			EngineCore.outputText( '\nYou catch the hit on your forearm, stopping her cold.  The thuggish woman snarls as she fades back in between her sisters, disappointed at doing so little damage.' );
		}
		//Hit;
		else {
			damage = Combat.takeDamage( damage );
			EngineCore.outputText( '\nShe hits you square in the face, bloodying your face and sending you stumbling back in agony. (' + damage + ')' );
		}
		Combat.combatRoundOver();
	};
	//Sand Stones;
	//-Mob summons vibrating sands sands to  lust increase PCs lust;
	//- Lust gained each round they use it is determined by how many naughty bits a PC has.;
	//-For every dick, set of breast(nips?), cunts and ass-hole on a PC, the lust gain is increased by 3, Not accounting for lust resistance.;
	//-Goo bodies will gain 30 Lust by default, not accounting lust resistance.;
	//-Stones will randomly vibrate throughout the battle if they get the PC.;
	DungeonSandWitch.prototype.sandstonesAreCool = function() {
		EngineCore.outputText( 'The sandstorm whirling around the room suddenly ceases, and all the tiny sand particles gather together into balls, growing into several smooth stones.  Then, all the sand stones fall to the ground and slither towards you.' );
		var bonus = 0;
		//[If they attack lands];
		if( !Combat.combatMiss() && !Combat.combatEvade() && !Combat.combatFlexibility() && !Combat.combatMisdirect() ) {
			//[IF PC has solid body];
			if( !CoC.getInstance().player.isGoo() ) {
				EngineCore.outputText( '\n\nThey crawl up your [legs].  You try to swat them all off, but there are too many.' );
				//If PC has 1 cock:;
				if( CoC.getInstance().player.cockTotal() === 1 ) {
					EngineCore.outputText( '  A stone crawls onto your [cock].' );
				}
				//[If PC has multi-cocks: ;
				if( CoC.getInstance().player.cockTotal() > 1 ) {
					EngineCore.outputText( '  A bunch of the stones crawl onto your ' + CoC.getInstance().player.multiCockDescriptLight() + '.' );
				}
				if( CoC.getInstance().player.hasCock() ) {
					bonus++;
				}
				//[If PC has cunt];
				if( CoC.getInstance().player.hasVagina() ) {
					EngineCore.outputText( '  One stone slides up your inner thigh' );
					if( CoC.getInstance().player.balls > 0 ) {
						EngineCore.outputText( ' behind your [sack]' );
					}
					EngineCore.outputText( ' and pops itself right into your [vagina]' );
					if( CoC.getInstance().player.hasVirginVagina() ) {
						EngineCore.outputText( ', robbing you of your virginity as a trickle of blood runs down your [leg].' );
					}
					bonus++;
				}
				//[If PC has balls:;
				if( CoC.getInstance().player.balls > 0 ) {
					EngineCore.outputText( '  A small set of stones settle on your [balls].' );
					bonus++;
				}
				EngineCore.outputText( '  ' + Utils.num2Text( CoC.getInstance().player.totalNipples() ) + ' crawl up to your chest and over your top ' + Descriptors.nippleDescript( 0 ) + 's' );
				if( CoC.getInstance().player.bRows() > 1 ) {
					if( CoC.getInstance().player.bRows() === 2 ) {
						EngineCore.outputText( ' and' );
					} else {
						EngineCore.outputText( ',' );
					}
					EngineCore.outputText( ' your middle ' + Descriptors.nippleDescript( 1 ) + 's' );
					bonus++;
				}
				if( CoC.getInstance().player.bRows() > 2 ) {
					EngineCore.outputText( ', and your bottom ' + Descriptors.nippleDescript( 2 ) + 's' );
					bonus++;
				}
				EngineCore.outputText( '.' );
				EngineCore.outputText( '  The last stone travels up the back of your [legs] and slides right into your [asshole].' );
				EngineCore.outputText( '\n\nYou try to get the stones off and out of you, but some kind of magic is keeping them stuck to you like glue.  One sand-witch snaps her fingers, and all the of the smooth stones begin vibrating, making numbing waves of pleasure that rattle your body.  <b>You have to end this quick, or else!</b>' );
			}
			//[IF PC has goo body];
			else {
				EngineCore.outputText( '\n\nThe stones launch themselves into your gooey body.  You try your best to dislodge these foreign objects from your insides, but some-kind of magic is holding them in place.  A sand-witch snaps her fingers and all the stones begin vibrating, sending ripples throughout your sentative gooey body.  It feels like your whole body is one, big pleasure-bomb right now.  You had better end this fight soon!' );
				bonus = 5;
			}
			CoC.getInstance().player.createStatusAffect( StatusAffects.LustStones, bonus, 0, 0, 0 );
			EngineCore.dynStats( 'lus', bonus * 2 + 5 + CoC.getInstance().player.sens / 7 );
		}
		//[If attack misses];
		else {
			EngineCore.outputText( '\nThe stones then make a ninety degree turn into the purple fire, and then nothing.  One sand-witch smacks another upside the head, yelling something about focusing.' );
		}
		CoC.getInstance().monster.removeStatusAffect( StatusAffects.Sandstorm );
		Combat.combatRoundOver();
	};
	//Milk is Good;
	//-Mob's members start sucking on each other's tits. Arouses PC and restores health to mob, decreases (increases?) mob's lust.;
	DungeonSandWitch.prototype.drankSomeMialk = function() {
		EngineCore.outputText( 'One of the blonde beauties turns to another and asks, "<i>A drink, sister?  Fighting this intruder has given me a powerful thirst.</i>"  The other woman wordlessly opens her robe, baring her breasts, exposing four heaving, milk-fueled mounds to the air before the other woman claims a nipple for herself.  Three others crowd in on the exposed teats, their rumps shaking contentedly as they grab a quick snack.' );
		EngineCore.outputText( '\n\nAfter wiping the excess from their lips, they close their robes and resume a fighting stance, seeming healthier than before.' );
		EngineCore.dynStats( 'lus', 4 + CoC.getInstance().player.lib / 10 );
		//+ 30 HP, +light lust damage to PC and mob;
		CoC.getInstance().monster.addHP( 30 );
		Combat.combatRoundOver();
	};
	//*Sandstorm;
	//Creates a sandstorm that blinds the PC one out of every 3 rounds.  Used first turn. Deals light HP damage every turn.  Reduces breath attacks damage by 80%.  Makes bow miss 50% of the time.;
	DungeonSandWitch.prototype.sandStormAttack = function() {
		if( CoC.getInstance().monster.short === 'sand witches' ) {
			EngineCore.outputText( 'The witches link their hands together and begin to chant together, lifting their voices high as loose sand trickles in from every corner, every doorway, even the ceiling.  "<i>Enevretni llahs tresed eht!</i>"  Swirling around the chamber, a cloud of biting, stinging sand clouds your vision and bites into your skin.  It\'s going to keep blinding you and hurting you every round!' );
		} else {
			EngineCore.outputText( 'With a smirk, the Sand Mother decrees, "<i>You fight not just me, but the shifting sands as well.</i>"  She casually flicks her wrist, and sand rises up from the floors, the walls, everywhere really.  It begins to spin about, blown by an unseen wind, and the entire chamber is wreathed in a shifting sandstorm.  The grit constantly tries to get into your eyes.  It\'s likely you\'re going to be blinded by it every now and then.' );
		}
		CoC.getInstance().monster.createStatusAffect( StatusAffects.Sandstorm, 0, 0, 0, 0 );
		Combat.combatRoundOver();
	};
	DungeonSandWitch.prototype.sandWitchMobAI = function() {
		if( CoC.getInstance().monster.findStatusAffect( StatusAffects.Sandstorm ) < 0 ) {
			this.sandStormAttack();
		} else if( CoC.getInstance().monster.HPRatio() < 0.5 ) {
			this.drankSomeMialk();
		} else if( CoC.getInstance().monster.findStatusAffect( StatusAffects.Sandstorm ) >= 0 && Utils.rand( 2 ) === 0 && CoC.getInstance().player.findStatusAffect( StatusAffects.LustStones ) < 0 ) {
			this.sandstonesAreCool();
		} else if( Utils.rand( 3 ) === 0 ) {
			this.headbuttABitch();
		} else {
			this.gangrush();
		}
	};
	DungeonSandWitch.prototype.cumWitchAI = function() {
		//Hurt!;
		if( CoC.getInstance().monster.HPRatio() < 0.6 ) {
			this.sandWitchCuntHeals();
			return;
		}
		var choices = [];
		//Dicks only;
		if( CoC.getInstance().player.hasCock() ) {
			choices[ choices.length ] = this.cumMagicAttack;
		}
		choices[ choices.length ] = this.bukkakeAttack;
		choices[ choices.length ] = this.cocknosisAttack;
		if( CoC.getInstance().monster.findStatusAffect( StatusAffects.Shell ) < 0 ) {
			choices[ choices.length ] = this.shellDefense;
			choices[ choices.length ] = this.shellDefense;
			choices[ choices.length ] = this.shellDefense;
		}
		//HERMS;
		if( CoC.getInstance().player.gender === 3 ) {
			choices[ choices.length ] = this.genderConfusionAttack;
		}
		//VAGOOZLES;
		if( CoC.getInstance().player.hasVagina() ) {
			choices[ choices.length ] = this.cumHungerAttack;
		}
		choices[ Utils.rand( choices.length ) ]();
	};

	//*Attack: Bukkake;
	DungeonSandWitch.prototype.bukkakeAttack = function() {
		//*Cum Witch hikes up her dress and bukkake's at PC.  Large # of chance for 'hits' for low individual damage.  Small reduction to sand witch lust.  Used more at high lust.;
		EngineCore.outputText( 'The Cum Witch moans and daintily peels her robes away from her swollen cock-flesh.  A bubble of precum pops wetly from her urethra to splatter on the floor as her balls suddenly swell.  You look back up in time to see the telltale glow of magic surrounding her staff, but then she\'s thrusting her hips at you, lewdly humping the air as she unleashes rope after thick rope of potent jism in your direction!\n' );
		var hits = 5 + Utils.rand( 8 );
		var bonus = 0;
		var damage = 0;
		while( hits > 0 ) {
			if( Combat.combatMiss() || Combat.combatMisdirect() ) {
				//Miss1;
				if( Utils.rand( 3 ) === 0 ) {
					EngineCore.outputText( '\nA glob of her goo goes wide, over your shoulder!' );
				} else if( Utils.rand( 2 ) === 0 ) {
					EngineCore.outputText( '\nOne wave of alabaster falls short, to splatter at your [feet].' );
				} else {
					EngineCore.outputText( '\nSome of the Cum Witch\'s cum nearly hits you, but you manage to step aside.' );
				}
			}
			//Evade;
			else if( Combat.combatEvade() ) {
				EngineCore.outputText( '\nYou roll away from some of the hermaphrodite spunk, easily evading it.' );
			}//Misdirect;
			else if( Combat.combatMisdirect() ) {
				EngineCore.outputText( '\nYou feint one direction and then move another, misdirecting like a pro and avoiding some of the sexual artillery.' );
			}//Flexibility;
			else if( Combat.combatFlexibility() ) {
				EngineCore.outputText( '\nYou twist aside, making the most of your cat-like reflexes to avoid some of the stuff.' );
			} else {
				var temp = Utils.rand( 5 );
				//Hit1;
				if( temp === 0 ) {
					EngineCore.outputText( '\nA mass of jizz splatters into your [hair], soaking it with thick, salty goo.' );
				} else if( temp === 1 ) {
					EngineCore.outputText( '\nOne jet of thick witch-cum hits you in the [chest] before you can react.  You can feel it getting inside your [armor], squishing and sliding over your [nipples] as you try to fight.' );
				} else if( temp === 2 ) {
					EngineCore.outputText( '\nSome of the stuff spatters off your arm and soaks your hand, making it a slimy mess.' );
				} else if( temp === 3 ) {
					EngineCore.outputText( '\nA creamy deluge hits your [legs], though rather than running down, it seems to come up, flowing into your [armor] to squish wetly across your sensitive groin.' );
				} else {
					EngineCore.outputText( '\nSpunk nearly blinds you as the Cum Witch\'s virile fluids take you in the face.  You spit some of it out, the smell of the stuff making your head swim.' );
					//bonus damage!;
					bonus = 3;
				}
				damage += 2;
			}
			hits--;
		}
		EngineCore.dynStats( 'lus', damage + bonus );
		Combat.combatRoundOver();
	};
	//*Attack: Cum Magic;
	DungeonSandWitch.prototype.cumMagicAttack = function() {
		//*Used on males only, casts spell that causes balls to temporarily swell and increase lust by a moderate amount.  Unavoidable.;
		EngineCore.outputText( 'Gesticulating with her free hand, the Cum Witch utters impossible to pronounce words before closing her fingers tightly into a fist.  That same instant, you feel an onset of warmth in your [balls], a spreading heat that makes you tremble with growing lust.  A second later, [eachCock] is throbbing, and a runner of cum trickles from the [cockHead], a hint of your temporarily-enhanced virility.' );
		//(15-30 lust, based on libido);
		EngineCore.dynStats( 'lus', 5 + CoC.getInstance().player.lib / 12 );
		CoC.getInstance().player.hoursSinceCum += 100;
		Combat.combatRoundOver();
	};
	//*Attack: Cum Hunger;
	//*Used on vagoozles, spell that causes womb to literally thirst for sperm.  Unavoidable moderate lust gain.  Pregnant character's are immune.;
	DungeonSandWitch.prototype.cumHungerAttack = function() {
		EngineCore.outputText( 'Moaning luridly, the Cum Witch swivels her staff and opens her hand to spread her fingers wide.  At the same time, you feel her magic slam into your midsection, burrowing into your womb.  ' );
		if( CoC.getInstance().player.pregnancyIncubation > 0 ) {
			EngineCore.outputText( 'Yet, whatever she tries to do fails, as her otherworldly conjuration falls apart as soon as soon as it reaches you.' );
			Combat.combatRoundOver();
			return;
		}
		EngineCore.outputText( 'It worms around your uterus, tickling it faintly before gently kneading your ovaries.  Your [legs] go weak as your womb throbs, hungering for something to fill it.  A trickle of wetness squirts from your [vagina] as the magic fades, and you squirm as your lust rises. If only something would make you pregnant!  Your eyes dart unbidden to the Witch\'s groin before you yank them away.' );
		EngineCore.dynStats( 'lus', 5 + CoC.getInstance().player.lib / 12 );
		Combat.combatRoundOver();
	};
	//*Attack: Gender Confusion;
	DungeonSandWitch.prototype.genderConfusionAttack = function() {
		//*Used on genderless and hermaphrodite characters.  Mental attack that draws on disharmony with standard gender types to stun for one round.  3 turn cooldown;
		EngineCore.outputText( 'Touching her alabaster staff to her brow, just under the brim of her hat, the Cum Witch makes a brief incantation and fixes you with her gaze.  Her eyes flash blindingly white, and then you feel her inside you, rifling through your memories, digging up memories of your childhood, your past, and throwing them against you.  ' );
		if( CoC.getInstance().player.inte / 5 + Utils.rand( 20 ) + CoC.getInstance().player.level / 2 < 18 ) {
			EngineCore.outputText( 'She batters your consciousness with conflicting memories of your gender, utterly dazing you.  How can you fight when you can barely tell who you are anymore?' );
			CoC.getInstance().player.createStatusAffect( StatusAffects.Confusion, 0, 0, 0, 0 );
		} else {
			EngineCore.outputText( 'You parse the flood of information with mental focus and expel the intruder from your mind with a clenching of your sizable intellect.' );
		}
		Combat.combatRoundOver();
	};
	//*Attack: Shell;
	DungeonSandWitch.prototype.shellDefense = function() {
		//*Grants immunity to all magic-based attacks for the next two turns.;
		EngineCore.outputText( 'The Cum Witch holds her staff in both hands and rotates it in a circle, chanting all the while.  Her voice rises in pitch and intensity until she\'s screaming out unwords of power.  With one final cry, she slams her staff down into the ground hard enough to kick up a puff of sandy dust.  It quickly settles, but the Cum Witch has some kind of glittering, reflective shield around herself now!' );
		CoC.getInstance().monster.createStatusAffect( StatusAffects.Shell, 3, 0, 0, 0 );
		Combat.combatRoundOver();
	};
	//*Attack: Cocknosis;
	//*Intelligence dependant attack with possibility of very high lust gain.;
	DungeonSandWitch.prototype.cocknosisAttack = function() {
		EngineCore.outputText( 'Lifting her robes enticingly, the Cum Witch reveals her ' );
		if( CoC.getInstance().monster.lust < 50 ) {
			EngineCore.outputText( 'half-hard' );
		} else if( CoC.getInstance().monster.lust < 70 ) {
			EngineCore.outputText( 'hard' );
		} else if( CoC.getInstance().monster.lust < 85 ) {
			EngineCore.outputText( 'throbbing' );
		} else {
			EngineCore.outputText( 'hard, dripping' );
		}
		EngineCore.outputText( ' cock.  She gently begins to sway her hips, bouncing back and forth with near-mechanical precision, her softly bobbing cock catching your eyes with its metronome-like precision.  She softly begins to speak, enunciating each word to the time and tune of her movements.' );
		EngineCore.outputText( '\n\n"<i>See my cock?  See the glistening thickness of it?  Watch how it sways and bobs for you, moving with such smooth and easy grace.  Can you feel your eyes following it, locking onto it and never letting go?</i>"\n\n' );
		if( CoC.getInstance().player.inte / 20 + Utils.rand( 20 ) >= 13 ) {
			EngineCore.outputText( 'You chuckle at her crude attempt to hypnotize you with her member.  She stomps her foot in irritation and drops her robes back into place.' );
		} else {
			EngineCore.outputText( 'The Witch smirks, though you\'re too focused on her cock to see, and she continues, "<i>Good ' + CoC.getInstance().player.mf( 'boy', 'girl' ) + '.  Watch it sway.  You\'re so focused on my cock now that the world is just falling away around it, sinking into nothingness, leaving only that wonderful cock behind for you to watch.  And since it\'s filling your view, you can feel it filling your mind as well, can\'t you?</i>"' );
			EngineCore.outputText( '\n\nYou nod, your view rigidly attached to her equally rigid tool as you utterly and completely fixate on her penis, admiring its curves, its thickness, and the way it seems to pulsate happily for you whenever you look at it just right.  The Witch keeps talking, but it\'s her dick that\'s important.  You start to drool as your ' + CoC.getInstance().player.skin() + ' flushes and your body heats.  Gods, her cock is gorgeous.  Reaching down, you begin to masturbate without thinking.  You don\'t know why, but it just feels like the right thing to do.' );
			EngineCore.dynStats( 'lus', 20 );
			if( CoC.getInstance().player.lust <= 99 ) {
				EngineCore.outputText( '\n\nYou bump against something, startling yourself out of the cocknosis before you can completely fall for it.  Still, you keep seeing her dick every time you close your eyes, and your body is very turned on from how you were touching yourself.' );
			} else {
				EngineCore.outputText( '\n\nYou play with yourself until you\'re on the very edge of orgasm.  At that moment, a loud *SNAP* startles you back to wakefulness, and as you look down at the cock bobbing just a few inches away, you realize it\'s hopeless.  You can\'t fight this.' );
			}
			EngineCore.outputText( '\n\nThe witch smiles knowingly.' );
		}
		Combat.combatRoundOver();
	};
	//*Attack: Heal;
	//*Restores one third of her HP.;
	DungeonSandWitch.prototype.sandWitchCuntHeals = function() {
		EngineCore.outputText( 'The Witch smirks at you and holds her free hand under her robes.  When she pulls it out, you realize she\'s gathered a handful of her cum.  She holds it up and exhales over it, the air making a slight whistle as it blows through her parted lips.  The ebony sorceress then smears the goop over her wounds, which seem to drink in the cum and vanish before your eyes.  She scolds, "<i>Physical damage?  How artless.</i>"' );
		CoC.getInstance().monster.addHP( CoC.getInstance().monster.eMaxHP() * 0.33 );
		Combat.combatRoundOver();
	};

	//*PC Loss - Female - Become Sand Witch;
	DungeonSandWitch.prototype.turnIntoASammitch = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'Helplessly, you ' );
		if( CoC.getInstance().player.lust > 99 ) {
			if( CoC.getInstance().player.hasVagina() ) {
				EngineCore.outputText( 'dig your hands into your loins, frigging your hungry cunt so hard your juices splatter the Witch\'s robe.' );
			} else {
				EngineCore.outputText( 'dig your finger into your [asshole], frigging it like your life depended on it.' );
			}
		} else {
			EngineCore.outputText( 'try to rise, but all you manage to do is slip back down to the ground.' );
		}
		EngineCore.outputText( '  The Cum Sorceress smiles and releases her staff.  Instead of clattering to the ground, it dematerializes a piece at a time, fading away in a way that would be mesmerizing were you not otherwise occupied.  She hikes her robes up and pulls off her hat with them, shaking her surprisingly light, blonde hair free.  "<i>Now, all that got me pretty worked up, and I don\'t think the girls will mind if I give you your first sampling of cum witchery.  What do you think, hun?</i>" she asks, glancing back towards the comatose witch behind her.' );
		EngineCore.outputText( '\n\n"<i>i\'z fine...</i>" a quiet voice draws, barely loud enough to be heard.' );
		EngineCore.outputText( '\n\nYour captor flashes you a smile and giggles, "<i>See?  I told you they wouldn\'t mind.  Now, ' );
		if( CoC.getInstance().player.pregnancyType === 0 ) {
			EngineCore.outputText( 'let\'s go ahead and get your first daughter inside you, shall we?' );
		} else {
			EngineCore.outputText( 'let\'s go ahead and have some fun, shall we?  We\'ll have to wait until you pop out whatever\'s in your womb before I give you your first witch child.' );
		}
		EngineCore.outputText( '  There will be plenty of time to make you one of us while we\'re waiting.</i>"' );
		if( !CoC.getInstance().player.hasVagina() ) {
			EngineCore.outputText( '\n\nShe gestures towards you and releases a flow of salmon-hued light in your direction.  As soon as it touches you, you moan out loud and begin to lift your [hips] into the air, humping against an unseen but clearly felt pressure on your loins.  A slowly spreading, vertical slit opens there, glistening with moisture as it parts to reveal a fresh clit.  <b>You\'ve grown a cunt!</b>' );
			CoC.getInstance().player.createVagina();
			CoC.getInstance().player.clitLength = 0.25;
		}
		EngineCore.outputText( '\n\nThe dark-skinned futanari strokes' );
		if( CoC.getInstance().monster.lust < 65 ) {
			EngineCore.outputText( ' herself to full hardness, smiling when thick strings of cum begin to drizzle from her swollen cock-tip.' );
		} else if( CoC.getInstance().monster.lust < 85 ) {
			EngineCore.outputText( ' herself until cum begins to drizzle from her swollen cock-tip.' );
		} else {
			EngineCore.outputText( ' herself, gathering up the constantly-dripping cum and smearing it all over her shaft.' );
		}

		EngineCore.outputText( '\n\nHer tongue licks her lips in anticipation as she readies herself, though she stops a moment later when she sees you still have a bit of fight in your eyes' );
		if( CoC.getInstance().player.lust > 99 ) {
			EngineCore.outputText( ', even though your hand is knuckle-deep in your twat' );
		}
		EngineCore.outputText( '.' );
		EngineCore.outputText( '\n\nKneeling before your helpless form, the mysterious witch sighs and whispers, "<i>Why can\'t you just accept it?  You belong with us.  We\'re going to fix this desert - and Mareth.  The demons can\'t stop us.  The monsters won\'t stop us.  They CAN\'T.</i>"  She gently brushes her hand through your hair, smearing you with her sex-juices unthinkingly as she prattles on, "<i>Just relax, babe.  Here, maybe this will help.</i>"  The Witch\'s hands are suddenly holding you by your ears and her lips are moving in nonsensical ways.  Whatever she\'s saying you can\'t hear it with how she\'s holding you.' );
		EngineCore.outputText( '\n\nHer spell goes off like a gunshot, at least that\'s what it seems like to you.  It cracks through your consciousness with a booming ripple that stuns you into unthinking silence, your thought process momentarily short-circuited.  Your mouth lamely opens, your tongue slipping out and drooling as your whole body goes limp, uncontrolled. If it weren\'t for the Cum Witch\'s capable hands, you\'d have fallen over into some of her fluids, but she kindly keeps you up, even as she begins to remove your [armor].' );
		EngineCore.outputText( '\n\n"<i>There, there hun, isn\'t that better?</i>" the sorceress asks, "<i>It\'s always better to listen to me.</i>"  You stare at her, unblinking.  "<i>Right,</i>" she giggles, "<i>That\'s what I thought!  You\'re going to love being a Sand Witch, absolutely love it.</i>"  A dark hand, lighter on the palm than the outside gently touches your cheek and guides your head into a little nod.  She quips, "<i>That\'s right, being a Sand Witch is the best!  You\'ll get to have four big, milky tits to milk whenever you have free time, and two cunts that you can get filled any time you come visit.</i>"  Each rambling explanation slips into your ears and settles over your dimmed mind, slipping into the thoughtless, crevices before your brain reasserts itself.' );
		EngineCore.outputText( '\n\nThe Cum Witch begins moving your hand for you, artlessly toying with your cunt as she whispers into your ear.  She\'s brainwashing you, and you\'re too helpless, too vacant to lift a finger.  Besides, it\'s better to listen to her.  Just listening, it\'s better.  Yes, that\'s it.' );
		EngineCore.outputText( '\n\n"<i>Oh, I can just tell you\'re going to be a great sister!  You\'ll love being milked almost as much as you\'ll love having my kids.</i>" she coos.  You start to nod in agreement before you remember to listen, your thought processes slowly resuming.  "<i>You\'ll love having my babies so much that you\'ll try to keep both your wombs full all the time, once you get your second one, won\'t you?  You love my cum, and you want it in all of your holes, but mostly your wombs</i>"  This time you do nod - it\'s going to be fun!  You can\'t wait to ' );
		if( CoC.getInstance().player.bRows() < 2 ) {
			EngineCore.outputText( 'get four big, milky tits' );
		} else if( CoC.getInstance().player.lactationQ() < 200 ) {
			EngineCore.outputText( 'have your tits made into perfect milkers' );
		} else {
			EngineCore.outputText( 'get your four, big tits milked' );
		}
		EngineCore.outputText( ' or to get your first proper administration of witch-cum.' );
		EngineCore.outputText( '\n\nGiggling, you agree wholeheartedly and ask her to help you up onto a bench, so you can be properly bred.  Getting one in the oven now will give you a headstart on getting both your wombs pregnant - you just need to get them to give you a second cunt after this.' );
		if( CoC.getInstance().player.pregnancyIncubation > 0 ) {
			EngineCore.outputText( '  It seems you\'ve somehow managed to forget that you\'re already pregnant, and the Cum Witch doesn\'t seem keen to remind you.' );
		}
		EngineCore.outputText( '  Just thinking about her gets you wet, wetter than you were already, and you were already so hot and moist from earlier.  Your legs spread of their own accord as she lifts you onto a waist-high bench, your cunt-juices drooling down the jizz-polished hardwood, your head swimming from the potent smells of sex that saturate this room.  Wiggling your bottom, you move your [butt] back and forth enticingly, shaking it in front of your partner\'s leaky tool, your eyes locking onto that messy implement as if it were going to save your life somehow.' );
		EngineCore.outputText( '\n\nThe cum witch gives your impertinent bottom a slap to steady it, bursting an exclamation of pain from your mouth at the sudden rough treatment.  \'She\'s so rough,\' you mentally whine, but another voice answers, \'But she\'ll be so good to you!\'  Sighing contently, you listen to that second, louder thought and lie there, watching your lover slowly line herself with your entrance.  When her cock\'s oozing tip first brushes your folds, an electric bolt of raw pleasure runs through your body, drawing out a slippery spurt of lady-spunk just from that touch.  Gods above and below, it\'s so hot, just touching it seems to make your pussy wetter.  If you didn\'t know better, you\'d swear your pussy was boiling over with lust and frothing with need.' );
		EngineCore.outputText( '\n\nTwo huge tits come to rest on your back, pinning you underneath their enormous weight, smooth, sweat-slicked skin sliding across your body like silk as the hard shaft spreads your vulva wide and slides through the curtain of oozing fem-cum. You moan happily at that welcome intrusion, a sensation of amazing fullness - no, rightness - filling you up in the most perfect and womanly way.' );
		if( CoC.getInstance().player.hasCock() ) {
			EngineCore.outputText( '  [EachCock] throbs beneath you, hard as rock and crushed between your belly and the slippery-smooth wood.  It seems unimportant compared to what\'s going on above it.' );
		}
		CoC.getInstance().player.cuntChange( CoC.getInstance().monster.cockArea( 0 ), true, true, false );
		//Virgin check here!;
		EngineCore.outputText( 'When the two, wondrously bulging nuts come to rest on your [butt], you realize she\'s completely and utterly inside you.  That hard, wonderful cock is inside you and pressing up on your cervix, the thick, potent cum oozing directly into you, where it belongs.  You sigh in contentment and work your internal muscles, clenching the dick inside you as if you could milk it, drawing a surprised gasp from the dusky lips of your dark-skinned lover.  Her hard nipples dig harder into your back and an increase in the wet warmth in your [vagina] alerts you to just how much she\'s enjoying it.' );
		EngineCore.outputText( '\n\nThe Cum Witch strokes your hair and promises, "<i>I\'ll do this for you every day, every hour if I have to, until you\'re pregnant... and then I\'ll come visit you in the wards and give you all the cum you\'d ever want.</i>"  A fat bulge distends your labia as it works its way down the Witch\'s dick, squirting explosively inside you, proof of her excitement for the idea.  You couldn\'t be happier!  Not only are you going to be a huge-tittied milk-witch, but your lover is going to keep you so full... warm and packed with spunk and life.  Your [vagina] tingles and quivers at the thought, massaging the woman\'s thick, black dick happily as she begins to slowly move her hips, gently sliding herself out just enough to release a few bubbles of cum before sheathing herself in your twat once again.' );
		EngineCore.outputText( '\n\nYou shiver wildly, now impaled again, just the way you wanted.  That perfect bliss is fleeting, as the Cum Witch begins to fuck you faster and harder, tits wobbling dangerously on top of you as her bottom arches and straightens with each thrust.  You begin moaning with every thrust, a picture of feminine contentment as you\'re perfectly mounted by another (partial) female.  Smiling knowingly, your blonde-haired lover kisses at your shoulders.  Her moist, soft lips slowly but inexorably travel closer and closer to your spine, until, with an electric thrill, they kiss one of your vertebrae. You shiver, but she isn\'t done yet.  Her gentle kisses work up to the nape of your neck where they pause, a saliva-slicked tongue smoothly gliding across your body to lick at the corner of your ear.' );
		EngineCore.outputText( '\nThroughout the sensual love-making, you feel the spooge bubbling up into your body, a constant, pulsing reminder of the Cum Witch\'s seemingly endless affection.  Globules of her seed have already begin to slip out of your cunt-lips, hanging from your [clit] for a moment before they drip to the floor.  This constant fluid flow proves surprisingly pleasurable, and if you weren\'t already moaning like a whore in paradise, you\'d start now.  The thick cock inside you seems to find the sensation equally enjoyable, if its twitching and gradually increasing cum-flow is any indication to go by.  With her hips pistoning hard, the hermaphrodite seems to relentless in her attentions, but passionate beyond belief.' );
		EngineCore.outputText( '\n\nThen, just when you expect her to go wild and take you both to orgasm, she pulls out and flips you over, turning you up to face her.  Her sky-blue eyes twinkle happily as she admires your cum-pudged belly, but when you reach down and pull your hungry pussy-lips apart, the interlude comes to an end.  With animal savagery, the Cum Witch mounts you, throwing her whole body atop you and crudely pounding your box.  Fat globules of cum squirt from her shaft almost constantly with each push inside your well-juiced nethers.  Still, even though you\'re quaking and shaking with her, you can tell that she hasn\'t cum yet.  Her eyes do look a little distant, and thinking to bring about your fertilization that much quicker, you reach up for her huge nipples.' );
		EngineCore.outputText( '\n\nThey\'re as soft as the rest of her, though they have a slightly pebbly texture that makes you wish you could lick and suck on one.  Instead, the huge knockers are threatening to completely envelop your hands, the huge tits smashing flat against your [chest].  The Cum Witch suddenly cries out, and you see her biting down on her lower lip, her eyelids low and her body shaking.  Her hips slam into you one last time, hard, deliciously filling you.  Her balls bounce up and down, and you feel her shaft suddenly thickening from base to tip, expanding to pass the huge torrent of cum she\'s starting to pump into your womb.  Blessed heat washes through you, and you feel the ' + CoC.getInstance().player.skin() + ' stretching tight.  You feel so full and taut that you could use your belly like a drum, but the Cum Witch\'s orgasm is just getting started.  Each pulsing blast of semen is answered by a matching torrent of cum that sprays from your soaked pussy, puddling on the floor.  You twitch beneath her, orgasming from the feel of so much fluid flowing through your box, and closing your eyes as the pleasure overwhelms you.' );
		EngineCore.outputText( '\n\nThe two of you stay joined at the hips for an indeterminable amount of time, sweating bodies joined in ecstatic bliss.  Like all good things, it does come to an end, and one of the normal sand witches enters to interrupt you.  The ebon beauty leaves you suddenly empty, a flood of her fluid dripping to the floor as she announces, "<i>I subdued the interloper, but I convinced her to join us.</i>"' );
		EngineCore.outputText( '\n\nThe other woman looks a little confused at this, but when she sees your wide, excited eyes, she reluctantly nods.  There\'s a flash of irritation at your presence, but it fades when your lover offers, "<i>Don\'t be sour, I saved some for you, hun.  Why don\'t you take your sister to the mother, and when you come back, I\'ll make sure to pack all three of your cunts, okay?</i>"' );
		EngineCore.outputText( '\n\nThis seems to placate the four-breasted, three-pussied woman, a wide grin breaking out on her face.  She helps you up and leads you from the room to your new life, the last thing you see as you go a subtle wink from the Cum Witch...' );
		CoC.getInstance().player.orgasm();
		EngineCore.dynStats( 'lib', 100, 'sen', 100 );
		//Next;
		EngineCore.menu();
		EngineCore.addButton( 0, 'Next', this.chicksLoseToSandWitchesBadEndFinale );
	};
	DungeonSandWitch.prototype.chicksLoseToSandWitchesBadEndFinale = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( '<b>Some time later...</b>' );
		EngineCore.outputText( '\nYou smile and rub your hands across your womb.  True to her word, the Cum Witch got both your wombs pregnant in short order, and you couldn\'t be happier.  Your sisters have doted on you ever since they discovered your devotion to milk-production and child-incubation.  At first, they were a bit disturbed by your seemingly endless love for the Cum Witch\'s cum, but as you produced more and more milk (and children) they stopped worrying about making you stay clothed or cleaning her cum from your skin.  Not long after that, you moved in with her as a live-in cum-dump. Life is good.' );

		EngineCore.outputText( '\n\nYou swallow a creamy batch of her spunk and cup her heavy balls.  They\'ve grown a little since you moved in, you suppose to keep up with your voracious appetite for her seed, but your black lover doesn\'t seem to mind.  If anything, she seems quite happy to have you between her knees while she\'s studying her spells.  You can focus on swallowing her cum until you\'re full, and she gets the motivation she needs to properly develop her magics.  Why, just last week she learned how to make her jizz taste like chocolate - that was a great week!' );
		EngineCore.outputText( '\n\nStill, as you massage her quaking testes and drink down her delicious jism, you have to think, "<i>Life is good.</i>"' );
		EventParser.gameOver();
	};
	//*Male Loss - Turned Into Cum Pump;
	DungeonSandWitch.prototype.cumWitchCumPumpBadEnd = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'Laid low by ' );
		if( CoC.getInstance().player.HP < 1 ) {
			EngineCore.outputText( 'your wounds' );
		} else {
			EngineCore.outputText( 'by the lust coursing through your veins' );
		}
		EngineCore.outputText( ', you slump over against a desk, leaning heavily on it for support while ' );
		if( CoC.getInstance().player.HP < 1 ) {
			EngineCore.outputText( 'you struggle to rise' );
		} else {
			EngineCore.outputText( 'you struggle to get your crotch' );
		}
		EngineCore.outputText( '.' );
		EngineCore.outputText( '\n\n"<i>Let me help you with that,</i>" the robed beauty whispers as she deftly removes your [armor], leaving you bare and exposed, naked to her casual caresses and lecherous looks.  "Such a lovely ' + CoC.getInstance().player.mf( 'male', 'hermaphroditic' ) + ' specimen' );
		if( CoC.getInstance().player.cumQ() > 1000 ) {
			if( CoC.getInstance().player.balls > 0 ) {
				EngineCore.outputText( ' and such virile, cum-swollen testes.  An excellent breeder for sure!' );
			} else {
				EngineCore.outputText( ' and such a virile body!  An excellent breeder for sure!' );
			}
		} else {
			EngineCore.outputText( 'but with such a pathetic virility.' );
		}
		EngineCore.outputText( '  A little magic later, and you\'ll be quite suited to breeding daughters with me.  Perhaps if you do well enough, I\'ll allow you to seed MY womb.</i>"' );
		EngineCore.outputText( '\n\nWith her slender fingers trailing over your heaving, exhausted form, the cum witch explains, "<i>Before we get to the fun part, let\'s see about getting you in the proper mood.</i>"  You ' );
		if( CoC.getInstance().player.HP < 1 ) {
			EngineCore.outputText( 'grunt and strain in response, still trying to fight, even though you know it\'s hopeless.' );
		} else {
			EngineCore.outputText( 'groan and touch yourself, trying to show her just how \'in the mood\' you are.' );
		}
		EngineCore.outputText( '  She affectionately ruffles your ' + Descriptors.hairDescript() + ' and tuts, "<i>Now, now, it\'s cute that you think you still have some agency here, but you really ought to just lay back and let me take worry about it!</i>"' );
		EngineCore.outputText( '\n\nThe cum witch rolls up her sleeves and gesticulates rhythmically.  Trails of phosphorescent fire trail from her nails with each motion, and you\'re being lifted, raised up into the air on streams of phantasmal force.  You hover like that for a moment, then with a brush of luminous energy, you slide sideways onto a bench, the magic disappointing to rest you gently upon the firm wooden surface.  Exposed as it is, [eachCock] rises powerfully, as if displaying itself for inspection.  Given the circumstances, it very well may be.' );
		EngineCore.outputText( '\n\nSnapping her fingers, the black-skinned spellcaster snares glowing bands of force around your chest, wrists, biceps, and [feet], effectively restraining you as efficiently as any torture rack.  You struggle briefly, though you cannot say whether to free or touch yourself.  Does it really matter?  Either way, you\'re bound, nude, helpless, and aroused.  Gentle touches rub the ' + CoC.getInstance().player.skinFurScales() + ' of your [chest] as she reassuringly coos, "<i>Relax, my mighty friend.  You undoubtedly fought hard to get here, but now, all you need to do is relax.</i>"' );
		EngineCore.outputText( '\n\nSoft touches trace across your belly button and around your loins, skirting the sensitive, hard flesh in the middle to trace towards your [legs].  "<i>Feel how soothing my touches are?  How absolutely relaxing it is to be massaged in such a way?  Your muscles just... go slack, the tension draining out your [feet] to leave you with nothing but comfort.</i>"  You want to resist, but after fighting your way here and losing, it just feels too damned good.  Heedless of your desires, your [legs] relax and let the tension go.  You sigh in unexpected happiness as she continues.' );
		EngineCore.outputText( '\n\nNext, the witch rubs her way back up to your [hips].  She suggests, "<i>I\'m going to work my way up your body, and with every part I rub, you\'re going to let out more and more of your pent up tension.</i>"  True to her words, your body is beginning to feel like putty from the waist down - a limp facsimile of its former self.  The softness has even infected your ' + CoC.getInstance().player.multiCockDescriptLight() + ', robbing some of the former stiffness.  You sigh and inadvertently let your guard down.  You\'ve already lost, and if this woman wants to give you a massage before she has her way with you, why not enjoy it?' );
		EngineCore.outputText( '\n\n"<i>As a matter of fact, you\'re getting so relaxed now that you don\'t even need my touches for that wonderful, soft sensation to climb higher.  You can feel skilled fingers working the tension out of every single part of you, relaxing you to the core,</i>" instructs your captor, removing her hands from your body.  The words ring true, and your arms gradually deaden, going as limp as the rest of you.  That wonderful relaxation moves into your core, and you exhale happily.' );
		EngineCore.outputText( '\n\n"So very relaxed,</i>" the witch whispers, "<i>You\'ve let out so much tension that you\'re getting tired, so very tired that your eyelids are starting to sag.  They are heavy, aren\'t they?  Don\'t try to answer.  Just feel them dragging down, as if iron weights were suspended from them, tugging your eyelids closed.</i>"' );
		EngineCore.outputText( '\n\nYou strain to stay awake, but with the sensation of so many soothing caresses lingering on your ' + CoC.getInstance().player.skinFurScales() + ' and the heavy weights pulling down... down.  You blink, getting your eyes half open. The next time they close, they stay closed, leaving you to dwell on the imaginary massage.' );
		EngineCore.outputText( '\n\nPlacid feelings fill your form as your heartbeat slows, and you wonder when she plans to get to the sex.  "<i>Now, don\'t think.  Just relax.  You feel so good like this, and with your eyes closed, you can focus entirely on feeling good and listening to me.  Now you can hear me so clearly that my voice seems to be coming from inside you, seeping into your relaxed body and mind with every statement of fact.  Doesn\'t it feel nice?  If it does, feel free to sink deeper and let the soothing sound of words flow into you without thought or question.</i>"' );
		EngineCore.outputText( '\n\n...Wait, what?  Your brow furrows as you try to pay more attention to her words and figure out what just happened, but her fingers are on your forehead in an instant, massaging your worry away.  Your face visibly relaxes at her touches, and your breathing evens to a slow, peaceful tempo.  "<i>Good ' + CoC.getInstance().player.mf( 'boy', 'girl' ) + ',</i>" the cum witch says in a honeyed, syrupy-sweet tone, "<i>Now that you\'re nice and receptive, let\'s speed things along a little, shall we?</i>"' );
		EngineCore.outputText( '\n\nSparks of magic glimmer and flicker, bright enough be seen through the darkness of your eyelids.  They move up, circling the sorceress\'s fingers before following her firm presses into your skull.  To you, the only difference is the disappearance of the light and perhaps an increased sense of tranquility, a soft blanket of bliss that settles over you and snuffs out errant thoughts before they can begin.  You\'re pliant and receptive, open to feel and listen, but unable to form cogent messages of your own.  "<i>Perfect.</i>"' );
		EngineCore.outputText( '\n\nA lecture of words, information, and instructions starts, though by the third paragraph you stop paying attention with your conscious mind and allow them to mold you unhindered.  At some point, the massaging fingers withdraw.  It doesn\'t matter, as per the earlier instructions, you can still feel them on your flesh, smoothing out any worry or disharmony in your mind.  A shrinking part of you continues to act up and resist it, but each time it gets smoothed over and forgotten.  With every overpowered token of resistance, it grows weaker, smaller, and less resilient, taking longer to crop up and fight.' );
		//[NEXT];
		EngineCore.menu();
		EngineCore.addButton( 0, 'Next', this.beACumPumpPartII );
		CoC.getInstance().player.orgasm();
		EngineCore.dynStats( 'lib', 100, 'sen', 100 );
	};
	DungeonSandWitch.prototype.beACumPumpPartII = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( '<b>*SNAP*</b>  You yawn and begin to blink the sleep from your eyes, shielding your gaze from the room\'s ambient light with your hand.  Your head is muzzy, like you stayed up too late or overindulged in milk again.  A soft hand is massaging your balls, caressing the orbs with the tenderness of a lover. They feel warm... and full.  ' );
		if( CoC.getInstance().player.balls === 0 ) {
			EngineCore.outputText( 'Wait a moment, you don\'t - didn\'t - have balls! Turning your accusing stare towards the busty witch, you watch in wonder as the newly grown sack slowly turns taut, stretched by the burgeoning size of your cum-stuffed spunk-factories.  She pats your newly-stuffed nutsack and remarks, "<i>I had to make sure you were suitably virile...  Besides, I needed to make sure you\'d only sire daughters for us.  We don\'t need that many like you, my loyal ' + CoC.getInstance().player.mf( 'stud', 'cum donor' ) + '.</i>"' );
		} else if( CoC.getInstance().player.cumQ() < 3000 ) {
			EngineCore.outputText( 'The cum witch gives them a gentle shake, smiling as they grow and swell, burgeoning with full, ripe seed.  She remarks, "<i>Nothing like the virility of a bull and enough seed to father an army of females to make a useless intruder a contributing member of society, eh breeder?</i>"' );
		} else {
			EngineCore.outputText( 'The cum witch gives them a gentle pat and remarks, "<i>No sense messing with perfection... at least not beyond necessary.  We wouldn\'t want you fathering any boys, would we?</i>"' );
		}
		//add balls if necessary;
		if( CoC.getInstance().player.balls < 2 ) {
			CoC.getInstance().player.balls = 2;
		}

		EngineCore.outputText( '\n\n"<i>Perhaps just a little more,</i>" the lusty woman breathily exhales as she rubs your balls.  Your sack stretches a little tighter, the skin going glossy and smooth, unblemished and perfect.  She massages the swollen orbs with motherly care as they seem to grow denser, fuller.  You swear you can hear them sloshing as she manhandles your jewels, so full of thick seed that it\'s nearly painful.  Your back arches, lifting your hips as you get into it a little bit, your lust rising in equal pace with your surging erection' );
		if( CoC.getInstance().player.cockTotal() > 1 ) {
			EngineCore.outputText( 's' );
		}
		EngineCore.outputText( '.  Of course, the wicked witch only releases you at this point.  "<i>Do I look like one of the cum-hungry wenches around here?</i>"' );
		//add lust;
		EngineCore.dynStats( 'lus=', 100, 'resisted', false );
		EngineCore.outputText( '\n\nAt that, a few nagging worries surge up to the forefront of your lust-addled thoughts.  You were hypnotized!  Worse than that, you can barely remember anything, let alone how you got here.  In addition, though less pressing, she\'s done something to you that\'ll make you only father females.  You don\'t remember much, but you know that\'s not quite right.  You jump up and nearly fall over your own [feet] in your hurry to get away from this woman - alluring and arousing as she is.  Pressing your back flat against the wall, you begin breathing faster and faster as you wrack your consciousness for an explanation.' );
		EngineCore.outputText( '\n\nThe dark-skinned woman (who seems INCREDIBLY familiar) calmly approaches you as she apologizes, "Oh dear, this must be terribly jarring for you.  Come, sit down.  I promise not to bite.</i>"' );
		EngineCore.outputText( '\n\nReluctantly, with wariness coursing through your veins, you sit, your once-erect phallus' );
		if( CoC.getInstance().player.cockTotal() > 1 ) {
			EngineCore.outputText( 'es' );
		}
		EngineCore.outputText( ' wilting from the force of your surprise and fear.' );
		EngineCore.outputText( '\n\n"<i>You just completed the cum witch initiation, which appears to have traumatized you greatly.  A decade ago, you were born to assist me in my duty, and today, the culmination of your potential has been fulfilled,</i>" she explains with hooded mysterious eyes.  You frown at that - you could have sworn you were born somewhere else, with friends of both genders... somewhere happy.' );
		EngineCore.outputText( '\n\n"<i>Naughty pump,</i>" the witch states when she sees you screwing up your brow in thought.  Immediately, you cry out and cum, hard.  Your eyes roll back from pleasure, and [eachCock] erupts, spewing jism all over your [legs] even in its limp state.  You cum and cum, puddling all over the floor and draining your prodigious balls of every ounce and then some. The bliss blasts through your brain, carrying the thoughts and questions away with them, pumping them straight out onto the floor to wash down the drain.  Only once your questions have been obliterated by bliss are you allowed to stop and sink into a drooling, receptive state.' );
		EngineCore.outputText( '\n\nWhen you come to, you smile, and sigh, happy your mistress deigned to let you cum.  You must have done something really good to earn such a spontaneous orgasm!  Now, what were you doi- oh yeah, she was reminding you why you let her fix your balls!  Smiling, you let her know you\'re all calmed down and ready to continue.' );
		EngineCore.outputText( '\n\nThe uncharacteristically blonde sex-bomb clears her throat before she goes on.  "<i>Right, as I was saying, you were groomed for this, and today, you\'ve started down the road of unlocking your full potential.  You\'re my apprentice ' + CoC.getInstance().player.mf( 'wizard', 'witch' ) + ', and with a tool that fine AND magic-enhanced balls, you\'ll do fine.  Now, since you\'ve already cum, your first task is going to be learning the incantation of virility.  Take this tome and learn the spell, then cast it upon yourself no less than a dozen times.</i>"' );
		EngineCore.outputText( '\n\nYour mistress hands you the book, promising, "<i>More is better.  When you can take it no longer, I\'ll bring you a sister to impregnate.</i>"  Nodding happily, you rise and stumble over to a nearby desk.  The spellbook is new, though the writing is ancient.  You study it eagerly, soaking up the new knowledge like a sponge.  It\'s comical how easy your brain seems to wick up new information really, almost like whole swathes of it were cleared out and made ready to learn.  You learn the spell within the hour, though your task is made more difficult by the noisy witch your mistress is busy drilling in every hole.' );
		EngineCore.outputText( '\n\nWith the first part of your task complete, you set upon the second.  With nervous, shaky hands, you cast the spell, trying hard not to lose your concentration when a fevered "<i>OH GODS YES!</i>" is screamed mid-sentence.  You maintain your focus, and the rush of magic washes through you, stiffening [eachCock] to a semi-hard state.  Burbles of pre drip from your cum-slit as your [balls] refill with alarming speed.  With all that happening from just one cast... how will you make it through a dozen?' );
		EngineCore.outputText( '\n\nYour teacher pushes a cum-filled witch to the floor, her belly comically distended.  Twin runners of spunk squirt from her well-used twat, matching a similar stream that drizzles from her abused backdoor.  It seems your mistress had little time for personal pleasure beyond the usual insemination.  She saunters over, nude and glistening with sexual juices.  Her voice encourages you, "<i>Go on.  Do them faster.  If you cannot endure a measly twelve castings for virility, then you are not fit to my apprentice.</i>"' );
		EngineCore.outputText( '\n\nNo!  You close your eyes and chant, blowing through the spell as fast as you can.  Each time it completes, you grit your teeth and start anew.  The lust coursing through you by your fourth incantation makes it difficult to focus - you\'re fully hard by that point and your balls feel as full as ever, but you tamp down the errant emotion and focus on the task at hand.  Five... six... seven times you\'ve managed to cast it now!  The bench is getting sticky from all your leaking pre, making you fidget nervously as your swollen balls drag through your juices.  The next arcane ritual makes you shiver with need.  You keep your eyes fixed close and try for number nine, knowing if you were to sneak even the barest glimpse at your hermaphrodite mistress that you\'d lose control and beg her to fuck you.' );
		EngineCore.outputText( '\n\nYou shiver at the thought and nearly cave in just then, your turgid cum-spewing cock constantly leaking at this point.  Your body is so full of the salty cream that it\'s forced out from you in a steady flow, a lewd imitation of a proper orgasm that only grows stronger when you complete your ninth, tenth, and eleventh casts of the spell.  You shiver in pleasure and aching need, but as you begin speaking the words of the twelfth and final utterance, the witch interrupts.' );
		EngineCore.outputText( '\n\n"<i>Stop!</i>" she cries, pointing to your throbbing, jizz-belching boner' );
		if( CoC.getInstance().player.cockTotal() > 1 ) {
			EngineCore.outputText( 's' );
		}
		EngineCore.outputText( ', "<i>I did not think you would get this far.  Your will is truly mighty, [name], but the task I gave you is something I\'ve never been able to do.  Ten is as far as I ever got.  I would not have you damage yourself just yet.</i>  She pulls open the curtain and bellows, "<i>Next!</i>"' );
		EngineCore.outputText( '\n\nAnother woman, an olive-skinned beauty with breasts so pendulous they seem to weigh her body down, enters, glancing at you hesitantly.  The hermaphrodite smiles and nods, gesturing for her to approach you.  [EachCock] looks like a sperm volcano at this point, shrouded in bubbling flows of alabaster spunk that never seem to end.  Your balls are bloated and visibly churn, stuffed more than full of spunk even as they produce more.  The huge-titted milk-witch frowns, but reluctantly straddles you, sinking down upon your spermy scepter with ease.' );
		if( CoC.getInstance().player.smallestCockArea() >= 100 ) {
			EngineCore.outputText( '  The penetration is eased somewhat by your shrinking dick.  You glance at the sand witch in awe, noting her glowing hands.  She gives you a knowing wink and turns, her spell complete, leaving you to enjoy yourself.' );
		}
		EngineCore.outputText( '\n\nThe huge tits on the new witch crush into your face, smearing you with squirting milk as she begins to ride your geysering erection.  ' );
		if( CoC.getInstance().player.cockTotal() > 1 ) {
			EngineCore.outputText( 'Her voluminous butt is thoroughly smeared by the goo from the rest of your ' + CoC.getInstance().player.multiCockDescriptLight() + ', shining with white from your magical virility.  ' );
		}
		EngineCore.outputText( 'She rides you with surprising skill for one who seems to be so hesitant about such a healthy jizz output, her four breasts squishing tight against [chest].  Her tight cunny squeezes and ripples around you, rapidly growing soaked with white, thoroughly spunk-lubed and hungry for more.' );
		EngineCore.outputText( '\n\nAs turned on as you are, you blow in seconds, arching your back and grabbing hold of her plush butt for stablity.  Your load sprays out in huge torrents, easily filling the witch\'s first womb with the first explosion and bulging her belly from the force.  She sighs and somehow finds the strength to rise, only to drop back down on you with her second cunt.  You fill that womb in seconds, massive spurts of alabaster turning her once-flat tummy into a gravid jizz-sphere.  She cries out in orgasm and twitches weakly atop you with all the strength of a wet rag.  Soon, she\'s so full that she slides off you onto the ground, her passage marked by a river of white that bursts free of her loins.  She leans forward to kiss your dick thankfully, earning herself a mask of white, and since she failed at that, she just wraps all four of her tits around it.  Your cock is smothered in slippery tits.  You glaze them all before your magical virility finally wanes, slowly to a pleasured trickle.' );
		EngineCore.outputText( '\n\nThe sputtering witch sighs, "<i>Thanks,</i>" and turns to the smiling hermaphrodite, "<i>He\'ll... he\'ll do fine I think... gods, I\'m full.</i>"  She nervously wobbles out, giving you a wink and a bit of sexy sway as she goes.  You can\'t wait to have a chance at her again!' );
		//[Next];
		EngineCore.menu();
		EngineCore.addButton( 0, 'Next', this.cumPumpVolumeThree );
	};
	DungeonSandWitch.prototype.cumPumpVolumeThree = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'With the champion brainwashed into a little more than a loyal cum-pump for the sand witches, they grow in number and strength with alarming speed.  In the space of eight years, the desert is transformed into a verdant forest.  For better or for worse, the witches finally rival the demons in power.  They spread their influence wider, eventually ' );
		if( CoC.getInstance().player.findStatusAffect( StatusAffects.FactoryOverload ) >= 0 ) {
			EngineCore.outputText( 'destroying' );
		} else {
			EngineCore.outputText( 'rescuing' );
		}
		EngineCore.outputText( ' Marae.  Their abilities, numbers, and familiarity at dealing with demons lend them great success at battling Lethice\'s growing hordes, and within the span of another decade, the demons are exterminated.  The witches are hailed as saviors, and young females of all races seek to join them.  You, of course, inseminate all of them.' );
		EventParser.gameOver();
	};
	//*Repeat Desert Loss Male;
	DungeonSandWitch.prototype.repeatLoseToCumWitchForDudes = function() {
		EngineCore.clearOutput();
		//HP:;
		if( CoC.getInstance().player.HP < 1 ) {
			EngineCore.outputText( 'Collapsing under the weight of your injuries, you tumble back onto your [butt], kicking up a cloud of sand as you fall fully prone.  Laughing at your predicament, the ebony futanari cooly advances, tossing her wide-brimmed hat aside as she goes.  "<i>Oh you poor, poor Champion.  Did you ask the Sand Mother to let us out so that we could this?  Does the strong, mighty ' + CoC.getInstance().player.mf( 'hero', 'heroine' ) + ' have a thing for submitting to my touches and fat cock?  Or perhaps, you want something else...</i>"' );
			EngineCore.outputText( '\n\nCaressing you as she removes your [armor], the witch shows remarkable tenderness for your injuries, knitting the worst with magic to ensure your well-being and kissing others as if it would somehow make them all better.  She stops at your groin to consider [eachCock] for a moment, slithering her fingers around [oneCock] and hefting its supple, ' );
			if( CoC.getInstance().player.lust < 40 ) {
				EngineCore.outputText( 'flaccid' );
			} else if( CoC.getInstance().player.lust < 60 ) {
				EngineCore.outputText( 'semi-flaccid' );
			} else if( CoC.getInstance().player.lust < 70 ) {
				EngineCore.outputText( 'semi-hard' );
			} else {
				EngineCore.outputText( 'turgid' );
			}
			EngineCore.outputText( ' weight.  Pumping her hand with deft strokes and watching your expression intently, the curvy woman works you into a pleasant, erotic warmth, excitement coursing through your body with such fervor that your remaining wounds seem insignificant in comparison.' );
		}
		//Lust:;
		else {
			EngineCore.outputText( 'Dropping down on your [legs], you rip off your [armor] and flop onto your back so that you can focus on abusing your genitalia.  [EachCock] is already hard enough to be leaking pre' );
			if( CoC.getInstance().player.balls > 0 ) {
				EngineCore.outputText( ', and your [balls] are practically quaking with need' );
			}
			EngineCore.outputText( '.  The ebony futanari laughs at you as she confidently strides forward and discards her hat.  "<i>Did you really have any intention of fighting me, or did you ask the Sand Mother to send us out so that we could abuse your insatiable libido?  I don\'t know how you didn\'t wind up captured, but I suppose I can tend to your needs... this time.</i>"' );
			EngineCore.outputText( '\n\nKneeling next to you, the witch runs her hands across your ' + CoC.getInstance().player.skinFurScales() + ' toward your groin.  She grabs hold of [oneCock], hefting the rigid weight as she gauges your size.  Her fingers are soon glossy with your dribbling pre-cum, and she slowly pumps you to make sure she has your undivided attention.  "<i>So helpless...  Still, hopefully this can produce a decent cum-shot.</i>"  Her eyes twinkle with mirth, and she finishes, "<i>If not, I can always encourage it.</i>"' );
		}
		//*Dick No Fit Male Loss Scene;
		//Frotting -> Double Facial?;
		//Urethral Pen?;
		//Fingers PC's cock?;
		if( CoC.getInstance().player.cockThatFits( CoC.getInstance().monster.vaginalCapacity() ) < 0 ) {
			EngineCore.outputText( '\n\nAbruptly, the Cum Witch climbs atop your lust-wracked body.  Her robe is off in a flash, and you\'re finally able to appreciate her sweat-slicked, onyx-skinned body as she sits on your immense, oversized maleness, her form glistening in the desert sun.  Thumbing a finger just under your ' + CoC.getInstance().player.cockHead( 0 ) + ', she teases your gigantic dong while her own hard prick flops down on top of it, just heavy enough to leave a cock-shaped impressed on your urethral bulge.  The omnipresent heat and the fight have ensured that both bodies are soaked with sweat and able to slip and slide over each other easily.  Utilizing this, the Cum Witch rocks her hips slowly, folds splayed and leaking over your cock.  Her dick is already dripping a slow flow of girl-jism onto your own, almost claiming it as her own.' );
			EngineCore.outputText( '\n\nGiggling, the onyx sperm-mage laughs as she slowly begins to frot with you.  "<i>Why have a dong this big if you can\'t fit it in anything?</i>"  She sensually caresses some of your copious cock before bending down and licking at the ' + CoC.getInstance().player.cockHead( 0 ) + '.  You shiver and express a drop of pre-cum onto your own ' );
			if( CoC.getInstance().player.biggestCockLength() < CoC.getInstance().player.tallness / 2 ) {
				EngineCore.outputText( '[chest]' );
			} else if( CoC.getInstance().player.biggestCockLength() < CoC.getInstance().player.tallness / 1.6 ) {
				EngineCore.outputText( CoC.getInstance().player.face() );
			} else {
				EngineCore.outputText( Descriptors.hairDescript() );
			}
			EngineCore.outputText( '.  The black spellcaster comments, "<i>I must admit it is fun to look at, but it doesn\'t look like it\'s ready to blow just yet.  How about a little encouragement?</i>"' );
			EngineCore.outputText( '\n\nThe Cum Witch snaps her fingers, and two smooth, spherical bits of stone lift up.  They begin to vibrate so fast that you can hear them humming in the air.  They arc over your chest and flutter down onto ' );
			if( CoC.getInstance().player.totalNipples() > 2 ) {
				EngineCore.outputText( 'two of ' );
			}
			EngineCore.outputText( 'your [nipples]' );
			if( CoC.getInstance().player.hasFuckableNipples() ) {
				EngineCore.outputText( ', sinking inside your moist tit-holes almost immediately' );
			}
			EngineCore.outputText( '.  With two vibrators savaging your [nipples] and the black-hued beauty riding your cock like her own personal rocket, you can barely contain yourself.  Your back arches, and you try to buck your hips, to fuck her, her cock, whatever, but you\'re still too exhausted from the fight to shift her body weight.  You can do nothing but lie there while she uses you, humping your cock, her ebony length dragging its lurid pleasure across your ' + Descriptors.cockDescript( 0 ) + ' while you wriggle and writhe ecstatically.' );
			EngineCore.outputText( '\n\nAfter a while of continual teasing, the sable seductress leans over you and lets her huge breasts sweetly kiss on your elephantine mass.  She leans down as if to kiss you, but at the last moment, she swerves to the side, licking the nape of your neck up to your ear before breathily whispering promises into your ear, "<i>There\'s nothing like blowing off some steam out here in the sands after my work.  And to have such a... gifted ' + CoC.getInstance().player.mf( 'boy', 'girl' ) + ' to play with is a treat in and of itself.</i>"  She grunts, sweaty balls bouncing on your [sheath].  "<i>You look so helpless for someone who\'s packing so much.  I look forward to seeing how you look with my cum hiding that expression.</i>"' );
			EngineCore.outputText( '\n\nYou frown until she rubs a particularly sensitive spot on your ' + Descriptors.cockDescript( 0 ) + ', then a dopey, pleasure-addled smile replaces it.  She kissing your cheek and coos, "<i>That\'s more like it, pet.  I\'m going to make you so messy.</i>"  Her toes fondle your [sheath] as they slide down to your ' );
			if( CoC.getInstance().player.balls > 0 ) {
				EngineCore.outputText( '[balls], rolling the ' );
				if( CoC.getInstance().player.ballSize < 2 ) {
					EngineCore.outputText( 'petite ' );
				} else if( CoC.getInstance().player.ballSize >= 5 ) {
					EngineCore.outputText( 'weighty ' );
				}
				EngineCore.outputText( 'orbs across her soles.' );
			} else if( CoC.getInstance().player.hasVagina() ) {
				EngineCore.outputText( '[vagina], slipping a few toes through your folds while a big toe diddles your [clit].' );
			} else {
				EngineCore.outputText( 'taint, softly stroking the sensitive skin between your groin and [asshole].' );
			}

			EngineCore.outputText( '\n\nGroaning, the Cum Witch asks, "<i>Since your big, sensitive shaft is so much fun for me to play with...  oooh, yeah....  Uh, I\'ll give you a choice!</i>"  She smirks and slides her whole body along your prodigious length, breasts bouncing along the side while her cock drips all over you, glazing you white.  "<i>I\'ll cum all over your face, and make sure you do too, but I\'ll be sure to leave you just a little more virile in exchange.  Or, I\'ll aim off the side, but borrow a little bit of your potency when I do.  What\'ll it be, ' + CoC.getInstance().player.mf( 'stud', 'hun' ) + '?</i>"' );
			EngineCore.outputText( '\n\nSo if you avoid a facial she\'ll steal some of your semen production, but if you take it, she\'ll make you MORE virile.  While you\'re mulling it over, she\'s still grinding on you, distracting you with flashes of salacious delight.  The clock is ticking, and if you don\'t pick soon, she might pick for you.' );
			//[Facial] [No Facial];
			EngineCore.dynStats( 'lus=', 100, 'resisted', false );
			EngineCore.addButton( 0, 'Facial', this.tooBigCumWitchLossFacial );
			EngineCore.addButton( 1, 'No Facial', this.tooBigCumWitchLossNoFacial );
		} else {
			//*Dick Fits Male Loss Scene;
			//Get cock ridden;
			EngineCore.outputText( '\n\nAbruptly, the Cum Witch climbs atop your lust-wracked body.  Her robe is off in a flash, and you\'re finally able to appreciate her sweat-slicked, onyx-skinned body as she sits on your midsection, glistening in the desert sun.  She crosses her arms under her immense breasts, so large they\'d put a cow-girl to shame, and flexes to make them shake and wobble, big brown nipples swaying hypnotically before you.  Your eyes gravitate towards the heavenly teats, each wide and supple, capped with a hard, pebbly protrusion that seems to call for your tongue.  Giggling, she moves one of her arms back to grab [oneCock], and she rolls her hips back until your boner is devoured by her slippy butt-cheeks, pressing through the ebony crack until it feels her dusky, moist cunt-lips dragging along it.  Your ' + CoC.getInstance().player.cockHead( 0 ) + ' appears underneath her large balls, peeping out to leak its lust onto your belly.' );
			EngineCore.outputText( '\n\n"<i>How about this?  I can just slide back and forth on you while your eyes track my tits, entranced by nipples until you\'re creaming your little tummy with your spent seed.</i>" she suggests, interrupted by her own coo of pleasure when your ' + Descriptors.cockDescript( 0 ) + ' lurches underneath her and floods with excitement.  "<i>Oh, you liked that huh?  Does the Champion have a titty little hypno-fetish?</i>"  Her breasts continue to sway slowly, and her hips join in with the same slow rhythm.  Each of her hands is glowing now, lighting up with purplish-white intensite as she shakes her breasts and butt for your pleasure.  Confidently, she explains, "<i>I\'m quite skilled at mental manipulation, but surely you know that already.  My nipples ARE quite erotic.  You can\'t even look away any more, but surely you don\'t mind?</i>"' );
			EngineCore.outputText( '\n\nSqueezing her cheeks around your spasming erection, the Cum Witch releases your ' + Descriptors.cockDescript( 0 ) + ' so that she can support herself as she leans forward, bringing her bouncing, hypnotic breasts closer to your face.  You open your eyes wider to try and take in more of their erotic expanse.  Your ' + Descriptors.cockDescript( 0 ) + ' is getting hotter and wetter, and the sorceress\'s own erection has risen to complete and full hardness, the ebony tool bouncing lewdly on your [chest] as she grinds her sopping-wet cunt across you.' );
			EngineCore.outputText( '\n\nHer voice purrs, "<i>Just focus on my nipples and let me worry about making you feel good.  My pussy has your cock entranced and obedient, sure to cum before long, and you can just relax and enjoy the swaying, heavenly shape of chest, can\'t you?</i>"' );
			EngineCore.outputText( '\n\nYou DO feel good... so good.  It probably won\'t be long before you\'re erupting, and as close as her breasts are, there\'s nothing else to look at anyways.  Increasingly, your muscles are going slack, and a dopey smile has spread on your face.  This woman knows her way around a dick.' );
			EngineCore.outputText( '\n\n"<i>See?  I told you that focusing on my nipples would help you feel good.  Now, just keep looking at them.  Let your mind completely fixate on them to exclusion of all else and I\'ll keep you feeling better and better,</i>" the witch says, as everything excepting her supple, dark buds seems to fade into a haze of pleasure.  Her voice goes low and husky as she continues, "<i>That\'s right, pet.  You focus on the nipples and listen to my voice.  It\'ll tell you what you\'re feeling.</i>"  There\'s a sloppy, wet squish as your ' + Descriptors.cockDescript( 0 ) + ' is pulled into a silky, wet hole.  "<i>And you\'re feeling so good thanks to how well you\'re focusing.  The more you focus, the better it feels and the less you have to worry about what I\'m saying and simply FEEL.</i>"' );
			EngineCore.outputText( '\n\nShe\'s so right, and it feels so good.  It\'s like your head is slowly emptying of everything but the view of her nipples, and warm, wet pleasure is filling in along with the periphery, along with words you can\'t take the time to process - enjoying the view and the pleasure is too important.  A high pitched whimper of pleasure escapes your lips when you the snug tunnel compress around your ' + Descriptors.cockDescript( 0 ) + '.  It\'s so perfect - like it was crafted for you and you alone, and the folds are sliding and rubbing every vein, every nerve ending, every part of your tool, washing you with unholy pleasure that you\'re barely conscious of.  It feels so good to relax underneath her.' );
			EngineCore.outputText( '\n\nThe breasts stop swaying, but that doesn\'t matter - it just lets you oggle her nipples more effectively.  Even when she moves to press one into your lips, you can still see it your minds eye as if viewed from a disembodied perspective.  Her beautiful, bountiful breasts are all over you, and everything is so warm and wet and pleasant that you just feel like you could melt right into her bosom.  It tastes as marvelous as it looks, and you suckle with unthinking passion.' );
			//Balls;
			if( CoC.getInstance().player.balls > 0 ) {
				EngineCore.outputText( '\n\nA hand secures itself to your [sack] firmly, squeezing a tugging on your twitching cum-factories, massaging the bubbling seed within to a frenzy.  The witch\'s voice grows insistent as she massages your nuts, ' );
			} else {
				EngineCore.outputText( '\n\nA hand presses down on the border between your gentials and your [asshole], rubbing in slow circles, just hard enough that you can barely feel it pushing on something inside you.  The witch\'s voice grows insistent as she works your body, ' );
			}
			EngineCore.outputText( 'loud and firm enough for your dazzled mind to cogitate her words: "<i>Oh, my pretty bitch ' + CoC.getInstance().player.mf( 'boy', 'girl' ) + ', feel the pressure building up inside you.  Higher and higher now... It\'s almost too much, isn\'t it?  You don\'t need to answer, just feel it grow thicker and hotter.  You\'re going to cum like a geyser, because of me, and you\'re going to love it.  You\'ll always want to cum for me, won\'t you?</i>"' );
			EngineCore.outputText( '\n\nA vibrating, staccato pleasure sizzles from the tips of her fingers and directly into your [balls].  Instantly, a heaviness sets in.  There\'s a palpable denseness in your reproductive organs, like they\'ve swollen slightly or at the very least simply increased in capacity, and they STILL feel so full you\'re about to burst.  Cum is freely drizzling from [eachCock]' );
			if( CoC.getInstance().player.cockTotal() > 1 ) {
				EngineCore.outputText(
					', particularly the one inside her.' );
			}
			EngineCore.outputText( '  It drips all over you, leaking out from inside her nethers, so thick it\'s tinted whitish with the absurd amount of semen boiling out of you.  You gurgle in delight as a fresh spasm of magical energy washes through your loins, plumping you perfectly down there until you can contain it no longer.  The voice inside you breathily whispers, "<i>Cum for me,</i>" and you do.' );
			EngineCore.outputText( '\n\nYour orgasm is the most relaxing, sublime orgasm you\'ve had in recent memory.  The ecstatic pleasure shooting through your nervous system is so strong that you\'re not sure how long you can take it, but your flagging, relaxed body limply lays there while your hips and groin contort themselves to keep up the pulsating biological rhythm going.  Warm splashes splatter across your chest' );
			if( CoC.getInstance().player.cockTotal() > 1 ) {
				EngineCore.outputText( ' while your extra erection' );
				if( CoC.getInstance().player.cockTotal() > 1 ) {
					EngineCore.outputText( 's spurt' );
				} else {
					EngineCore.outputText( ' spurt' );
				}
				EngineCore.outputText( ' some cream up the ebony arch of your mistress\'s back' );
			} else {
				EngineCore.outputText( ' from her bouncing, ebony erection' );
			}
			EngineCore.outputText( '.  At the same time, her clenching, pussy climaxes around you while you fill it.  You\'re spraying ropes of spooge into her so fast that it\'s backwashing out around your ' + Descriptors.cockDescript( 0 ) + ', the veins pumping almost as hard as your overactive reproductive system.' );
			EngineCore.outputText( '\n\nIt goes on for so long that you\'re still cumming long after you would have thought it should end, and you just can\'t take it anymore.  Even though you\'re still fixated on her gorgeous nipples, your eyes start rolling back into your head, jerking further under your eyelids with the frothy seed-packed payloads you\'re releasing.  You whimper when she pulls off you, seed still dripping from her well-used cunt and slowly-deflating cock.  Still cumming, still feeling the glorious bliss she\'s conditioned you to feel in the presence of her breasts, you squirt wet ropes straight into the air while she dresses and kneels down next to you, whispering promises of how she\'ll make you cum more and more every time you give in to her.' );
			EngineCore.outputText( '\n\nYou black out when she prods your groin with a fresh tingle of magic, launching a torrent of jism a dozen feet into the air in the process.' );
			CoC.getInstance().player.orgasm();
			EngineCore.dynStats( 'sen', 5 );
			if( CoC.getInstance().player.cumQ() < 60000 ) {
				CoC.getInstance().player.cumMultiplier += 2;
			}
			Combat.cleanupAfterCombat();
		}
	};
	//Take The Too Big Loss Facial;
	DungeonSandWitch.prototype.tooBigCumWitchLossFacial = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'Ruefully, you tell her that you don\'t mind a little cum in exchange for having your own abilities enhanced.  The knowing grin that spreads across her face makes it seem like she knew the result was a foregone conclusion.' );
		if( CoC.getInstance().player.cor < 33 ) {
			EngineCore.outputText( '  You shudder at the knowledge of what\'s going to happen to you.  Just why did you agree to this?' );
		} else if( CoC.getInstance().player.cor < 66 ) {
			EngineCore.outputText( '  You catch yourself licking your lips as the knowledge of what is about to happen to you sinks in. Despite hastily stopping yourself, the Cum Witch still saw, and she smiles.' );
		} else {
			EngineCore.outputText( '  You give her a lewd look and lick your tongue across your lips as you anticipate the big, fat load she\'s going to feed you, hungry for wet, decadent pleasure regardless of inhibitions.' );
		}

		EngineCore.outputText( '\n\nThe hot moisture she\'s secreting all over your ' + Descriptors.cockDescript( 0 ) + ' seems to be affecting you as well as the vibrations ' );
		if( CoC.getInstance().player.hasFuckableNipples() ) {
			EngineCore.outputText( 'in' );
		} else {
			EngineCore.outputText( 'on' );
		}
		EngineCore.outputText( ' your [nipples].  It feels like there\'s so much blood being forced inside your erection that the sheer over-tumescence will make you burst.  The need is overwhelming.  You HAVE to cum, and you\'re so wet, so stained with spunk and juice that there\'s no time like now.  The Cum Witch\'s heels press in on your ' );
		if( CoC.getInstance().player.balls > 0 ) {
			EngineCore.outputText( '[balls], compressing them slightly as a tingle of magic lances into you, fattening them under her ministrations' );
		} else if( CoC.getInstance().player.hasVagina() ) {
			EngineCore.outputText( '[vagina], digging into the slippery slit as a tingle of magic spreads through it and into your core, thickening some organ inside you' );
		} else {
			EngineCore.outputText( 'taint, rubbing it as a tingle of electric need phases through your ' + CoC.getInstance().player.skinFurScales() + ' to assault your swelling prostate and seminal vesicles' );
		}
		EngineCore.outputText( ', and in that moment, you lose all ability to hold out.  You\'re cumming, and you\'re cumming now.' );
		EngineCore.outputText( '\n\nLooking on in awe, you watch your gigantic urethra slowly dilate, opening wide to reveal the onrushing torrent of sticky, white goo, mere moments before it launches straight into your face, hair, and mouth.' );
		if( CoC.getInstance().player.biggestCockLength() >= CoC.getInstance().player.tallness / 1.6 ) {
			EngineCore.outputText( '  The Cum Witch smiles as she holds it, bending it to make sure the overlong shaft deposits its thick load on your ' + CoC.getInstance().player.face() + ' where it belongs.' );
		}
		EngineCore.outputText( '  Your captor is still humping it even as you cum, moaning as the bulges of copious cream press on her smaller boner.  Her visage is alight with ecstasy, and her heavy nipples are dragging on your [chest] as she begins to grunt, her motions going jerky in her ecstasy.' );
		EngineCore.outputText( '\n\nOozing jism splatters into you with increasing frequency as your supercharged reproductive system asserts itself, thick globs dripping from your chin even as the Cum Witch peaks, adding her own virile sprays into the semen-shower.  Your ' + Descriptors.hairDescript() + ' mats down as it\'s soaked with the alabaster sperm, so much so that it dangles in sticky ringlets from your ears.  It feels so good that you start to moan, but that\'s immediately silenced by a cheek-bulging seed-eruption.  You\'re not sure whether it\'s yours or hers, but all you can do is swallow it down and try to breathe through the salty mask as it\'s piled on thicker and thicker.  There\'s so much that it\'s forming a hot, wet puddle behind you and dripping down your [chest], making the buzzing stones squish and splash it about as they help to bring you off.' );
		EngineCore.outputText( '\n\nThe Cum Witch climbs off you after what must be a minute of non-stop bukkake, but you keep cumming, too addled with pleasure to move your own spooge-hose.  Eyes rolling back in bliss, you cum yourself into unconsciousness while the victorious futanari gets dressed, stopping to rub a last few twinges of magic into you before she goes.  She wouldn\'t want you to run out of jism early, now would she?' );
		//Cum and ballsize boost if appropriate;
		if( CoC.getInstance().player.cumQ() < 1000 ) {
			CoC.getInstance().player.cumMultiplier += 5;
		} else {
			CoC.getInstance().player.cumMultiplier += 2;
		}
		if( CoC.getInstance().player.ballSize < 7 ) {
			CoC.getInstance().player.ballSize++;
		}
		CoC.getInstance().player.orgasm();
		EngineCore.dynStats( 'lib', 1, 'sen', 1 );
		Combat.cleanupAfterCombat();
	};
	//Avoid The Too Big Loss Facial;
	DungeonSandWitch.prototype.tooBigCumWitchLossNoFacial = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'You tell her you\'d rather not get a face full of her spunk.  Judging by the sour look on her face, she seems to be honestly surprised by your choice, like she never expected that anyone would choose not to get a faceful of her spunk.  This bitch clearly has spent too much time with her nymphomaniac sisters.' );
		EngineCore.outputText( '\n\nShe growls, "<i>Your loss, ' + CoC.getInstance().player.mf( 'handsome', 'beautiful' ) + '.  I\'m still gonna, gonna... get mine.</i>"  The Cum Witch forcibly twists her hips to angle your [cock biggest] off to the side, shuddering as her black cock convulses on top of you, spraying a fresh gout of goo on top of you, and she hasn\'t even cum yet.  Her balls are quaking needily, pulsing and bouncing as they prepare to blow' );
		if( CoC.getInstance().player.balls > 0 ) {
			EngineCore.outputText( ', just like your own' );
		}
		EngineCore.outputText( ', and she smiles cruelly as her feet press harder on you, suddenly tingling with supernatural forces.  Almost painful heat floods through your middle as she frots you harder and harder, inadvertently tit-fucking your immense erection all the way to orgasm.' );
		EngineCore.outputText( '\n\nYour first squirt is a nice, long thick spray that immediately soaks into the sand.  The second is much smaller, only a small, slimy trail.  Exploding atop you, the Cum Witch\'s boner hoses out a globule of cum so big that it breaks apart under its own weight and drops down both sides of your boner on its path to the sands.  Your dick is completely soaked in her jism at this point, and though less noticeable, her girl-cum is dripping down your [sheath] and [hips], marking you with her sweet, feminine scent while her salty goo drenches your bigger boner.  Her sprays get more voluminous as yours dwindle, until you\'re cumming out pathetic, tiny white droplets so small that it takes a few of them to get big enough to drip down to the ground.' );
		EngineCore.outputText( '\n\nExhaustion takes you as you finish, causing you to fall into a fitful slumber while the Cum Witch finishes pumping what looks like a lake out of her wang.  Just how much of your potency did she steal?' );
		//Big-ish cum multiplier loss!  Lose some ball size if they're huge;
		if( CoC.getInstance().player.ballSize > 5 ) {
			CoC.getInstance().player.ballSize -= Math.round( CoC.getInstance().player.ballSize * 0.333 );
		}
		CoC.getInstance().player.cumMultiplier = Math.round( CoC.getInstance().player.cumMultiplier * 0.75 );
		CoC.getInstance().player.orgasm();
		Combat.cleanupAfterCombat();
	};
	//TDM's generic loss to cum witch scene;
	//requires that the PC have a dick that can fit inside the cum witch's vagina.  The scene can be used with herms.;
	DungeonSandWitch.prototype.TDMsLoseToCumWitchScene = function() {
		EngineCore.clearOutput();
		var x = CoC.getInstance().player.cockThatFits( CoC.getInstance().monster.vaginalCapacity() );
		if( x < 0 ) {
			x = CoC.getInstance().player.smallestCockIndex();
		}
		EngineCore.outputText( 'Robes already lay discarded nearby and the cum witch stands triumphantly over your body.  A bobbing cock brushes up next to your face, quite erect and eager for service.  The hermaphrodite doesn\'t bother with conversation and roughly forces you onto your back.  She snaps her fingers; curving bands of stone snap out of the ground, curling over your limbs and binding you securely to the ground.  It\'s clear that you\'re about to get fucked, whether you like it or not.  Looking up, a cryptic smile plays across the black woman\'s visage as she deftly removes your [armor].  In an instant, your ' + Descriptors.cockDescript( x ) + ' has been mounted.' );
		//multicock section;
		//if the PC has more than one dick, this witch puts hoods on them, which make them feel like they don't exist.;
		if( CoC.getInstance().player.cockTotal() > 1 ) {
			EngineCore.outputText( '\n\nWith your ' + Descriptors.cockDescript( x ) + ' well entrenched in her singular vagina, the witch reaches over and pulls several small cloth pouches out of her discarded robes.  She smiles when she notices your confusion, but refrains from giving an explanation before putting a pouch onto ' );
			//if (cocks = 2);
			if( CoC.getInstance().player.cockTotal() === 2 ) {
				EngineCore.outputText( 'your other phallus.' );
			}//[if (cocks > 2);
			else {
				EngineCore.outputText( 'the rest of your ' + CoC.getInstance().player.multiCockDescriptLight() + '.' );
			}
			EngineCore.outputText( '  The futa on top of you continues to smile mysteriously, and spares not another moment of her attention on your genitals.' );
		}
		EngineCore.outputText( '\n\nThat finished, your assailant assumes an air of concentration for a moment before saying, "<i>Enim emoceb lliw nemes dna doohnam ruoy!</i>"  Magic strikes you, and suddenly [eachCock] goes numb, then you become aware of an alien appendage.  It feels like it is coming out of your crotch, and it feels like a cock, but it isn\'t ' );
		if( CoC.getInstance().player.cockTotal() > 1 ) {
			EngineCore.outputText( 'one of ' );
		}
		EngineCore.outputText( 'yours...' );
		EngineCore.outputText( '\n\nLooking up once more at the cum witch\'s mysterious knowing smile, a sense of fear slithers down your spine.  She gently taps her nose with one of her long, black fingers, then leads you down to her bobbing prick.  She gives it a gentle stroke, and you realize just what you\'ve become aware of.  You\'re feeling her cock as if it were your own!  Based on the laughter of the dark-skinned spellcaster, your amazement and surprise are painted on your face, clear for all to see.' );
		EngineCore.outputText( '\n\nThe fearsome futanari proceeds to tease the head of her cock, drawing a small circle around the tip.  You find yourself trying to buck your body up into hers in response.  Unfortunately, this does nothing to increase the stimulation on her phallus, and you still can\'t feel anything from your own.  A view of her large breasts bouncing in front of you is your only reward.  "<i>Are you frustrated?</i>" she asks you, still smiling.  "<i>Do you want to get off?</i>"  The teasing continues, only doing the slightest of stimulations on her length.  With an angry grunt you struggle against the sandstone bonds holding you down, desperately trying to get more stimulation.  "<i>Oh you are!  Good.  Then I have some good news for you.  You will in a moment, don\'t worry.</i>"  You\'re getting really sick of seeing that same cryptic smile plastered all over her face.' );
		EngineCore.outputText( '\n\nYour attention is suddenly drawn down to ' );
		if( CoC.getInstance().player.balls > 0 ) {
			EngineCore.outputText( 'the one part of your manhood that you can still feel, your [sack].' );
		} else {
			EngineCore.outputText( 'a part of your body just behind and above the base of [eachCock], probably your prostate.' );
		}
		EngineCore.outputText( '\n\nIt feels odd.  It\'s tingling and feels tight and compressed, like a spring wound up too far.  You feel as if all of your cum is being squeezed out of your body, but it isn\'t an orgasm; more like you\'re building up towards something much bigger.  It\'s a sensation that\'s really hard to describe, but it does feel good.' );
		EngineCore.outputText( '\n\nLeaning in close, her face is only inches away; a gentle whisper comes from her lips, "<i>Looks like you\'re ready now.  Do you still want to cum?</i>"  When you indicate in the affirmative, she snaps her fingers and the bindings around your arms are released.  "<i>Then let\'s see how well you can work my meat,</i>" she proclaims while returning to her old pose and licking her lips.' );
		//end of the foreplay?  I guess now we have handjobs!  I've actually never written a handjob scene before... I don't actually know how to go from here!;
		EngineCore.outputText( '\n\nYou grip her length with both hands firmly and start jerking it in earnest.  At last, the stimulation that you wanted so much is literally at your fingertips!  Large drops of pre start to flow out of the tip, and the sorcerous seductress encourages you to use her fluids for added lubrication.  Eager to get any more sensation you can from this wonderful cock bobbing and bouncing in front of you, you put every drop of pre that escapes to work accomplishing that very purpose.' );
		EngineCore.outputText( '\n\nWorking that black bar is quite an experience.  It feels very different from your ' + CoC.getInstance().player.multiCockDescriptLight() + '.  ' );
		//[if (sensitivity < 70)];
		if( CoC.getInstance().player.sens < 70 ) {
			EngineCore.outputText( 'It\'s more sensitive than yours, for one thing, and' );
		} else {
			EngineCore.outputText( 'It isn\'t as sensitive as yours {are/is}, for one thing, but' );
		}
		EngineCore.outputText( ' the flow of her constantly dribbling pre, tingling with magical power is something that you\'ve never felt before.  Making things more interesting, the position that you\'re in leaves your grip on her dick remarkably different than how you\'d grab your own while masturbating.  Of course what is important is that you want to rub every last inch of her lovely length, and feel every second of it through her strange spell.  The feeling of your cum being sucked out of your [balls] only makes the whole experience feel even better.' );
		EngineCore.outputText( '\n\nA loud slapping noise fills the air, and you notice that you\'re actually trying to thrust up into the cum witch\'s pussy with your ' + Descriptors.cockDescript( x ) + ', despite the fact that you can\'t feel it.  You stop yourself, only to have the witch start to gyrate her hips, spinning you around her insides with your ' + Descriptors.cockDescript( x ) + ', while simultaniously thrusting her cock through your hands.  You guess that while you can\'t feel your shaft inside her, she certainly can.' );
		//orgasmsssss;
		EngineCore.outputText( '\n\nNow nearing your peak, the witch commands you to take your hands off her length; you do so reluctantly.  Things seem to pass in slow-motion to you, black hands move down and grip the cock you were just jacking firmly.  The witch leans back.  She aims her hermhood skyward, and a massive gout of spunk flies into the air.' );
		//cum volume variations;
		if( CoC.getInstance().player.cumQ() < 200 ) {
			EngineCore.outputText( '\n\nMany streams of jizz fly up several feet before showering down on the ground and your lust locked bodies.  Anything that hits the sand is quickly absorbed into the hungry desert, while you and the dark skinned woman are covered liberally in her semen.  That cum couldn\'t have been just hers.  You swear what she pulled out of you was mixed in there as well.  It felt like she drew out a lot more than you\'d usually let out in a single ejaculation for sure.  You feel completely drained, ' );
		} else if( CoC.getInstance().player.cumQ() < 3000 ) {
			EngineCore.outputText( '\n\nThe flow of jizz pumping out of your collective cock lasts for at least half a minute!  A bizarre white fountain of spunk rains down around you, and onto you.  While you and the dark-skinned woman are completely drenched in the stuff, the desert sands look almost completely dry afterwards.  You end up receiving a look of admiration for your generous contribution.  Nodding through your sticky mask, you\'re somehow sure that most of that was the signature megaload of your [balls], though somehow, it was even more than you usually let go.  Your perverse partner drained you pretty good, ' );
		} else {
			EngineCore.outputText( '\n\nEverything goes white - there is no other way to say it.  The sensations have overpowered your senses, and it feels as though your very life is being pumped out of that damned cock.  You don\'t know how long it goes on for, but you know that you cum for minutes, at least.  The experience leaves your whole body drenched in hot, sticky fluid.  The incredible quantity of spunk you normally let out combined with the effects of the witch\'s strange spell has awoken what feels like the wrath of a jizz god, and you love every second of it.[pg]When it finally ends, you wipe the spunk from your face, and you\'re very surprised to see the last of the cum that didn\'t fall on the both of you quickly absorbing into the desert sands.  It feels as if you\'re on death\'s door, completely drained of everything, ' );
		}
		if( EngineCore.silly() ) {
			EngineCore.outputText( 'in both body and in [balls].' );
		} else {
			EngineCore.outputText( 'in both body, and in spirit.' );
		}

		EngineCore.outputText( '\n\nThe woman covered in your combined spunk rises up off of your body and dons her significantly whiter robes.  She wipes off her face, revealing that same cryptic, knowing smile once more, before gently touching your head and whispering something in your ear.  Another spell grips your body, and you drift off into a deep sleep.' );
		//Decrease PC's strength by 2 for every digit of cum production they have after 100 (I can provide an algorithm for that if you need it, it is very simple), set lust to 0, increase cum production multiplier by 1;
		CoC.getInstance().player.orgasm();
		EngineCore.dynStats( 'str', -1 );
		CoC.getInstance().player.cumMultiplier++;
		if( CoC.getInstance().player.cumQ() >= 200 ) {
			EngineCore.dynStats( 'str', -1 );
		}
		if( CoC.getInstance().player.cumQ() >= 3000 ) {
			EngineCore.dynStats( 'str', -1 );
		}
		//Usual loss text+gem loss.;
		Combat.cleanupAfterCombat();
	};

	DungeonSandWitch.prototype.defeatedByCumWitch = function() {
		if( OnLoadVariables.dungeonLoc ) {
			//Dudally-diddly.;
			if( CoC.getInstance().player.hasCock() && (CoC.getInstance().player.gender === 1 || Utils.rand( 2 ) === 0) ) {
				this.cumWitchCumPumpBadEnd();
			}//Ladies and Genderless;
			else {
				this.turnIntoASammitch();
			}
		} else {
			if( CoC.getInstance().player.hasCock() && (!CoC.getInstance().player.hasVagina() || Utils.rand( 2 ) === 0) ) {
				if( Utils.rand( 2 ) === 0 ) {
					this.TDMsLoseToCumWitchScene();
				} else {
					this.repeatLoseToCumWitchForDudes();
				}
			} else if( CoC.getInstance().player.hasVagina() ) {
				this.savinMakesAwesomeFemdom();
			} else {
				Combat.cleanupAfterCombat();
			}
		}
	};
	//*Victory Intro;
	DungeonSandWitch.prototype.cumWitchDefeated = function() {
		EngineCore.clearOutput();
		//(HP);
		if( CoC.getInstance().monster.HP < 1 ) {
			EngineCore.outputText( 'The chocolate-skinned witch collapses down onto her hands and knees with the tattered remnants of her robes swirling about her.  With her clothing destroyed, you\'re treated to the perfect view of her semi-erect cock and swollen testes swaying enticingly beneath her, paired with the glimmering wetness of her juicy cunny - also on display.  Her udder-like melons sway and jiggle in sympathy to her uncoordinated swaying.  She grumbles, "<i>You\'ve beaten me, interloper...</i>"' );
		} else {
			EngineCore.outputText( 'The chocolate-skinned witch collapses down onto her hands and knees, shredding her robes as she goes.  Her throbbing-hard cock drips with precum above her quaking testes while her equally enticing pussy looks positively soaked with feminine lubricants.  She rolls onto her back, tits jiggling wildly, and jams both her hands into her groin, masturbating furiously.  Panting, the witch moans, "<i>You win... ooooohhh...  Come over here and fuck me!  Please!</i>"\n\nWell, she did ask nicely...' );
		}
		CoC.getInstance().flags[ kFLAGS.CUM_WITCH_DEFEATED ] = 1;
		EngineCore.menu();
		if( CoC.getInstance().player.hasCock() ) {
			//*Male 'Too Big' Victory Sex;
			if( CoC.getInstance().player.biggestCockArea() > CoC.getInstance().monster.vaginalCapacity() ) {
				EngineCore.addButton( 0, 'Too Big Fuck', this.maleTooBigVictorySex );
			}
			//*Male Victory Sex;
			if( CoC.getInstance().player.cockThatFits( CoC.getInstance().monster.vaginalCapacity() ) >= 0 ) {
				EngineCore.addButton( 1, 'Fuck Her', this.menFuckUpSomeCumWitch );
			}
		}
		//Tentacle Victory Gangbang;
		//3+ Tentas;
		if( CoC.getInstance().player.tentacleCocks() >= 3 ) {
			EngineCore.addButton( 2, 'Tentacles', this.tentacleVictoryGangbangCumWitch );
		}
		//Female Victory Sex;
		if( CoC.getInstance().player.hasVagina() ) {
			EngineCore.addButton( 3, 'Ladysex', this.ladyVictorySex );
		}
		if( CoC.getInstance().isInCombat() ) {
			if( CoC.getInstance().monster.HP >= 1 ) {
				EngineCore.addButton( 9, 'Leave', this.declineSandWitch );
			} else {
				EngineCore.addButton( 9, 'Leave', Combat.cleanupAfterCombat );
			}
		} else {
			EngineCore.addButton( 9, 'Back', EventParser.playerMenu );
		}
	};
	//*Decline Sex;
	DungeonSandWitch.prototype.declineSandWitch = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'Dusting yourself off, you lower your [weapon] and leave the cum witch to recover from the humiliation of losing to you.  The haunted, hungry look in her eyes leaves little doubt that she\'ll challenge you again or that she still wants to fuck you.  For now, she slips down into her own puddled cum, idly touching herself.' );
		if( CoC.getInstance().isInCombat() ) {
			Combat.cleanupAfterCombat();
		} else {
			EngineCore.doNext( EventParser.playerMenu );
		}
	};
	//*Male Victory Sex;
	DungeonSandWitch.prototype.menFuckUpSomeCumWitch = function() {
		EngineCore.clearOutput();
		var x = CoC.getInstance().player.cockThatFits( CoC.getInstance().monster.vaginalCapacity() );
		var y = CoC.getInstance().player.cockThatFits2( CoC.getInstance().monster.vaginalCapacity() );
		EngineCore.outputText( 'You shuck out of your [armor] in eager anticipation, [eachCock] aleady ' );
		if( CoC.getInstance().player.lust < 50 ) {
			EngineCore.outputText( 'half-hard' );
		} else {
			EngineCore.outputText( 'rock-hard' );
		}
		EngineCore.outputText( ' and pulsing with growing readiness.  The cum witch looks up at you with disdain, but the rigidity of her shaft and sloppy wetness of her flushed quim leave no doubt as to her state.   Her body blushes honestly as you reposition her, spreading her legs nice and wide.  You have to lift her hefty sack to expose the thick, wet lips of her pussy.  Jumping in response, her fat cock oozes a trickle of precum onto her dusky belly, oiling her dusky skin into a sensual shine.' );
		EngineCore.outputText( '\n\n"<i>You think THAT compares to m-my wondrous... perfect penis?  I\'ve knocked up more women than youUUU-</i>" she taunts until you cut her off with a well-placed thrust.  [OneCock] vanishes ' );
		if( CoC.getInstance().player.cockThatFits( CoC.getInstance().monster.vaginalCapacity() ) < 0 ) {
			EngineCore.outputText( 'most of' );
		} else {
			EngineCore.outputText( 'all of the way' );
		}
		EngineCore.outputText( ' inside her, sheathed deep in her under-used twat.  Her tight passage fits around your ' + Descriptors.cockDescript( x ) + ' like a custom-made glove, a slippery warm embrace that threatens to rob you of your very reason.  The witch begins pumping her ebony cock along with the motions of your hips, throwing her head back in wordless pleasure that only a true hermaphrodite can experience.' );
		if( CoC.getInstance().player.hasVagina() ) {
			EngineCore.outputText( '  Two can play at that game.' );
		}
		//Herm sexback;
		if( CoC.getInstance().player.gender === 3 ) {
			EngineCore.outputText( '\n\nYou pivot around so your [butt] is facing her and your dick is spearing straight down into her honeyed vise.  It\'s less pleasurable than your previous position, at least until you yank the dickgirl\'s cock out of her hands and ram it into your slit, fucking both her virile tool and fertile cunt at the same time.  Your futanari lover finally gives in the pleasures of the act and stops resisting.  She begs, "<i>Yes, don\'t stop!  Fucking ride me!  By the mothers, that\'s good!</i>" while her hips lift against your, slamming hard into your groin with echoing force.' );
			//cuntchange;
			CoC.getInstance().player.cuntChange( CoC.getInstance().monster.biggestCockArea(), true, true, false );
			EngineCore.outputText( '\n\nDetermined to ride this rebellious cow into submission, you match her motions thrust for thrust and pump for pump, pushing harder and harder into the ground with each contact.  In no time, you\'re both covered in a fine sheen of sweat, recklessly rutting with the force of four animals trapped in two meager bodies.  Daringly, the witch begins to spank your [butt] with each concussive clap of crotches, only adding to the cacophony of noisy slaps.  You can\'t do anything but scowl in displeasure due to your positioning, even though the hits make your cock throb and your pussy clench.' );
			EngineCore.outputText( '\n\n' );
			if( CoC.getInstance().player.balls > 0 ) {
				EngineCore.outputText( 'Your sweaty nutsacks slide over each other while you fuck, compressing together into a mass of sweaty orbs twitching against each other in a competition to disgorge their frothy load before the other.' );
			} else {
				EngineCore.outputText( 'Her sweaty nutsack glides over your ' + CoC.getInstance().player.skinFurScales() + ' as you fuck, compressing and twitching against you as it begs to discharge its frothy load.' );
			}

			EngineCore.outputText( '\n\nFortunately, the feverish fucking reaches a simultaneous crescendo with a bone-jarring clap of sex to sex, male and female joined together in perfect, ecstatic harmony.  The brutal ass-slapping immediately turns into passionate, worshipful groping as the witch cums with you.  Both of your cum-bloated tools explode inside the other, disgorging thick flows of seed to paint the matching womb white, balls visibly shrinking as they empty at last.' );
			if( CoC.getInstance().player.cumQ() > 2000 ) {
				EngineCore.outputText( '  Of course, you outlast even the jizz-witch\'s magics, plugging her so full of semen that her belly rounds into a gravid orb while yours remains only slightly bloated.' );
			} else if( CoC.getInstance().player.cumQ() > 1000 ) {
				EngineCore.outputText( '  Of course, you both manage to bulge each other\'s bellies with sexual discharge.' );
			} else {
				EngineCore.outputText( '  Of course, she cums far longer and harder than you, plugging your belly full of semen until it has a slightly fecund curve to it.' );
			}

			EngineCore.outputText( '\n\nRising slowly, you withdraw yourself from the goo-glazed pussy beneath you and try to ignore the matching river of white that pours out from betwixt your thighs.  You make sure to lean over your onyx lover, salting her with her own dripping seed until the flow slows to a trickle.  She meekly protests at first, then gives up with a lusty sigh, smearing her skin with pristine white as her mind slides back into the gutter.  You make sure to admire your work while you get dressed.' );
			//(cum, then +5 lust) {preg check for sammitches};
			//sand witch preg;
			CoC.getInstance().player.knockUp( PregnancyStore.PREGNANCY_SAND_WITCH, PregnancyStore.INCUBATION_SAND_WITCH, 90 );
			CoC.getInstance().player.orgasm();
			EngineCore.dynStats( 'lus', 5 );
		}
		//DP Males;
		else if( y >= 0 ) {
			EngineCore.outputText( '\n\nScowling, you pull her hand away from her bouncing, super-hard rod and say, "<i>You want to feel twice the pleasure?  Then feel THIS!</i>"  You punctuate the declaration by pulling back and aligning your ' + Descriptors.cockDescript( y ) + ' with her back-door, slamming it home without waiting.  She winces in pain and shock, looking up at you aghast but wordless.  Smirking, you twirl a thick lock of her blonde hair about your fist and yank her up for a kiss, tonguing her mouth with the same brutal, forceful intensity that now violates her anus.  The woman screams in pleasure and pain, tongue-fucking back with hateful passion as her muffled cries fade away.' );
			EngineCore.outputText( '\n\nThough she still grapples with you, her silken tunnel is soon anxiously squeezing your ' + Descriptors.cockDescript( x ) + ', and her tight pucker gradually loosens.  Even relaxed, it still flutters with a tight warmth that far exceeds her pussy.  You could almost grow addicted to it.  The hapless brown-skinned goddess milks the ' + Descriptors.cockDescript( y ) + ' in her butt while her engorged nipples press against your own, sliding slickly over your sweaty skin.  You bite her lip and pound her all the harder, mounting her with hard pounding strokes.  This is entirely about getting YOUR ' + CoC.getInstance().player.multiCockDescriptLight() + ' off, and you don\'t worry in the least about her pleasure.' );
			EngineCore.outputText( '\n\nThe witch weakly tries to grab at her cock again while you brutalize her ass, but you crudely slap one of her breasts.  She squeezes and drips thick ribbons of pre-cum at the harsh contact.  Well, if that\'s what she wants...  You begin slapping her tits in time with your thrusts, pounding the mammaries until the dusky, sweat-oiled skin is flushed red in irritation.  Her nipples seem even bigger and harder from the abuse, and once you tire of the pleasant jiggle your strikes induce, you grab one of the chest-buds and pinch, hard.' );
			EngineCore.outputText( '\n\nA torrent of thick herm-cream spouts from the woman\'s neglected erection as you utterly abuse and humiliate her.  Taking this as your signal to go balls out, you twist that nipple sideways and rut her like a ' + CoC.getInstance().player.mf( 'man', 'woman' ) + ' possessed, slapping both cocks into her spasming holes non-stop until you feel the heat surging in your loins, ready to explode inside her.' );
			EngineCore.outputText( '\n\nYou ask, "<i>Are you ready, bitch?</i>" to the blubbering, orgasmic wreck, and when she fails to answer, you yell out in pleasure and cum.  Jizz ' );
			if( CoC.getInstance().player.cumQ() < 250 ) {
				EngineCore.outputText( 'pours out of your dual cum-slits, making a sloppy mess of both holes.' );
			} else if( CoC.getInstance().player.cumQ() < 500 ) {
				EngineCore.outputText( 'gushes out of your dual cum-slits, soaking both holes in and out with pearly white.' );
			} else if( CoC.getInstance().player.cumQ() < 1000 ) {
				EngineCore.outputText( 'gushes out with incredible force from your dual cum-slits, quickly plugging both holes so full of seed that the witch\'s belly slowly rises, cum-inflated.' );
			} else {
				EngineCore.outputText( 'washes out of your dual cum-slits in a tidal wave, flooding the hungry holes with your virile seed.  You cum and cum, spunking up the witch\'s belly.  First it bulges slightly, but all too soon you have it rounded into a pregnant dome.' );
			}
			EngineCore.outputText( '  The bouncing girl-cock above the woman\'s gushing pussy does a fine job of painting her belly and bust white.  It spurts rope after rope onto her chocolate-toned flesh, and soon she looks more like an icing-drizzled tart than a formidable foe.' );
			EngineCore.outputText( '\n\nFeeling empty and sated, you unsheath your double dongs to reveal the fruits of your labors - a pair of juicy creampies, one vertical, the other small, puckered, and oozing.' );
			CoC.getInstance().player.orgasm();
		}
		//Regular Dicking;
		else {
			EngineCore.outputText( '\n\nPulling the disobedient wench\'s hand away, you scold, "<i>Tsk tsk, naughty bitches don\'t get to have cocks.</i>"  She pouts like a petulant child and idly blows a lock of blonde hair out of her face, sticking her lower lip out even further. Laughing, you pinch her cheek and tease, "<i>Come on, if you wanted to fuck for fun, you shouldn\'t have tried to force yourself at me.  Until you learn how to be polite, your dick is mine to control' );
			//(silly:) EngineCore.outputText(', and I don\'t want it.  I think it\'s messy');;
			EngineCore.outputText( '.</i>"' );
			EngineCore.outputText( '\n\nThe spellcaster\'s lube-oozing entrance seems to get wetter at your authoritative denial, so you keep at it, fucking her slowly and idly batting away any attempt from the woman to touch herself.  It isn\'t until she gives up and gently grabs your shoulders that you give her a smile ' );
			if( CoC.getInstance().player.cor < 50 ) {
				EngineCore.outputText( 'and a hint of compassion' );
			} else {
				EngineCore.outputText( 'and finally deign to let her have some pleasure' );
			}
			EngineCore.outputText( '.  You gradually increase the tempo of your lovemaking and let your hand lazily drift lower, grabbing the witch by her soft, supple thigh.  Her skin is warm and flushed (or as flushed as ebony skin can get), and the higher your fingers reach, the damper it gets.  Gently, you prod around her lips and your own maleness to find the hardness of clit.' );
			EngineCore.outputText( '\n\nThose beautiful onyx thighs cross behind your back as soon as you bump the enchantress\'s buzzer.  One heel hooks over the other, and they flex encouraging, begging you to pull deeper inside the sexy black minx\'s twat.  Your cock is in heaven, held deep in a steamy velvet embrace that caresses it with the touch only a skilled lover provide.  Breathing heavily, you lean over the woman as you rhythmically fuck her.  Her arms entwine around your neck, caressing your shoulders and back with previously unseen tenderness.' );
			EngineCore.outputText( '\n\nYou kiss up the lady\'s lithe neck to her ear and whisper, "<i>That\'s better,</i>" just before giving her lobe a soft nibble.  She looks up at you when you pull back, partly confused and more than a little lust-lost, licking her lips and asking, "<i>Harder... please?</i>"' );
			EngineCore.outputText( '\n\nBrushing back the blond tresses, you give a gentle nod and begin to move faster, sawing your ' + Descriptors.cockDescript( x ) + ' through the velvet tunnel faster and faster.  She arches her back hard enough to lift her tits to your mouth, and you greedily suckle one, allowing your fingers to dive down into her spasming cleft to rub her button.  Throughout it all, the witch\'s member is fitfully bouncing and pulsing as if desperate for attention.  You ignore it and the steadily growing puddle of pre, focused utterly on showing the woman what it means to love as a woman.' );
			EngineCore.outputText( '\n\nHer legs tremble behind you, gradually losing their grip.  The witch looks pleadingly looks up and begs, "<i>I\'m gonna... p-p-please... can I - OOooooh... c-can I cum!?  I\'m so close... just... just let me cum!</i>"  Being none too far from climax yourself, you graciously nod and slam your ' + Descriptors.cockDescript( x ) + ' deep into its new home, crushing the witch\'s soft buns into your thighs.  She squeals happily and seizes up, her heels pressing hard into your back, trapping you inside her.  At the same time, her thick tool lifts an inch off her belly and thickens, the urethra bulging out for a moment before it begins to convulse and spray her goo over her tits and face. Her pussy drenches your loins in fragrant female goo, and you finally let go, pushing harder against her even though you\'re already dick-deep in quim.  Your ' + Descriptors.cockDescript( x ) + ' unloads your thick gouts of spunk without delay' );
			if( CoC.getInstance().player.cumQ() < 700 ) {
				EngineCore.outputText( ', spurting with unceasing quantity until she\'s absolutely flooded with jizz and a little bulgy around the middle.' );
			} else {
				EngineCore.outputText( ', spooging up her cunny until it\'s completely flooded, her belly bloated into a rounded dome.' );
			}
			if( CoC.getInstance().player.cumQ() >= 1500 ) {
				EngineCore.outputText( '  You keep going beyond that, but there\'s just no room, and spouts of semen spurt from the woman\'s poor, over-filled twat.' );
			}
			EngineCore.outputText( '\n\nThe witch sighs and idly rubs her ' );
			if( CoC.getInstance().player.cumQ() >= 700 ) {
				EngineCore.outputText( 'swollen ' );
			}
			EngineCore.outputText( 'tummy, smearing her own wasted goo into her skin as you withdraw and re-dress.' );
			if( CoC.getInstance().player.cor < 33 ) {
				EngineCore.outputText( '  You hope she learned something from the experience, but knowing most people in this strange land, she\'ll go right back to her rotten ways.' );
			} else if( CoC.getInstance().player.cor < 66 ) {
				EngineCore.outputText( '  You wonder if she\'ll learn anything from this and shrug nonchalantly.  Who cares?' );
			} else {
				EngineCore.outputText( '  You smirk as you wonder if she\'ll learn anything from this.  You hope not - it\'s a fun lesson to teach.' );
			}
			CoC.getInstance().player.orgasm();
		}
		if( OnLoadVariables.dungeonLoc ) {
			if( CoC.getInstance().isInCombat() ) {
				Combat.cleanupAfterCombat();
			} else {
				EngineCore.doNext( EventParser.playerMenu );
			}
		} else {
			if( CoC.getInstance().isInCombat() ) {
				Combat.cleanupAfterCombat();
			} else {
				EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
			}
		}
	};
	//*Male 'Too Big' Victory Sex;
	DungeonSandWitch.prototype.maleTooBigVictorySex = function() {
		EngineCore.clearOutput();
		var x = CoC.getInstance().player.biggestCockIndex();
		EngineCore.outputText( 'You slip out of your [armor] with deliberate slowness, the tight, constraining pressure on your massive tool shifting in the most delicious way.  The uncomfortable yet tantalizing weight lessens gradually, and at the first hint of freedom, your ' + Descriptors.cockDescript( x ) + ' flops free to taste the freedom of the open air, nearly doubling in size as your blood surges through it.  The witch\'s eyes look up in confusion at your prodigious proportions and widen in shock.' );
		EngineCore.outputText( '\n\n"<i>Y-you\'re bigger than me...</i>" she drawls, her mouth hanging open in shock at the declaration.  She covers the hanging orifice with her palm, lamely trying to conceal her shock at your gargantuan boner.' );
		EngineCore.outputText( '\n\nGripping yourself by the root, you casually aim it forward and let it grow until it brushes up on her nose, your urethra threatening to swallow it whole.  The ebon sorceress\'s pupils cross to focus on your shaft, and her visage takes on a hungry, somewhat confused look.  She protests, "<i>This... this will never fit inside me!</i>"  Glancing up at you with worry, she caresses the underside.  "<i>I\'m sure we can find another way...</i>"' );
		EngineCore.outputText( '\n\nYou push the witch away roughly, flat onto her back.  She lands flat with fear in her eyes and nervously folds her arms across her exposed, jiggling breasts.  You ignore her, firmly grasping her thighs to unceremoniously yank them apart and expose the pink-tinged folds of her flower.  Your dick flops into place now that your supporting hands are gone, draping down to obscure the black flesh with supple, throbbing erection.  The witch pulls her arms out from under your mass, which releases her tits and allows them to drape to the sides, molding around the heavy cock atop her.' );
		EngineCore.outputText( '\n\nThe enchantress gives you a smokey look when you begin to move, giving up cute gasps of bliss whenever one of your veins catches on her clit or presses her prick harder into her belly.  Your member quickly grows slick with witch-pre and girl-lube, so when you tug her nipples to get more tit-contact on your pole, it glides right through.  Your lust-dilated urethra disgorges a thick bead of pre onto her chin as you command, "<i>Hold them there.</i>"' );
		EngineCore.outputText( '\n\nThe witch smiles and answers, "<i>I can do one better!</i>"  She gestures with her fingers, wreathing them in pink flames, and then she presses on her rapidly slickening bosom.  As the dark fingers withdraw, pink silhouttes remain, supporting the dick-hugging mammaries for her, and leaving her hands free to caress your ' + CoC.getInstance().player.cockHead( x ) );
		if( CoC.getInstance().player.balls > 0 ) {
			EngineCore.outputText( ' or fondle your [balls]' );
		}
		EngineCore.outputText( '.  You take her feet in hand and lift them high, bringing the weight of her supple thighs to bear around your [sheath].  With so much smooth skin surrounding you, the pleasure is intense, almost mind-bendingly good.  The witch\'s hands dance over your shaft, shooting tingles of pleasure up it and into your [balls], and each time you pump it forward, she smears your pre over the head with her plump, dark lips.' );
		EngineCore.outputText( '\n\nDuring one of the long, long pulls back, your cum-obsessed companion coos, "<i>Gods, keep going!  It\'s so - mrpPPHHH.</i>"  You plug her rambling with fat cock and marvel when her luscious, sucking cock-pillows reshape into a suctioning \'o\'.  You can feel her drawing pre-cum straight through your urethra, all the way to her bulging cheeks.  When she releases the vacuum to swallow, you pop free and slide back again, but you feel even more lusty, more full, more ready to cum than before.  The shadowy beauty smiles up through her low-hanging lashes with overflowing mirth.  You realize she\'s used her magic on you somehow, likely to boost the strength of your orgasm, but do you really mind the thought of bukkaking this blonde bitch in gratuitous waves of white?' );
		EngineCore.outputText( '\n\nYou thrust forward hard enough that the woman is forced to accept the first few inches of your ' + CoC.getInstance().player.cockHead( x ) + ' inside herself and swallow the thick gouts of clear pre-seed that spurt out with each convulsion of pleasure.  Her eyes cross, fluttering from pleasure.  When you pull back, she moans lasciviously, licking the last of your residue from your lips even as her inferior cock bulges underneath your own.  You\'re aware of some extra warmth and a slimy heat below - did she just cum?  You piston faster, enjoying the extra lubrication and confirming your suspicion.' );
		EngineCore.outputText( '\n\nJiggling gently as you fuck her, the witch\'s asscheeks are a suitable target for your roving hands, and you turn to kneed one, smacking the other.  Still cumming under your girthy cock, she crosses her heels to squeeze you with the whole of both her legs.  Her arms do like-wise, hugging the cum-coated cock tightly into the quaking tit-flesh.  The sorceress seems to be molding her entire body into a masturbation sleeve, and each time you slam your dick into her mouth, she sucks more hungrily upon it, drinking deeply of your essence.  Her eyes close more often than open, and each time her lips aren\'t locked on cock, she\'s moaning and creaming her belly.  Her frothing, everpresent cum drips down the sides of her body, but the sight of it only spurs you on to fuck her harder and faster, until you can spill your own mighty load.' );
		EngineCore.outputText( '\n\nThe cum-soaked, hermaphrodite witch tries to beg for your cum, but you shut her up with another load of bubbling pre.  As you watch her try to swallow it all, you feel a twinge of heat inside yourself' );
		if( CoC.getInstance().player.balls > 0 ) {
			EngineCore.outputText( ' along with your [balls] growing tight' );
		}
		EngineCore.outputText( ', and you know your climax has arrived.  You hammer your ' + Descriptors.cockDescript( x ) + ' back home, smashing it into her face.  The first wave seems to languish in your body forever, gradually stretching your urethra wide until you see your ' + CoC.getInstance().player.cockHead( x ) + ' swell and open.  A wave of white fills the bitch\'s mouth, soaks her hair, and washes over her shoulders.  There\'s so much of the alabaster gunk that ropes of it dangle around her head in a shroud, slowly dripping into a puddle onto the floor.  You inch back a bit, and let the next explosion take her in the tits.  The jism pours out like it water from a five gallon bucket, and the black tits are immediately wreathed in glistening white.' );
		EngineCore.outputText( '\n\nDemanding more friction, your ' + Descriptors.cockDescript( x ) + ' draws you right back up to her face, and this time she doesn\'t even try to catch it in her mouth.  The black slut simply plants a kiss just below your opening and meets your gaze as the alabaster flow takes her, holding eye contact for as long as she can.  Of course, that isn\'t long, and she\'s quickly drenched in spunk, her eyes glued shut with syrupy strings of spooge.' );
		EngineCore.outputText( '\n\nYou aren\'t done!  Not by a long shot!  This dark creature blessed you with unholy levels of virility, and you aren\'t going to waste it.  You stand away and butt your ' + CoC.getInstance().player.cockHead( x ) + ' into her nether-lips, and the remainder of your orgasm is injected directly into the woman\'s waiting womb.  Her belly rounds into a nice, gravid bump that carries her cock up with it, and you\'re given the first chance to see the results of the cum witch\'s own orgasm.  The dark, glossy cock is absolutely soaked in sperm, while her balls are wreathed in churned up, frothy cum.  Once you\'ve made her uterus a swollen dome, you aim up and drizzle the last ropes atop her pathetic, half-limp dick.' );
		EngineCore.outputText( '\n\nExhausted at last, you pat your ' + Descriptors.cockDescript( x ) + ' affectionately.  You\'d wipe it off on the witch\'s hair, if it wasn\'t messier than the ' + CoC.getInstance().player.skin() + ' you plan to clean.  She begins to lick her fingers and clean the stuff off her face.  You just laugh, and get dressed.  There\'s still much to do.' );
		CoC.getInstance().player.orgasm();
		if( OnLoadVariables.dungeonLoc ) {
			if( CoC.getInstance().isInCombat() ) {
				Combat.cleanupAfterCombat();
			} else {
				EngineCore.doNext( EventParser.playerMenu );
			}
		} else {
			if( CoC.getInstance().isInCombat() ) {
				Combat.cleanupAfterCombat();
			} else {
				EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
			}
		}
	};
	//Female Victory Sex;
	DungeonSandWitch.prototype.ladyVictorySex = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'You disrobe, casting aside the garments with a feminine sigh.  As soon as you expose yourself, the witch\'s eyes twinkle happily.  She caresses her stiff tool and tweaks one of her nipples as she watches you.  "<i>If you wanted to get fucked by little old me, all you had to do was bend over, honey.</i>"' );
		EngineCore.outputText( '\n\nPlanting a [foot] on her hip, you stop her fidgeting with a menacing glare.  "<i>You don\'t get to fuck me, witch.  I\'m fucking YOU,</i>"  you decree.  The well-endowed ganguro slut creases her pretty face into a frown, but meekly nods.  Her pussy still seems puffy and wet, and her cock hasn\'t shrunk at all.  You sidle up and push a few fingers into her twat, testing the waters.  As you expected, her fluids are as bountiful as most sand witch\'s breasts.  She squirms weakly at the attention, and her cock bobs happily on her belly.  You affectionally pat the dark-hued member and playfully tug on her ebon skin.' );
		EngineCore.outputText( '\n\n"<i>Ahh... don\'t tease me!</i>" she protests as she tries to wriggle away from your probing fingers.  You pinch your fingers into a tight circle around her sack and pull down, stopping her in her tracks.  The lusty woman whines plaintively, but you tighten your grip and jam your fingers deeper inside her.  In spite of her discomfort, the ebony babe\'s nipples are sticking straight up, huge and puffy.  Her cock is leaking trickles of precum all over her belly, and she gasps, "<i>Noo...</i>"' );
		EngineCore.outputText( '\n\nFeeling merciful, you release her balls, but you keep your fingers right where they are.  She bites her lower lip in frustration but her hips wiggle up at you.  Sneaking under her balls, your fingers find her clit and begin to diddle it, sliding over, around, and under it.  The little buzzer throbs happily in your grip, almost begging you to touch it, stroke it.  Of course, you do all of that, manipulating the woman\'s heaving, female flesh into a frenzy of pleasured moans.  She grabs onto your arm for dear life and pulls it deeper into her self, screeching like a banshee as she cums.  Liquid love gushes from her pussy to stain your hands, so you pump a little faster, and get rewarded with an even greater flow.  Her wet walls grab you like a vice, wringing your hand with unholy force, and then like a light going off, she shuts down, babbling weakly.' );
		EngineCore.outputText( '\n\nYou wipe your hand on the supple skin of her thigh and scold her for making such a mess.  The witch, for her part, is half conscious and panting, blissed beyond rational thought.  A glaze of white goo puddles on her belly, but her cock is still plenty hard, seemingly super-turgid from the strength of her recent orgasm.  You lift it up gingerly and climb atop it, grinding your own [vagina] along the shaft slowly to get yourself ready.  Only after the swollen rod is liberally coated in fem-spunk do you shift position and aim it up inside.' );
		EngineCore.outputText( '\n\nSinking down on the firm pole, you revel in the sensation of it splitting your nethers, beautifully stretching your canal\'s walls into a wide, cock-swallowing \'o\'.  Your [clit] thrums with heat and pleasure while you continue your slow descent, and by the time you hit cock-bottom, your [legs] are shaking weakly and your abdominal muscles are fluttering, clenching uncontrollably.  You bend over to nuzzle against the brown breasts, and they form a comfortable pillow for you to lean upon once you start to move your [hips].' );
		//cuntCheck Here;
		CoC.getInstance().player.cuntChange( CoC.getInstance().monster.biggestCockArea(), true, true, false );
		EngineCore.outputText( '\n\nThe semi-conscious witch stirs beneath you, responding to the sexual pleasure you\'ve forced back upon her.  "<i>...Wha?</i>" she asks as comprehension washes over her features.  "<i>Oooh... you\'re not done?</i>"  You bite her lower lip as your work her cock over, pumping away with wild abandon.  The only answer she needs is the feel of your body climaxing atop her, and you begin to play with her breasts as you work towards that goal.' );
		EngineCore.outputText( '\n\nThe dark-skinned blond pants, "<i>Too soon... gonna... gonna cum... again!</i>"  She screws up her eyes and throws back her head, her tongue weakly flopping to the side, and you feel her cock erupt, the heavy orbs of her balls twitching under your [butt].  Molten hot semen gushes through your passage, bathing your womb in thick sperm until you feel full in a whole different way, and as if triggered by biological imperative, you cum, creaming that thick rod with your lady-spunk.' );
		if( CoC.getInstance().player.wetness() >= 5 ) {
			EngineCore.outputText( '  It gushes out of you in a soaking river, utterly drenching the futa\'s stomach, hips, and butt.' );
		}
		if( CoC.getInstance().player.lactationQ() >= 50 ) {
			EngineCore.outputText( '  At the same time, milk spouts from your bosom to wash over your hermaphrodite.' );
		}
		EngineCore.outputText( '\n\nThe orgasm drives your body relentlessly, and you\'re forced to ride the hermaphrodite like a bucking bronco, milking her cock relentlessly.  You hips thump wetly atop the chocolate lady\'s thighs, and it isn\'t until you make that final, echoing smack of soaked flesh on flesh that you come down, sagging weakly into the comfortable tits below.  The witch sighs contently and begins to stroke your [hair], but her fingers fall away after a second as her eyes flutter closed.' );
		EngineCore.outputText( '\n\nYou recover after a few minutes and rise up, legs shaking at the overpowering sensation of the witch\'s withdrawing phallus, but you make it up with spunk pouring from your [vagina].  What a victory!' );
		CoC.getInstance().player.knockUp( PregnancyStore.PREGNANCY_SAND_WITCH, PregnancyStore.INCUBATION_SAND_WITCH, 90 );
		CoC.getInstance().player.orgasm();
		if( OnLoadVariables.dungeonLoc ) {
			if( CoC.getInstance().isInCombat() ) {
				Combat.cleanupAfterCombat();
			} else {
				EngineCore.doNext( EventParser.playerMenu );
			}
		} else {
			if( CoC.getInstance().isInCombat() ) {
				Combat.cleanupAfterCombat();
			} else {
				EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
			}
		}
	};
	//Tentacle Victory Gangbang;
	//3+ Tentas;
	DungeonSandWitch.prototype.tentacleVictoryGangbangCumWitch = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'The defeated sorceress eyes you questioningly as you step closer, and her surprise only deepens when you part your [armor] to expose your ' + CoC.getInstance().player.multiCockDescriptLight() + '.   You gleefully twist your multiple members around each other into a many-layered helix, oily, pre-dripping plant-cocks squirming together in a bundle of barely-restrained, bubbling lust.  The pliant flesh pulsates happily at its freedom and immediately takes a twist towards the horny witch, pausing above her as if considering the tightness of her slick folds or the softness of her erect cock\'s skin.' );
		EngineCore.outputText( '\n\nWith your erections poised to strike, the blonde can only stare and worry.  Her lower lip quivers with uncertainty, but as she soon as she dares to protest, you unspool a wiggling wang and stuff it so deep into her gullet that all she can say is, "<i>-uRMMPH!!!</i>"  The ebony girl\'s throat bulges obscenely while your monstrous tool burrows deeper, nesting the purple-hued head deep in her supple, exquisitely textured throat.  The suction generated by her attempts to breath only make your cock swell larger inside her, pumping you up as effectively as a goblin-machined sex-toy.' );
		EngineCore.outputText( '\n\nGroaning from the sensations, you relax the control that kept your bundle of cock twined into a single dick and allow them to fly freely.  The quickest cock immediately snaps down to nuzzle at the cunt-lips, smearing your fluids into her own.  The quick rubs stir the sensual fluids into a bubbly, off-white mess of slippery debauchery.  Unfortunately for it, that early cock is soon supplanted by another of your tentacle members.  The new one glides along the underside of the first, then squeezes between the other dick and the glorious wet slit, arching down to nestle itself inside.  The witch arches her back, eyes rolling wildly, as she struggles both to breathe and endure the sudden, forceful penetration.' );
		EngineCore.outputText( '\n\nVibrating spitefully, the now-denied cock arches up, scorpion-like and ready to strike.  It considers its options, perhaps seeing its brothers nailing the horny hussy\'s two holes through your eyes.  The prehensile penis decides to take a leg and curl about it like a snake, climbing higher and higher across the smooth, dusky skin.  Once it has nearly reached the oozing, freshly-fucked twat, it twists lower, down into the dark valley between the ass-cheeks, and with a happy sigh from your lips, you let your third tentacle pecker slide into the vulnerable anus.  It slides through her sphincter with ease and immediately begins to piston in out and out, slowly sawing through the witch\'s abused rectum without care for her comfort.' );
		EngineCore.outputText( '\n\nYou pull the throat-plugging prong free of the cum witch\'s oral cavity and smile down at her, laying the spittle-lubricated cock between the spellcaster\'s perky tits.  She coughs and gasps around, chest heaving.  In response, her swollen udders jiggle pleasantly around your embedded tool, inadvertently massaging your wiggly plug.  You rock your hips in response to the three layers of pleasure, even though your members can thrust quite adequately without you having to add any motion to the ocean.  It just feels so good to cut loose and truly enjoy the fruits of your blessed form!  You pick up the pace, dicks folding back and lunging forward like snakes, setting every part of the spunk-obsessed witch\'s body shaking, even her leaky cock.' );
		if( CoC.getInstance().player.tentacleCocks() >= 4 ) {
			EngineCore.outputText( '\n\nYour fourth free prick twines around the enchantress\'s dusky shaft, frotting and jerking it all at once, the twin cocks oozing a bubbly mess over each others\' lengths.  Arching over top of the ebony tool, your dick leans down and smashes its tip against the other, and you shudder at the feeling of pre being swapped back and forth between the cum-slits.  The cum witch\'s eyes roll back from the bliss she\'s been forced to experience.  Simultaneously, her mouth dilates, and drool dribbles from her facile mouth, oozing down her chin.  You tighten your coils around the black cock and squeeze a dollop of fresh pre-jism from it, picking up the pace to match the vigorous fucking you\'re giving.' );
		}
		EngineCore.outputText( '\n\nThe ebony beauty\'s back arches from the raw sexual power of your many-pronged assault, and she cums, as messily as noisily, her voice screeching like a banshee.  A torrent of white bursts from her bulging, pulsating penis' );
		if( CoC.getInstance().player.tentacleCocks() >= 4 ) {
			EngineCore.outputText( ', splatting over your frotting cock-tip in wild abandon' );
		}
		EngineCore.outputText( ', more like a firehose than an orgasm.  The alabaster flood rushes across the taut skin of her belly, glazing down your titty-fucking cock and the jiggling underswell of the witch\'s bust.  Her tight cunt clenches down around you like a vice, with wave-like ripples cycling from your deeply embedded tip all the way to your base.  The tight pucker of the witch\'s anus contracts likewise, and though it doesn\'t endeavor to milk your cock like her pussy, the squeezing hot tightness feels utterly divine in its own way.' );
		if( CoC.getInstance().player.balls > 0 ) {
			EngineCore.outputText( '\n\nYour balls begin to tremble with quaking warmth, releasing their thick cargo to pump up [eachCock].' );
		} else {
			EngineCore.outputText( '\n\nYour body begins to tremble with the quaking warmth, releasing its thick cargo to pump up [eachCock].' );
		}
		EngineCore.outputText( '  You shudder and grab the ebony sorceress\'s tits in your hands, squeezing her bronzed orbs tightly as you release works through you.  Jets of cum well up to plug the witch\'s pussy and anus simultaneously.  The spit-soaked, cum-splattered vine between her tits quivers meaningfully, and then unloads, squirting a thick wave of jizz onto her face.' );
		if( CoC.getInstance().player.tentacleCocks() >= 4 ) {
			EngineCore.outputText( '  Of course, your fourth prick is not to be outdone, and blasts a gooey coating of cream across the witch\'s own pulsating prick, wreathing it in drizzles of syrupy white.' );
		}
		if( CoC.getInstance().player.cumQ() >= 500 ) {
			EngineCore.outputText( '  Wave after wave of spunk washes into the tight holes and toned form of your foe, turning her into a complete mess.' );
		}
		if( CoC.getInstance().player.cumQ() >= 1000 ) {
			EngineCore.outputText( '  A few more virile splurts see to her utterly inundated state, bloating her belly into a tightly-stretched dome.' );
		}
		EngineCore.outputText( '\n\nYou retract your spent shafts and smirk at the backflow of bukkake that bursts from the cum witch\'s soiled loins.  She\'s utterly wrecked, dominated by dick in every sense.  What delicious irony that a sorceress should be taken with the very type of organ she glorifies!  Getting dressed, you give her a lazy wave and invite her to try again some other time.' );
		CoC.getInstance().player.orgasm();
		if( OnLoadVariables.dungeonLoc ) {
			if( CoC.getInstance().isInCombat() ) {
				Combat.cleanupAfterCombat();
			} else {
				EngineCore.doNext( EventParser.playerMenu );
			}
		} else {
			if( CoC.getInstance().isInCombat() ) {
				Combat.cleanupAfterCombat();
			} else {
				EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
			}
		}
	};
	//Repeat Desert Loss Female & Herm;
	DungeonSandWitch.prototype.savinMakesAwesomeFemdom = function() {
		EngineCore.clearOutput();
		//(HP);
		if( CoC.getInstance().player.HP < 1 ) {
			EngineCore.outputText( 'Unable to further withstand the witch\'s magical assault, you topple over into the soft, warm sands. Before you can recover, the witch is on top of you, her powerful legs straddling your [hips]. Her long, dainty fingers lock through your [armor], pulling your face out of the sand and rolling you over to look up at her.' );
		}
		//(Lust) ;
		else {
			EngineCore.outputText( 'Uncontrollable lust surges through you, your heart pounding beneath your [chest] as your [legs] collapse out from under you.  Your hands desperately claw at your [armor], trying to touch your needy cunt, the fire in your genitals burning like whitefire through your veins.  You moan with helpless lust as the witch looms over you, grabbing your hands away from your crotch and pushing you onto your back.  A moment later, she\'s on you, straddling your [hips] between her lush thighs.' );
		}
		EngineCore.outputText( '\n\nPinned beneath the witch, you struggle weakly in her grasp as she slowly strips off your [armor], bearing your [chest] to her surprisingly soft, gentle caresses.  ' );
		//if Multiboob:;
		if( CoC.getInstance().player.bRows() > 1 ) {
			EngineCore.outputText( 'She caresses each of your breasts, cupping each in turn, running her thumb over each nipple' );
			if( CoC.getInstance().player.lactationQ() >= 200 ) {
				EngineCore.outputText( ' until milk streams down your chest, much to her delight' );
			}
			EngineCore.outputText( '.' );
		} else if( CoC.getInstance().player.lactationQ() >= 200 ) {
			EngineCore.outputText( 'Her fingers deftly work across your [nipples], caressing out a trickle of milk, which she laps up with a long, languid motion that electrifies your sun-kissed skin.' );
		} else {
			EngineCore.outputText( 'She tweaks your [nipples] between her dexterous fingers, sending shivers of pleasure up your spine, but seems oddly discontent...  "<i>No milk for me? We\'ll have to do something about that...</i>"' );
		}
		EngineCore.outputText( '  Slowly, she works her way down from your [chest] to your belly, peeling off your [armor] as she goes to reveal more and more of your ' + CoC.getInstance().player.skinFurScales() + ', never neglecting to run her hands all across you, stroking and kissing along every exposed inch until she comes to your groin.  Instinctively, you writhe in her grip as she tosses the last of you [armor] aside, leaving you wholly bare between her legs.' );
		//If PC has a cock:;
		if( CoC.getInstance().player.hasCock() ) {
			EngineCore.outputText( '\n\n[EachCock] sits half-erect, lying against your belly.  With a grin, the cum witch opens her robes, letting them hang on her shoulders to reveal her own endowments.  Her cock, a huge, throbbing pole of meat flops down atop yours, ' );
			if( CoC.getInstance().player.longestCockLength() < 10 ) {
				EngineCore.outputText( 'overshadowing your comparatively tiny little rod' );
			} else if( CoC.getInstance().player.longestCockLength() < 15 ) {
				EngineCore.outputText( 'nearly equal to your own [cock]' );
			} else {
				EngineCore.outputText( 'seeming tiny compared to your monstrous shaft' );
			}
			EngineCore.outputText( '.  Chuckling, she wraps a hand around both your cock and hers and gives a few experimental pumps, gently grinding her hips into yours.  She frots against you for a long while, making you shudder and squirm as her thick fuckpole glides across your sensitive cockflesh... but the penile pleasure lasts only a few minutes, as soon the witch\'s attention turns elsewhere, to the womanly slit beneath your rod.' );
		}
		EngineCore.outputText( '\n\nLicking her ebony lips with lust, the witch ' );
		if( CoC.getInstance().player.isGoo() || CoC.getInstance().player.isNaga() || CoC.getInstance().player.isDrider() || CoC.getInstance().player.isTaur() ) {
			EngineCore.outputText( 'shifts down your inhuman body' );
		} else {
			EngineCore.outputText( 'spreads your legs, hiking them over her shoulders so that your feet dangle behind her' );
		}
		EngineCore.outputText( '.  She grasps her huge, throbbing cock, stroking it idly in one hand as the other caresses your thighs, exploring your groin and the sensitive flesh around your womanhood.  One of her fingers, surprisingly dainty, slips around your outer lips, circling your hole until it brushes your [clit], sending a shock of pleasure through you; a trickle of feminine fluid leaks from your loins at her touch, lubricating her finger until it sheens in the desert sun.  The witch makes a show of bringing the glistening finger to her lips, running the tip across her full black lips before lapping up the fluids with exquisitely long strokes of her tongue, soon sucking her own finger like a slender little cock covered in your juices.' );
		EngineCore.outputText( '\n\nSlowly, the witch turns her attention back to your quivering [vagina].  Her cock, now lying flat on your belly, is thrumming hotly, her heartbeat easily felt through her ready rod, a steady trickle of precum flooding down your chest in eager anticipation of the coming fucking.  You brace yourself as best you can as the witch leans back, sliding her prick down your flesh until its thick head brushes your [vagina].  You shiver, half in anticipation and half in lust-filled need; your quavering cunt\'s cockhungry muscles easily relax at her touch as she pushes in, the first inches of witchcock spreading your vaginal walls wide in acceptance of the dominating cock, womb ready to be bred, to suck every drop of seed from the cum witch\'s potent loins.' );
		EngineCore.outputText( '\n\n"<i>There\'s a good girl,</i>" the witch coos, stroking your ' + Descriptors.hairDescript() + ' as she slowly, tenderly enters you, her wide hips pushing inch after throbbing inch of cock into your hole.  ' );
		CoC.getInstance().player.cuntChange( CoC.getInstance().monster.cockArea( 0 ), true, false, true );
		EngineCore.outputText( 'Suddenly, the witch hooks her fingers around the back of your neck, lifting you up from the sand.  You gasp, unsure, until the witch guides your head up to her massive breast, already leaking milk in anticiaption.  She smiles at you, surprisingly warmly, as she nestles your cheek into the wide valley of her cleavage.  A sudden, primal instinct overtakes you, and you wrap your arms around the witch\'s waist, holding yourself to her in a tight hug.  The witch gasps, surprised by your sudden act, but relaxes in your grasp as you did in hers, allowing you to support yourself as she cups one of her teats for you, guiding the leaking nipple to your lips.  You take it eagerly, breath catching as the first sweet, creamy drops enter your waiting mouth.  You suckle from the witch like a babe, drinking her delicious milk as it pours into you.  The witch moans loudly, her head rolling back as her milk flows into you, her flared hips finally pressing into yours, her tremendous cock fully buried inside you, its head kissing the lips of your cervix.  "<i>Good girl,</i>" she echoes, stroking your hair and milk-bloated cheeks, otherwise still in your sexual embrace.' );
		EngineCore.outputText( '\n\nSlowly, the witch begins to roll her hips, pulling mere inches from your loins before slipping back in, your lubricants and her free-flowing precum sloshing out around her cock to stain the desert sands.  In tune with your suckling, she fucks your [vagina], pushing in again and again, holding you tight to herself as more and more pre fills your hungry womb.  She moans deeply, eyes closed and head resting against your own, her breath hot and heavy on your bare flesh.' );
		EngineCore.outputText( '\n\nNow, the witch almost seems lost in bliss....  Perhaps you could turn the tables on her, and end up on top?  Then again, she\'s so gentle, and her milk is so very, very good...  Do you even want to resist her as she breeds you, pumping you full of cum and milk?' );
		EngineCore.menu();
		EngineCore.addButton( 0, 'Resist', this.resistSavinStuff );
		EngineCore.addButton( 1, 'Don\'t', this.doNotResistSavin );
	};
	//Resist;
	DungeonSandWitch.prototype.resistSavinStuff = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'It takes nothing more than a gentle push to put the witch on her back.  She gasps as you straddle her, [legs] spread around her wide, birthing hips, her cock buried to the hilt inside you.  To your surprise, she reaches up from her now-submissive position, stroking your cheek and purring like a pleasured cat.  You lean down, kissing her lips for once, rather than her teats, leaving a pearly milk stain on the full black lines.  With a smile, you plant your hands on her chest to steady yourself as you begin to rise and fall on her cock, dragging the massive thing nearly out of you before sliding back down with tantalizing slowness, reveling in the sensation of being filled to the brim once again.  Again and again you buck your hips and bounce on her cock, picking up the pace to a fury of lusty fucking, a symphony of moans and primal grunts echoing out across the desert as you breed the witch, coaxing the cum you need so desperately out of her thick, throbbing pole.' );
		EngineCore.outputText( '\n\n"<i>Yes, oh please,</i>" she groans, clutching at your [hips] as you ride her cock, "<i>take my seed inside yourself, become great with my children....  We need it, both of us, yes?  Don\'t hold back... FUCK ME!</i>"' );
		EngineCore.outputText( '\n\nYou slam yourself down on her rod one last time, screaming with pleasure as the first blast of cum smears your inner walls, painting your insides white with potent witchseed.  Your cunt grasps her prick, milking it as the witch groans in feral pleasure, bucking her hips into you as seed fills you and more, spilling out around her cock until the sand seems like snow beneath you.' );
		EngineCore.outputText( '\n\n"<i>Yes, oh yes,</i>" the witch groans, falling back against the cum-covered dunes, her milky chest heaving, adding to the organic mess.  "<i>Let me be the father of your children... you\'ll be an excellent mother, and our children will be glorious.</i>"' );
		EngineCore.outputText( '\n\nSilently, you nod, and collapse atop her, head buried in her milk-laden chest as you pass out from sexual exhaustion.' );
		CoC.getInstance().player.orgasm();
		EngineCore.dynStats( 'sen', 2 );
		Combat.cleanupAfterCombat();
		//knock up hurrrr;
		CoC.getInstance().player.knockUp( PregnancyStore.PREGNANCY_SAND_WITCH, PregnancyStore.INCUBATION_SAND_WITCH, 90 );
	};
	//Do Nothing;
	DungeonSandWitch.prototype.doNotResistSavin = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'You need her inside you, to be filled with her seed... her children.  To be dominated, to be bred.  You sink into the witch\'s embrace, letting her slowly, lovingly pump her thick hips into you, taking more and more of her pre-cum and milk into you until you feel bloated, heavy-laden with white witchseed and the food you\'ll soon be making for your shared offspring.  The cum witch is incredibly gentle, her motions always tender, taking the best of care of you -- loving, in their way -- as she fills you with her cock again and again.  You bask in the fullness of it, going limp from pleasure, content to let her fuck you full of little witches, to be the mother of the dunes as you deserve.' );
		EngineCore.outputText( '\n\n"<i>A good girl, beautiful girl.  So strong, so eager.  So willing.  You\'ll make a fine mother, a good broodmare, won\'t you?</i>"  You nod eagerly, punctuated by her thrusting harder, faster into you. "<i>Our children will be wonderful, beautiful witches, the queens of the desert.  Your womb will be the building block of the demons\' downfall.... Now take my seed, and make it yours, a child for us both.</i>"' );
		EngineCore.outputText( '\n\nYou can do nothing more than gasp, milk sputtering from your lips as the first hot spurt of cum pierces your womb.  The witch rocks her hips, pumping you with load after load of creamy seed, filling you with the hope of offspring until thick semen stains your thighs, pouring out around her massive, dominating rod.  The witch seems to go on forever with an infinite reserve of cum inside her, pumping you full of more and more until the dune is snow-white with excess witchseed.' );
		EngineCore.outputText( '\n\nFinally, the endless orgasm fades, and the witch groans with contentment, falling back against the cum-covered dunes, her milky chest heaving, adding to the organic mess.  "<i>Let me be the father of your children... you\'ll be an excellent mother, and our children will be glorious.</i>"' );
		EngineCore.outputText( '\n\nSilently, you nod, and collapse atop her, head buried in her milk-laden chest as you pass out from sexual exhaustion.' );
		CoC.getInstance().player.orgasm();
		EngineCore.dynStats( 'sen', 2 );
		Combat.cleanupAfterCombat();
		//knock up hurrrr;
		CoC.getInstance().player.knockUp( PregnancyStore.PREGNANCY_SAND_WITCH, PregnancyStore.INCUBATION_SAND_WITCH, 90 );
	};

	DungeonSandWitch.prototype.lionpaws = function( skipped ) {
		EngineCore.clearOutput();
		//[skip riddles, just request from menu (requires some event occurrence > 1)];
		if( skipped ) {
			EngineCore.outputText( '"<i>Really, [name]?</i>"  Sanura smirks and shakes her head.  "<i>I probably shouldn\'t do this sort of thing just because you ask for it, but your fascination with my paws is too cute to ignore.  Go on, then, strip for me and I\'ll get to it.</i>"  You oblige, happily tossing aside your armor.  [EachCock], already standing erect with anticipation, bounces freely before you.  The sphinx eyes ' );
			if( CoC.getInstance().player.cockTotal() === 1 ) {
				EngineCore.outputText( 'it' );
			} else {
				EngineCore.outputText( 'them' );
			}
			EngineCore.outputText( ' lustfully, momentarily entranced by the swaying motions of your member' );
			if( CoC.getInstance().player.cockTotal() > 1 ) {
				EngineCore.outputText( 's' );
			}
			EngineCore.outputText( '.' );
		}
		//[CoC.getInstance().player requests big fluffy paws on their dick after solving a riddle];
		//[if event occurrence === 0];
		else if( CoC.getInstance().flags[ kFLAGS.PAWJOBS ] === 0 ) {
			EngineCore.outputText( 'Sanura raises her eyebrows at your demand, her expression somewhere between surprise and curiosity.  "<i>Well, that\'s something of an odd request, but I suppose I\'m obliged if it\'s your wish.</i>"  Not bothering to give her a chance to consider your demand any further, you pull off your armor and cast it aside.  "<i>Can\'t say I\'ve even been asked for something like this before...  I apologize in advance for my inexperience, [name].</i>"  The sphinx looks down at her paws, obviously confused as to why you would ask for this in particular.' );
		}
		//[if event occurrence > 0];
		else {
			EngineCore.outputText( '"<i>Again?</i>" Sanura asks, cocking her head to the side.  "<i>They must feel better than I imagine... well then, get out of your clothes and I\'ll do as you ask.' );
			if( CoC.getInstance().player.biggestCockArea() > 100 ) {
				EngineCore.outputText( '  It\'s not as if there\'s all that much else I can do for that monster of yours anyways.' );
			}
			EngineCore.outputText( '</i>" She raises a paw and examines it, as though trying to figure out just what it is about them that you enjoy so much.  You cough as a means of drawing her attention once you\'ve stripped off the last bit of your armor, shaking her from her reverie.' );
		}
		EngineCore.outputText( '\n\nSanura asks that you kneel, and you eagerly comply.  ' );
		//[if dick isn't already hard and PC knows what's coming];
		if( CoC.getInstance().player.lust < 50 && CoC.getInstance().flags[ kFLAGS.PAWJOBS ] === 0 ) {
			EngineCore.outputText( 'Even as you drop to your knees before Sanura, your cock' );
			if( CoC.getInstance().player.cockTotal() > 1 ) {
				EngineCore.outputText( 's' );
			}
			EngineCore.outputText( ' begin' );
			if( CoC.getInstance().player.cockTotal() === 1 ) {
				EngineCore.outputText( 's' );
			}
			EngineCore.outputText( ' to harden in anticipation while your mind wonders at just what this will feel like.  ' );
		}
		EngineCore.outputText( 'The sphinx bends too, so that her head is level with your crotch.  With a little bounce, she throws her large paws around your hips and roughly pulls you closer.  The guardian wastes no time, licking along the shaft' );
		if( CoC.getInstance().player.cockTotal() > 1 ) {
			EngineCore.outputText( 's' );
		}
		EngineCore.outputText( ' of your ' );
		if( CoC.getInstance().player.cockTotal() > 1 ) {
			EngineCore.outputText( 'various ' );
		}
		EngineCore.outputText( 'prick' );
		if( CoC.getInstance().player.cockTotal() > 1 ) {
			EngineCore.outputText( 's' );
		}
		EngineCore.outputText( ' with a soft, skilled tongue.' );
		//[if pc was soft before];
		if( CoC.getInstance().player.lust < 50 && CoC.getInstance().flags[ kFLAGS.PAWJOBS ] === 0 ) {
			EngineCore.outputText( '  It isn\'t long before her oral ministrations have your cock' );
			if( CoC.getInstance().player.cockTotal() > 1 ) {
				EngineCore.outputText( 's' );
			}
			EngineCore.outputText( ' standing erect, throbbing with hunger for more sensation.  You wonder as to what exactly she has planned, but you think it\'s shaping up to be something good.' );
		}
		//[continue];
		EngineCore.outputText( '  Her long, expert strokes methodically coat your member' );
		if( CoC.getInstance().player.cockTotal() > 1 ) {
			EngineCore.outputText( 's' );
		}
		EngineCore.outputText( ' in a glistening veil of saliva. After a while, she pulls her head away and examines her work.' );
		EngineCore.outputText( '\n\nApparently deeming ' );
		if( CoC.getInstance().player.cockTotal() > 1 ) {
			EngineCore.outputText( 'them' );
		} else {
			EngineCore.outputText( 'it' );
		}
		EngineCore.outputText( ' sufficiently lubricated, Sanura lifts a foreleg and carefully guides her paw towards your crotch.' );
		//[if PC doesn't expect it];
		if( CoC.getInstance().player.lust < 50 && CoC.getInstance().flags[ kFLAGS.PAWJOBS ] === 0 ) {
			EngineCore.outputText( '  You raise your eyebrows in surprise, but you\'re not in much of a position to do anything about her foot\'s advance.' );
		}
		EngineCore.outputText( '  She playfully taps at your cock, purring sensually as she sets it bouncing with a light bat.  After watching it for a moment, she hesitantly pushes forward so that her paw gingerly rests against ' );
		if( CoC.getInstance().player.cockTotal() > 1 ) {
			EngineCore.outputText( 'one of ' );
		}
		EngineCore.outputText( 'your shaft' );
		if( CoC.getInstance().player.cockTotal() > 1 ) {
			EngineCore.outputText( 's' );
		}
		EngineCore.outputText( ', pushing your cock up against your waist and trembling with the effort of keeping her touch gentle.  The pad of her paw, made soft and warm by the sands of the desert, presses lightly around your cock.  Slowly, hesitantly, she begins to rub up and down, her paw gliding along your slickened skin.' );
		//[if cockradius < xXXXX(most people should see this)];
		if( CoC.getInstance().player.smallestCockArea() < 100 ) {
			EngineCore.outputText( '  As she pushes onto you just a bit more forcefully, your member slips between two of her digits.  She continues her slow, rhythmic movements with just a bit more grip, and you\'re made quite thankful that her claws are so retractable as she brushes against your belly.' );
		}
		EngineCore.outputText( '\n\nTan, fluffy fur tickles you as Sanura keeps stroking away, motions made perfectly smooth by the thick coat of saliva that still covers your cock.  The wide, cushiony embrace of her paw feels as though it might engulf your cock at any moment, so strongly do you feel the comfortable, pleasurable sensations.  ' );
		//[if PC did not request da paws && event occurrence === 0];
		if( !skipped && CoC.getInstance().flags[ kFLAGS.PAWJOBS ] === 0 ) {
			EngineCore.outputText( 'It feels wonderful in a peculiar sort of way; though it\'s certainly not the treatment you expected to receive, you can definitely feel your arousal being pushed along and built up by her foot.  ' );
		}
		//[if PC has 2+ dicks];
		if( CoC.getInstance().player.cockTotal() > 1 ) {
			EngineCore.outputText( 'Not content to leave your other cocks neglected, the sphinx leans in and starts to lick and suckle once again at the pricks not beneath her paw.  You shudder at the feeling of her tongue darting from shaft to shaft and teasing your heads, sharper sensations punctuating her foot\'s more constant pleasuring.  ' );
		}
		EngineCore.outputText( 'The fuzzy warmth clouding your mind dazes you, and you sway slightly in place, letting her rock you back and forth with her motions.' );
		EngineCore.outputText( '\n\nThough her attentions definitely feel nice, the shaky, imperfect nature of the pawjob leave you thirsting for more as the tension builds in your cock' );
		if( CoC.getInstance().player.cockTotal() > 1 ) {
			EngineCore.outputText( 's' );
		}
		EngineCore.outputText( '.  You suddenly grab her ankle, and she looks up at you confused, probably thinking you mean for her to stop.  You guide her back into steadier, quicker motions in short order though, eliciting a giggle from the playful sphinx.  She presses against you more confidently with your hand there to guide her, less fearful of causing you harm.  You slide her paw faster and faster, desperate to bring yourself more sensation and to orgasm.  Not feeling like it\'s quite enough, you take her other large paw from your hip and press its pad against your shaft too, using her feet like some odd sex toy to hug your [cock biggest].  Rather than being upset about being used in such an unusual manner, Sanura coos and grasps at your meat even tighter, reveling in the strange experience.  You buck your hips slightly in time with the strokes, and it\'s not long before you feel a familiar need and warmth well up inside.' );
		//[if cum output is normal];
		if( CoC.getInstance().player.cumQ() < 250 ) {
			EngineCore.outputText( '\n\nWith a few final pushes you find release, spraying ropes of thick cum along the length of her leg.' );
		} else {
			EngineCore.outputText( '\n\nA torrent of cum bursts forth from your cock' );
			if( CoC.getInstance().player.cockTotal() > 1 ) {
				EngineCore.outputText( 's' );
			}
			EngineCore.outputText( ' like a geyser, covering both you and Sanura in a flood of your semen.  The flow doesn\'t stop, cum churning and burning as it roils within you.  The sphinx pulls away in an effort to dodge the unexpected volume of man-milk, but to no avail: both halves of her body are painted white and your cum drips from her hair to her skin, fur, and wings. She tries to wipe her face at least clean, but manages only to smear more across her cheek.  With a sigh, she shakes what she can off her hands.' );
		}
		EngineCore.outputText( '  Exhausted from the orgasm, you let go of her, leaving the sphinx to milk out the last drops of cum with gentle pressure from her pad on her own.  Sanura stands back up and laughs.  "<i>Look at the mess you made!</i>"  She places her dirtied paw on your chest and pushes you back, easily making you fall on your [ass].  "<i>Well, that was... interesting' );
		if( CoC.getInstance().flags[ kFLAGS.PAWJOBS ] > 0 ) {
			EngineCore.outputText( ' as always' );
		}
		EngineCore.outputText( ', [name].  Now get your clothes back on, I\'ve a temple to guard and a coat to clean.</i>"  At that, she turns and pads away from you, lying down in front of the door and licking at her' );
		//[if cum output is normal];
		if( CoC.getInstance().player.cumQ() < 250 ) {
			EngineCore.outputText( ' leg.' );
		} else {
			EngineCore.outputText( ' stained-white fur in a futile attempt to get some of your cum off.' );
		}

		CoC.getInstance().player.orgasm();
		EngineCore.dynStats( 'sen', -2 );
		EngineCore.menu();
		if( skipped ) {
			OnLoadVariables.dungeonLoc = 0; //Replaces inDungeon = false;
			EngineCore.addButton( 0, 'Next', CoC.getInstance().scenes.camp.returnToCampUseOneHour );
		} else {
			EngineCore.menu();
			EngineCore.addButton( 0, 'Enter', this.openZeDoorToParadize );
			EngineCore.addButton( 4, 'Leave', this.leaveBoobsDungeon );
		}
	};

	//SPHINX RIDDLES for the Gentleman Gamer;
	//Accept the Riddle Challenge;
	DungeonSandWitch.prototype.riddleGameGo = function() {
		EngineCore.clearOutput();
		CoC.getInstance().flags[ kFLAGS.RIDDLE_ONE ] = 0;
		CoC.getInstance().flags[ kFLAGS.RIDDLE_TWO ] = 0;
		CoC.getInstance().flags[ kFLAGS.RIDDLE_THREE ] = 0;
		EngineCore.outputText( '"<i>Oh!  You\'ll play my game?  Marvelous!  Well then, let\'s begin...</i>"' );
		//[NEXT];
		EngineCore.menu();
		EngineCore.addButton( 0, 'Next', this.riddlePicker );
	};
	DungeonSandWitch.prototype.riddlePicker = function() {
		var choices = [];
		if( CoC.getInstance().flags[ kFLAGS.RIDDLE_ONE ] !== this.riddleOne && CoC.getInstance().flags[ kFLAGS.RIDDLE_TWO ] !== this.riddleOne ) {
			choices[ choices.length ] = this.riddleOne;
		}
		if( CoC.getInstance().flags[ kFLAGS.RIDDLE_ONE ] !== this.riddleTwo && CoC.getInstance().flags[ kFLAGS.RIDDLE_TWO ] !== this.riddleTwo ) {
			choices[ choices.length ] = this.riddleTwo;
		}
		if( CoC.getInstance().flags[ kFLAGS.RIDDLE_ONE ] !== this.riddleThree && CoC.getInstance().flags[ kFLAGS.RIDDLE_TWO ] !== this.riddleThree ) {
			choices[ choices.length ] = this.riddleThree;
		}
		if( CoC.getInstance().flags[ kFLAGS.RIDDLE_ONE ] !== this.riddleFour && CoC.getInstance().flags[ kFLAGS.RIDDLE_TWO ] !== this.riddleFour ) {
			choices[ choices.length ] = this.riddleFour;
		}
		if( CoC.getInstance().flags[ kFLAGS.RIDDLE_ONE ] !== this.riddleFive && CoC.getInstance().flags[ kFLAGS.RIDDLE_TWO ] !== this.riddleFive ) {
			choices[ choices.length ] = this.riddleFive;
		}
		if( CoC.getInstance().flags[ kFLAGS.RIDDLE_ONE ] !== this.riddleSix && CoC.getInstance().flags[ kFLAGS.RIDDLE_TWO ] !== this.riddleTwo ) {
			choices[ choices.length ] = this.riddleSix;
		}
		if( CoC.getInstance().flags[ kFLAGS.RIDDLE_ONE ] !== this.riddleSeven && CoC.getInstance().flags[ kFLAGS.RIDDLE_TWO ] !== this.riddleSeven ) {
			choices[ choices.length ] = this.riddleSeven;
		}
		if( CoC.getInstance().flags[ kFLAGS.RIDDLE_ONE ] !== this.riddleEight && CoC.getInstance().flags[ kFLAGS.RIDDLE_TWO ] !== this.riddleEight ) {
			choices[ choices.length ] = this.riddleEight;
		}
		if( CoC.getInstance().flags[ kFLAGS.RIDDLE_ONE ] !== this.riddleNine && CoC.getInstance().flags[ kFLAGS.RIDDLE_TWO ] !== this.riddleNine ) {
			choices[ choices.length ] = this.riddleNine;
		}
		if( CoC.getInstance().flags[ kFLAGS.RIDDLE_ONE ] !== this.riddleTen && CoC.getInstance().flags[ kFLAGS.RIDDLE_TWO ] !== this.riddleTen ) {
			choices[ choices.length ] = this.riddleTen;
		}
		if( CoC.getInstance().flags[ kFLAGS.RIDDLE_ONE ] !== this.riddleEleven && CoC.getInstance().flags[ kFLAGS.RIDDLE_TWO ] !== this.riddleEleven ) {
			choices[ choices.length ] = this.riddleEleven;
		}
		if( CoC.getInstance().flags[ kFLAGS.RIDDLE_ONE ] !== this.riddleTwelve && CoC.getInstance().flags[ kFLAGS.RIDDLE_TWO ] !== this.riddleTwelve ) {
			choices[ choices.length ] = this.riddleTwelve;
		}
		if( CoC.getInstance().flags[ kFLAGS.RIDDLE_ONE ] === 0 ) {
			CoC.getInstance().flags[ kFLAGS.RIDDLE_ONE ] = choices[ Utils.rand( choices.length ) ];
			CoC.getInstance().flags[ kFLAGS.RIDDLE_ONE ]();
		} else if( CoC.getInstance().flags[ kFLAGS.RIDDLE_TWO ] === 0 ) {
			CoC.getInstance().flags[ kFLAGS.RIDDLE_TWO ] = choices[ Utils.rand( choices.length ) ];
			CoC.getInstance().flags[ kFLAGS.RIDDLE_TWO ]();
		} else {
			CoC.getInstance().flags[ kFLAGS.RIDDLE_THREE ] = choices[ Utils.rand( choices.length ) ];
			CoC.getInstance().flags[ kFLAGS.RIDDLE_THREE ]();
		}
	};

	//RIDDLE 1;
	DungeonSandWitch.prototype.riddleOne = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( '"<i>Hmm, here\'s an old one, but a good one, I think.  One of my favorites, but stop me if you know the answer already: \'I walk on four legs in the morning, two in the afternoon, and three in the evening.  What am I?\'</i>"' );
		EngineCore.menu();
		//[A Sphinx] (if PC int < 50 add this Centaur]) [A Man] (if PC int < 35 add this: [Stilts]) [Fuck it, Attack];
		EngineCore.addButton( 0, 'A Sphinx', this.riddleOneSphinx );
		EngineCore.addButton( 1, 'A Centaur', this.answerWrong );
		EngineCore.addButton( 2, 'A Man', this.answerCorrect );
		if( CoC.getInstance().player.inte < 35 ) {
			EngineCore.addButton( 3, 'Stilts', this.answerWrong );
		}
		EngineCore.addButton( 4, 'Uh, ATTACK!', this.fuckItAttack );
	};
	//Special Occurrence: Pick [A Sphinx];
	DungeonSandWitch.prototype.riddleOneSphinx = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'The sphinx narrows her eyes at you, crossing her arms over her chest.  "<i>You don\'t say?  Come on, step it up, [name].  Sorry, but that\'s wrong.  Let\'s try again.</i>"' );
		EngineCore.menu();
		if( CoC.getInstance().flags[ kFLAGS.RIDDLE_ONE ] === this.riddleOne ) {
			CoC.getInstance().flags[ kFLAGS.RIDDLE_ONE ] = 0;
		} else if( CoC.getInstance().flags[ kFLAGS.RIDDLE_TWO ] === this.riddleOne ) {
			CoC.getInstance().flags[ kFLAGS.RIDDLE_TWO ] = 0;
		} else if( CoC.getInstance().flags[ kFLAGS.RIDDLE_THREE ] === this.riddleOne ) {
			CoC.getInstance().flags[ kFLAGS.RIDDLE_THREE ] = 0;
		}
		EngineCore.addButton( 0, 'Next', this.riddlePicker );
	};
	//RIDDLE 2;
	DungeonSandWitch.prototype.riddleTwo = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( '"<i>Mmm, I\'ve always been fond of this one.  Delightfully simple, really - don\'t overthink it, dear.  \'I always run, yet never walk; I murmur often, yet never talk; and I\'ve a bed, yet never sleep.  What am I?\'</i>"' );
		//[A River] [A Whisper] (if PC int < 50 add this Nail]) (if PC int < 35 add this: [A Bunny Girl]) [Fuck it, Attack];
		EngineCore.menu();
		EngineCore.addButton( 0, 'A River', this.answerCorrect );
		EngineCore.addButton( 1, 'A Whisper', this.answerWrong );
		if( CoC.getInstance().player.inte < 50 ) {
			EngineCore.addButton( 2, 'A Nail', this.answerWrong );
		}
		if( CoC.getInstance().player.inte < 35 ) {
			EngineCore.addButton( 3, 'A Bunny-Girl', this.answerWrong );
		}
		EngineCore.addButton( 4, 'Uh, ATTACK!', this.fuckItAttack );
	};
	//RIDDLE 3;
	DungeonSandWitch.prototype.riddleThree = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( '"<i>Ooh, this is a morbid one: \'Whoever makes me, sells me.  He who buys me, never uses me. And he who uses me, well, they\'ll never know it.  What am I?\'</i>"' );
		EngineCore.menu();
		//[Poison] (if PC int < 50 add this Condom]) (if PC int < 35 add this: [Arrows]) [A Coffin] [Fuck it, Attack];
		EngineCore.addButton( 0, 'Poison', this.answerWrong );
		if( CoC.getInstance().player.inte < 50 ) {
			EngineCore.addButton( 1, 'A Condom', this.answerWrong );
		}
		if( CoC.getInstance().player.inte < 35 ) {
			EngineCore.addButton( 2, 'Arrows', this.answerWrong );
		}
		EngineCore.addButton( 3, 'A Coffin', this.answerCorrect );
		EngineCore.addButton( 4, 'Uh, ATTACK!', this.fuckItAttack );
	};
	//RIDDLE 4;
	DungeonSandWitch.prototype.riddleFour = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( '"<i>Here\'s a classic for you: \'I\'m always hungry, and must be fed always, lest I flicker away.  Yet I will always bite the hand that feeds me, if it touches me.  What am I?\'</i>"' );
		EngineCore.menu();
		//(if PC int < 35 add this Fairy]) [Fire] [A Dog] (if PC int < 50 add this: [Disease]) [Fuck it, Attack];
		if( CoC.getInstance().player.inte < 35 ) {
			EngineCore.addButton( 0, 'A Fairy', this.answerWrong );
		}
		EngineCore.addButton( 1, 'Fire', this.answerCorrect );
		EngineCore.addButton( 2, 'A Dog', this.answerWrong );
		if( CoC.getInstance().player.inte < 50 ) {
			EngineCore.addButton( 3, 'Disease', this.answerWrong );
		}
		EngineCore.addButton( 4, 'Uh, ATTACK!', this.fuckItAttack );
	};
	//RIDDLE 5;
	DungeonSandWitch.prototype.riddleFive = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( '"<i>A favorite of my dear Goblin friends: \'When young, I am sweet in the sun; in middle age, I make you gay; but when I\'m old, I\'m more valuable than gold.  What am I?\'</i>"' );
		EngineCore.menu();
		//(if PC int < 50 add this) (if PC int < 35 add this: [Women]) [Wine] [Cheese] [Fuck it, Attack];
		if( CoC.getInstance().player.inte < 50 ) {
			EngineCore.addButton( 0, 'Men', this.answerWrong );
		}
		if( CoC.getInstance().player.inte < 35 ) {
			EngineCore.addButton( 1, 'Women', this.answerWrong );
		}
		EngineCore.addButton( 2, 'Wine', this.answerCorrect );
		EngineCore.addButton( 3, 'Cheese', this.answerWrong );
		EngineCore.addButton( 4, 'Uh, ATTACK!', this.fuckItAttack );
	};
	//RIDDLE 6;
	DungeonSandWitch.prototype.riddleSix = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( '"<i>This riddle always makes me a bit sad, but... \'My life lasts but hours, and in service I\'m devoured.  Thin, I am quick, fat I am slow, and wind is ever my foe.  What am I?\'</i>"' );
		//(if PC int < 35 add this Goblin]) [A Candle] (if PC int < 50 add this: [A Boat]) [An Arrow] [Fuck it, Attack];
		EngineCore.menu();
		if( CoC.getInstance().player.inte < 35 ) {
			EngineCore.addButton( 0, 'A Goblin', this.answerWrong );
		}
		EngineCore.addButton( 1, 'A Candle', this.answerCorrect );
		if( CoC.getInstance().player.inte < 50 ) {
			EngineCore.addButton( 2, 'A Boat', this.answerWrong );
		}
		EngineCore.addButton( 3, 'An Arrow', this.answerWrong );
		EngineCore.addButton( 4, 'Uh, ATTACK!', this.fuckItAttack );
	};
	//RIDDLE 7;
	DungeonSandWitch.prototype.riddleSeven = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( '"<i>In service to the Sand Witches, I can sympathize with this riddle\'s speaker: \'Each morning I appear to lie at your feet; all day I\'ll follow you no matter how fast you run, yet I\'ll nearly perish in the midday sun.  What am I?\'</i>"' );
		//[A Shadow] [A Dog] (if PC int < 35 add this) (if PC int < 50 add this: [The Breeze]) [Fuck it, Attack];
		EngineCore.menu();
		EngineCore.addButton( 0, 'A Shadow', this.answerCorrect );
		EngineCore.addButton( 1, 'A Dog', this.answerWrong );
		if( CoC.getInstance().player.inte < 35 ) {
			EngineCore.addButton( 2, 'Water', this.answerWrong );
		}
		if( CoC.getInstance().player.inte < 50 ) {
			EngineCore.addButton( 3, 'The Breeze', this.answerWrong );
		}
		EngineCore.addButton( 4, 'Uh, ATTACK!', this.fuckItAttack );
	};
	//RIDDLE 8;
	DungeonSandWitch.prototype.riddleEight = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( '"<i>Tsk, a sad tale this, fleeting as a melody on the breeze: \'You\'ve heard me before, and will again, till fast I die - then you\'ll but summon me again.  What am I?\'</i>"' );
		//(if PC int < 35 add this Demon]) (if PC int < 50 add this: [Religion]) [An Idea] [An Echo] [Fuck it, Attack];
		EngineCore.menu();
		if( CoC.getInstance().player.inte < 35 ) {
			EngineCore.addButton( 0, 'A Demon', this.answerWrong );
		}
		if( CoC.getInstance().player.inte < 50 ) {
			EngineCore.addButton( 1, 'Religion', this.answerWrong );
		}
		EngineCore.addButton( 2, 'An Idea', this.answerWrong );
		EngineCore.addButton( 3, 'An Echo', this.answerCorrect );
		EngineCore.addButton( 4, 'Uh, ATTACK!', this.fuckItAttack );
	};
	//RIDDLE 9;
	DungeonSandWitch.prototype.riddleNine = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( '"<i>Like a cat comes this riddle of many lives: \'Three lives have I, gentle enough to sooth the skin, light enough to caress the sky, or hard enough to shatter stone.  What am I?\'</i>"' );
		EngineCore.menu();
		//(if PC int < 35 add this Dick]) [Water] [A Voice] (if PC int < 50 add this: [Faith]) [Fuck it, Attack];
		if( CoC.getInstance().player.inte < 35 ) {
			EngineCore.addButton( 0, 'A Dick', this.answerWrong );
		}
		EngineCore.addButton( 1, 'Water', this.answerCorrect );
		EngineCore.addButton( 2, 'A Voice', this.answerWrong );
		if( CoC.getInstance().player.inte < 50 ) {
			EngineCore.addButton( 3, 'Faith', this.answerWrong );
		}
		EngineCore.addButton( 4, 'Uh, ATTACK!', this.fuckItAttack );
	};
	//RIDDLE 10;
	DungeonSandWitch.prototype.riddleTen = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( '"<i>Devious, this: \'Whoever makes me, tells it not; he who takes me, knows it not; and he who knows me, takes me not.  What am I?\'</i>"' );
		//[Disease] [Counterfeits] (if PC int < 35 add this in a River]) (if PC int < 50 add this: [Tattered Scrolls]) [Fuck it, Attack];
		EngineCore.menu();
		EngineCore.addButton( 0, 'Disease', this.answerWrong );
		EngineCore.addButton( 1, 'Counterfeits', this.answerCorrect );
		if( CoC.getInstance().player.inte < 35 ) {
			EngineCore.addButton( 2, 'Piss In A River', this.answerWrong );
		}
		if( CoC.getInstance().player.inte < 50 ) {
			EngineCore.addButton( 3, 'Tattered Scrolls', this.answerWrong );
		}
		EngineCore.addButton( 4, 'Uh, ATTACK!', this.fuckItAttack );
	};
	//RIDDLE 11;
	DungeonSandWitch.prototype.riddleEleven = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( '"<i>The lovely Naga that roams this desert knows my speaker well: \'A box without hinges, lock or key, yet I\'ve golden treasure within me.  What am I?\'</i>"' );
		//(if PC int < 35 add this Treasure Chest]) (if PC int < 50 add this: [Pure Honey]) [Eggs] [Booze Bottles] [Fuck it, Attack];
		EngineCore.menu();
		if( CoC.getInstance().player.inte < 35 ) {
			EngineCore.addButton( 0, 'Teasure Chest', this.answerWrong );
		}
		if( CoC.getInstance().player.inte < 50 ) {
			EngineCore.addButton( 1, 'Pure Honey', this.answerWrong );
		}
		EngineCore.addButton( 2, 'Eggs', this.answerCorrect );
		EngineCore.addButton( 3, 'Booze Bottles', this.answerWrong );
		EngineCore.addButton( 4, 'Uh, ATTACK!', this.fuckItAttack );
	};
	//RIDDLE 12;
	DungeonSandWitch.prototype.riddleTwelve = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( '"<i>Here we\'ve one that speaks to the stars and the earth at once: \'One by one we fall from the heavens, down into the depths of the past; our world is ever upturned, so that yet some time will last.  What are we?\'</i>"' );
		//(if PC int < 50 add this Stars]) (if PC int < 35 add this: [Angels]) [Sand] [Rain] [Fuck it, Attack];
		EngineCore.menu();
		if( CoC.getInstance().player.inte < 50 ) {
			EngineCore.addButton( 0, 'Fallen Stars', this.answerWrong );
		}
		if( CoC.getInstance().player.inte < 35 ) {
			EngineCore.addButton( 1, 'Angels', this.answerWrong );
		}
		EngineCore.addButton( 2, 'Sand', this.answerCorrect );
		EngineCore.addButton( 3, 'Rain', this.answerWrong );
		EngineCore.addButton( 4, 'Uh, ATTACK!', this.fuckItAttack );
	};

	//ANSWER A RIDDLE RIGHT (Like a Boss);
	DungeonSandWitch.prototype.answerCorrect = function() {
		EngineCore.clearOutput();
		if( CoC.getInstance().flags[ kFLAGS.RIDDLE_THREE ] === 0 ) {
			EngineCore.outputText( 'The sphinx-girl sighs, "<i>That\'s... correct.  Not bad, I suppose.  Well, we\'re not done yet... I\'ve still got some tricks up my sleeves.  Er, so to speak.</i>"' );
			EngineCore.menu();
			EngineCore.addButton( 0, 'Next', this.riddlePicker );
		} else {
			//BEAT THE SPHINX AT HER OWN GAME (First Time);
			if( CoC.getInstance().flags[ kFLAGS.BEATEN_SANURA_COUNT ] === 0 ) {
				EngineCore.outputText( '"<i>W-what!?</i>"  the sphinx gasps as you correctly answer the last of her riddles.   "<i>I-I don\'t... but how?  No one\'s ever had the wits to answer all three riddles!</i>"' );
				EngineCore.outputText( '\n\nShe takes a moment to collect herself, then shrugs her shoulders lightly, "<i>Well, that <i>was</i> unexpected.  My apologies, but I never actually expected you to win... still, I did offer you recompense for your efforts.  I am Sanura,</i>" she bows, and over her shoulder you suddenly see a small door in the face of a dune emerge.  "<i>You may enter the lair of the Sand Witches at your leisure.  Or... if you so desire... my body is yours to do with as you will,</i>" she adds playfully.' );
			}
			//BEAT THE SPHINX AT HER OWN GAME (REPEAT);
			else {
				EngineCore.outputText( '"<i>Tsk, I lose again!</i>" Sanura pouts, crossing her arms.  "<i>I suppose you\'ll just have to give me a victory ravishing, won\'t you?  Go easy, though... you\'ve already damaged my pride so....</i>"' );
			}
			CoC.getInstance().flags[ kFLAGS.BEATEN_SANURA_COUNT ]++;
			EngineCore.outputText( '\n\nWhat do you do?' );
			//(Display Options: [Fuck Her] [Door] [Leave]);
			EngineCore.menu();
			EngineCore.addButton( 0, 'North Door', this.openZeDoorToParadize );
			EngineCore.addButton( 1, 'Fuck Her', this.fuckDatSphinx );
			EngineCore.addButton( 4, 'Leave', this.leaveBoobsDungeon );
		}
	};

	//THE SPHINX BEAT YOU AT HER OWN -- WAIT A SECOND;
	DungeonSandWitch.prototype.answerWrong = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( '"<i>That\'s... wrong, I\'m afraid,</i>" she says, a proud smile playing across her lips.  "<i>Wrong, wrong, wrong.  Well, perhaps </i>I<i> was wrong about </i>you<i> after all...  Here I thought you\'d be some fun.  Still, though, at least your body will serve me well, I think.  Yes, you\'ll do nicely.  Go on then, love, strip out of your [armor] for me.  A deal\'s a deal, after all...</i>"' );
		//(Display Options: [Submit] [Fuck it, Attack]);
		//(Submit goes to appropriate loss scene);
		EngineCore.menu();
		EngineCore.addButton( 0, 'Submit', this.sphinxSubmissionOptions );
		EngineCore.addButton( 1, 'Uh, ATTACK!', this.fuckItAttack );
	};
	//FUCK IT, ATTACK (First Time);
	DungeonSandWitch.prototype.fuckItAttack = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'To hell with this. You ready your [weapon] to beat your way through the damned sphinx, but as soon as you make a threatening move, the half-lion makes a shrill "<i>EEEP</i>" and throws her hands up in surrender. "<i>Please, th-there\'s no need for violence! I\'ve no loyalty to these witches, they </i>force<i> me to guard the door. I\'ve no desire to fight you; I\'ll not stop you if you wish to enter the lair.</i>"' );
		//[Options: Enter, Leave. Either way, Sanura won't be encountered again];
		CoC.getInstance().flags[ kFLAGS.SANURA_DISABLED ] = 1;
		EngineCore.menu();
		EngineCore.addButton( 0, 'Enter', this.openZeDoorToParadize );
		EngineCore.addButton( 4, 'Leave', this.leaveBoobsDungeon );
	};
	//Fuck Her;
	DungeonSandWitch.prototype.fuckDatSphinx = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'Grinning lustily at the pretty leonine girl, you tell her it\'s time to have some fun. With an easy grace, she slips the sky blue shift from her shoulders, exposing her pert, palmable breasts.  "<i>Well, you did win my game, after all... I\'m yours to do with as you wish, my brilliant ' + CoC.getInstance().player.mf( 'handsome', 'beautiful' ) + ' friend.</i>"' );
		//Male Options: [Get Blown] [Pawjob];
		//Female Options: [Force Dildos];
		EngineCore.menu();
		//Req Cock;
		if( CoC.getInstance().player.hasCock() ) {
			EngineCore.addButton( 0, 'Fuck Her', this.fuckDatLionPussah );
			EngineCore.addButton( 1, 'Get Blown', this.getBlown, false );
			EngineCore.addButton( 2, 'Pawjob', this.lionpaws, false );
		}
		//Cunts & NoDicks;
		if( CoC.getInstance().player.hasVagina() || !CoC.getInstance().player.hasCock() ) {
			EngineCore.addButton( 3, 'Magic Dildos', this.forceDildos );
		}
	};
	//Get Blown (Males & Herms);
	DungeonSandWitch.prototype.getBlown = function( submit ) {
		EngineCore.clearOutput();
		EngineCore.outputText( 'You shed your armor, unleashing your ' + CoC.getInstance().player.multiCockDescriptLight() + ' into the dry heat of the desert.  Sanura licks her lips hungrily as you beckon her over, leaning back against the stone pillar to give her a good look at your fuckmeat.  The sphinx approaches, a sashay in her animalistic hips; soon she\'s running her small, delicate hands across your ' + CoC.getInstance().player.skinFurScales() + ', brushing against all the right places.  Fingertips trace along your [chest], circling your [nipples] with slow, teasing strokes before descending, tracing along your belly and down to your [hips]' );
		if( CoC.getInstance().player.balls > 0 ) {
			EngineCore.outputText( ', one hand slipping down to cup your [balls], rolling them in her palm until a white trickle escapes your [cockHead biggest]' );
		}
		EngineCore.outputText( '.  The sphinx drops to her knees before you, leaning in to stroke her tongue along the side of your [cock biggest], caressing your manhood with a tongue that\'s rough, but surprisingly gentle on your most sensitive flesh.  She laps at the tip, eagerly drinking the first drops of sticky pre before turning her attentions elsewhere, letting the next drops stain the desert stands.' );
		EngineCore.outputText( '\n\nShe nuzzles against your crotch, slowly working ' );
		if( CoC.getInstance().player.cockTotal() > 1 ) {
			EngineCore.outputText( 'each of ' );
		}
		EngineCore.outputText( 'your dick' );
		if( CoC.getInstance().player.cockTotal() > 1 ) {
			EngineCore.outputText( 's' );
		}
		EngineCore.outputText( ', massaging your manhood until you feel ready to burst with pleasure.  Only then, with bright eyes looking up at you, locked with your own, does Sanura slip the [cockHead biggest] of your [cock biggest] into her mouth, wrapping her full lips around your throbbing erection.  You groan, [legs] wobbling with need and desperation as she licks and teases your cockhead, brushing her slender digits along the underside.' );
		EngineCore.outputText( '\n\n"<i>Hold on just a little longer, my friend,</i>" the sphinx says, words muffled around the cock in her mouth.  "<i>We\'ve only just started....</i>"' );
		EngineCore.outputText( '\n\nYou start to question her meaning when she suddenly releases your prick, letting it bob stiffly in the air; spit and copious streams of pre dangle like flags from your pole.  A few strands still connect the two of you, trailing from your tip to Sanura\'s lips, painting her two full lines a milky white.  She grins up at you, even as her fingers begin to move in strange, arcane ways, weaving thin blue lines of magic in their wake as a spell takes shape.  In the blink of an eye, a pair of translucent hands appear just above Sanura\'s own, sparkling with eldritch light.  Your breath catches as the first of these magical hands brushes against your skin, a mind-numbing tingle rushing through your body from the point of contact.  Your mouth opens and closes wordlessly as your entire body seems to go slack, practically turning to liquid as the magical hands brush against your thighs and hips, tantalizingly far from your ' + CoC.getInstance().player.multiCockDescriptLight() + ', the tingling digits just out of reach of your most sensitive parts.' );
		EngineCore.outputText( '\n\nA finger brushes against your [cock biggest], just for the briefest moment.  You throw your head back and scream, your entire body convulsing as a thick rope of cum spurts from your tip, smearing Sanura\'s face with your seed.  She releases you utterly, leaving you to writhe as your ' );
		if( CoC.getInstance().player.balls > 0 ) {
			EngineCore.outputText( 'balls empty' );
		} else {
			EngineCore.outputText( 'body empties' );
		}
		EngineCore.outputText( ' out onto her eager face.  As you feel yourself winding down from the magically-induced orgasm, however, a strange blue sigil appears in the air, encircling ' );
		if( CoC.getInstance().player.cockTotal() > 1 ) {
			EngineCore.outputText( 'each of your ' );
		} else {
			EngineCore.outputText( 'your ' );
		}
		EngineCore.outputText( 'dripping cock' );
		if( CoC.getInstance().player.cockTotal() > 1 ) {
			EngineCore.outputText( 's' );
		}
		EngineCore.outputText( '.  "<i>You do want to go again, yes?  I think I\'ve got enough magic to keep that nice [cock biggest] hard for a little fun with my new hands....</i>"' );
		EngineCore.outputText( '\n\nYou nod, then shudder as the sphinx\'s sex-magic works through you, her arcane symbols reinvigorating your spent manhood.  In moments, you\'re far harder than you were before, and thick ropes of cum spill out of your tip' );
		if( CoC.getInstance().player.cockTotal() > 1 ) {
			EngineCore.outputText( 's' );
		}
		EngineCore.outputText( ' - the salty liquid flows freely onto the desert sands from Sanura\'s open mouth as your ' );
		if( CoC.getInstance().player.balls > 0 ) {
			EngineCore.outputText( '[balls] churn' );
		} else {
			EngineCore.outputText( 'body churns' );
		}
		EngineCore.outputText( ' out a seemingly endless supply of seed.  Your breath comes ragged as more and more spills out of you, your newly-potent manhood making you feel lightheaded as it expels an endless tide of cum.  Slowly, gently, Sanura leans in, wrapping her lips around the tip of your [cock biggest], lapping up the river of semen that pours into her mouth.' );
		//If Multi-cock = 3;
		if( CoC.getInstance().player.cockTotal() >= 3 ) {
			EngineCore.outputText( '\n\nAs Sanura slurps up the tip of your [cock], her ethereal hands grasp ' );
			if( CoC.getInstance().player.cockTotal() === 2 ) {
				EngineCore.outputText( 'your ' );
			} else {
				EngineCore.outputText( 'two of your ' );
			}
			EngineCore.outputText( 'other ' + Utils.num2Text( CoC.getInstance().player.cockTotal() - 1 ) + ' members, wrapping tightly around their meaty lengths.  You groan throatily as tingling digits slowly work their way up your shafts, making your heart flutter wildly with the alien sensation.' );
			//AND If Multicock = 5;
			if( CoC.getInstance().player.cockTotal() >= 5 ) {
				EngineCore.outputText( '  You barely have time to adjust to the eldritch hands jerking off your extra cocks when Sanura\'s own come into play, wading into the jumble of wangs growing from your crotch to grab another pair of pricks.  With five cocks encircled in hands, magic, and mouth, Sanura slowly begins to synchronize her movements, gently stroking your many cocks.' );
			}
		}
		EngineCore.outputText( '\n\nAfter a few moments of her mouth and hands working wonders around your flesh, the sphinx-girl begins to pick up pace; in the span of a minute she ramps up from a gentle blowjob to a full-on face-fuck, going faster and faster with every beat of your heart and spurt of seed flowing from your magically stimulated [balls].  Despite the sea of sperm you\'re creating, you can feel another orgasm approaching, rushing on despite the lingering aftershocks of the first.' );
		EngineCore.outputText( '\n\nWhen it hits, you almost lose consciousness, the sheer pleasure of the second orgasm throwing you onto your back in a writhing heap as your body convulses wildly with ecstasy.  You shudder and groan, your cock' );
		if( CoC.getInstance().player.cockTotal() > 1 ) {
			EngineCore.outputText( 's' );
		}
		EngineCore.outputText( ' geysering into the air, raining back down in a pool around you and the now cum-covered sphinx.' );
		EngineCore.outputText( '\n\n"<i>Enjoy yourself?</i>" the milk-white leonine girl asks, dropping to her knees beside you, a hand resting on your heaving chest.  You give her a weak thumbs-up, and stagger to your [feet].' );
		CoC.getInstance().player.orgasm();
		EngineCore.menu();
		if( submit ) {
			OnLoadVariables.dungeonLoc = 0; //Replaces inDungeon = false;
			EngineCore.addButton( 0, 'Next', CoC.getInstance().scenes.camp.returnToCampUseOneHour );
		} else {
			EngineCore.menu();
			EngineCore.addButton( 0, 'Enter', this.openZeDoorToParadize );
			EngineCore.addButton( 4, 'Leave', this.leaveBoobsDungeon );
		}
	};
	//Force Dildos (CuntCommanders & Genderless);
	DungeonSandWitch.prototype.forceDildos = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'You start to peel out of your [armor], but a twirled finger from Sanura has you turn to face the stone pillar and brace yourself.  With silent grace, the half-cat slinks up to you, wandering hands moving to explore your body, her slender fingers tracing along the supple curves of your [butt] and [hips], slowly moving toward your [chest] with slow, teasing motions, her every shift sending shivers up your spine.  Your breath catches as her fingers brush your [nipples], gently squeezing them' );
		//if MilkyTits:;
		if( CoC.getInstance().player.lactationQ() >= 200 ) {
			EngineCore.outputText( ' until a gentle trickle of your motherly fluids pours out across her hands.  With a girlish giggle, the sphinx slips her head under your arm, lapping at your milky teats.  A throaty purr escapes her lips before you give her a little push, getting her back to the task at hand' );
		}
		EngineCore.outputText( '.' );
		EngineCore.outputText( '\n\nThe sphinx slips down onto her knees, leaning down to put her face on level with your [butt].  You look back over your shoulder, watching as a lusty grin spreads across the leonine girl\'s lips.  She caresses your cheeks, slowly spreading them to give herself a good look at your waiting [vagOrAss].  You bend yourself over a little more, waggling your ass in Sanura\'s face invitingly.  She pats your [butt] and, looking you square in the eye, draws her tongue in a long, slow motion across your quivering hole, sending a spark of pleasure surging through your body.  Your [legs] quiver as your lover lavishes you with another lengthy, sensuous lick.  Your [vagOrAss] contracts powerfully as her feline tongue brushes it, begging for a cock to drain, to stuff it full to stretching and pump it full of warm, frothy cum.' );
		EngineCore.outputText( '\n\nInstead, the sphinx-girl teases you with another lick, and another; but as she does, you can see her fingers moving in arcane gestures, weaving thin blue lines of magic in their wake as a spell takes shape.  A long, wrist-thick pole of translucent blue light soon forms between her hands, the crown at its tip giving it the unmistakable shape of a phallus.  With a final lick across your sensitive flesh, the sphinx spreads your cheeks as wide as they\'ll go, letting your spit-slicked hole taste the dry desert air.  A moment later, you feel the tip of the spectral dildo against the mouth of your [vagOrAss], the magical energies that form it sending electric currents through your body; every hair on your bare form jumps to attention as pleasure burns in you like a fire, even before the slightest penetration.' );
		EngineCore.outputText( '\n\nWhen the tip does slide in, you nearly cum on the spot.' );
		if( CoC.getInstance().player.hasVagina() ) {
			CoC.getInstance().player.cuntChange( 10, true, true, false );
		} else {
			CoC.getInstance().player.buttChange( 10, true, true, false );
		}
		EngineCore.outputText( '\n\nEvery inch of your sensitive inner walls that the arcane pseudo-cock presses past explodes in a conflagration of pleasure, electrifying your every nerve as Sanura slowly sinks her summoned dildo into your [vagOrAss].  You clench your teeth as you try to bear the orgasmic overload radiating from your fuck-hole, but the magical shock-wave soon spreads over your entire body.  Your [legs] quiver as the half-lion sinks her rod deeper and deeper into you, reaming your innermost depths wide with inch after inch of mind-numbing stimulation.  Suddenly, though, her advance ceases, leaving you skewered on a gently-vibrating rod of arcane ecstasy.  Just as your sex-addled mind starts to question the lack of movement, you feel a sudden and overwhelming force pressing into your [vagOrAss] atop the cock already embedded inside you, trying to stretch your hole even wider.  This second ethereal prick is even bigger than the first, slowly working and wedging itself into your abused hole, forcing you open until you\'re screaming in pleasure and pain.  Finally, the massive cock pops in, and relief spreads through you as Sanura starts gently working it in, cooing softly as she penetrates you once again.' );
		if( CoC.getInstance().player.hasVagina() ) {
			//if PC has Vagina;
			EngineCore.outputText( '\n\nAs your quivering cunt tries to adjust to the pair of massive intruders tearing it apart, the sultry sphinx conjures up a third rod, just as big as the last.  You grit your teeth, bracing for her attempt to cram THAT up your slit as well, but instead feel only a gentle, probing wetness against your [ass].  You shiver from your very core as Sanura drags her tongue along your backdoor, pressing the tip in, seeking entrance.  Despite the static pleasure roiling in your cunt, you try your best to relax the muscles in your sphincter; eventually, after a few long moments of prodding, you feel the first inch of the magic dildo pierce your [asshole], stretching you out to your limit and beyond as Sanura shapes its size to utterly fill your rear entrance.' );
			CoC.getInstance().player.buttChange( 10, true, true, false );
		}
		//If PC Ain't Got No Cunt;
		else {
			EngineCore.outputText( '\n\nWith two arcade implements tearing your anus apart, you barely even notice as the tip of a third conjured rod begins pressing into your hole, fervently intent on joining its fellows.  Suddenly, you feel the two shafts already stuck inside you shift, moving aside to accommodate a third magicock, that\'s just as big as the last two Sanura filled you with.  Your entire body convulses as your poor, abused asshole is stretched beyond anything you thought it could ever take, the three massive cocks sliding deep into your bowels.  Your muscles spasm around the tingling rods, inner walls contracting hard as if to milk them of whatever these things might have that passes for cum.' );
		}
		//Recombine;
		EngineCore.outputText( '\n\nWith three huge dildos of pure energy fucking you, you don\'t have much hope of lasting long.  You dig your fingers into the hard, unyielding stone of the desert obelisk, groaning as Sanura slides her dildos in and out of you with unforgiving rhythm, the strange magic from which they\'re formed electrifying your sensitive depths with eldritch pleasure.  When you cum, you cum hard - a scream tears past your lips, echoing across the dunes.' );
		EngineCore.outputText( '\n\nAs you cum, you feel - something - shooting inside you, a flood of boiling liquid that sets your loins ablaze, spreading throughout you with orgasmic pleasure.  You shudder violently as a backwash of magical cum floods back out your [vagOrAss] on onto Sanura\'s waiting face, your belly bloating to pregnant proportions before the orgasm finally subsides.' );
		EngineCore.outputText( '\n\nYou collapse as the dildos fade into nothing inside you, leaving you feeling empty to your very core.  "<i>Enjoy yourself?</i>" the spunk-covered leonine girl asks, dropping to her knees beside you, a hand resting on your heaving chest.  You give her a weak thumbs-up, and stagger to your [feet].' );
		//(DIsplay Options: Leave, Enter);
		CoC.getInstance().player.orgasm();
		EngineCore.menu();
		EngineCore.addButton( 0, 'Enter', this.openZeDoorToParadize );
		EngineCore.addButton( 4, 'Leave', this.leaveBoobsDungeon );
	};
	//Fuck Dat Lionpussy;
	//Written by Third. Available to those who BEAT Sanura's riddle challenge.;
	DungeonSandWitch.prototype.fuckDatLionPussah = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'You disrobe, tossing your [armor] aside into a small pile.  You stretch your muscles in the dry desert air and exult in the warm rays beating down on your ' + CoC.getInstance().player.skinFurScales() + ' and ' + CoC.getInstance().player.multiCockDescriptLight() + '.  Sanura pads around you, taking in your appearance with her chestnut-colored eyes before clicking her tongue approvingly.  Her leonine tail swishes across the top of your [cock biggest], stroking it with the silky soft tuft of fur at its tip.  You shiver at the contact, unsure of what to think.  Your penis, on the other hand, has no such conflictions, and immediately begins to rise.' );
		//(Small dicks) ;
		if( CoC.getInstance().player.biggestCockArea() < 6 ) {
			EngineCore.outputText( '\n\n"<i>Aw, it\'s so cute and compact.  I didn\'t know these things came in women\'s sizes,</i>" she giggles, flicking the [cockHead biggest] of your cock with her tail.  You blush brightly.  Even by Ingnam standards you\'re a little below average, and in Mareth, well, you\'re just plain tiny.  "<i>Don\'t worry, love, it will suffice for what I have in mind.</i>"' );
		}//(Normal-sized dicks);
		else if( CoC.getInstance().player.biggestCockArea() < 30 ) {
			EngineCore.outputText( '\n\n"<i>Hm, not the biggest I\'ve seen out here, but it certainly looks delicious...</i>" she purrs, wrapping her tail around your cock.  Sanura gives it a little squeeze and flicks her tail away with a giggle.' );
		}//(Large dicks);
		else if( CoC.getInstance().player.biggestCockArea() < 100 ) {
			EngineCore.outputText( '\n\n"<i>Mmm, now that\'s what I\'m talking about,</i>" Sanura purrs, wrapping her tail around your large dick and teasing your ' );
			if( CoC.getInstance().player.balls > 0 ) {
				EngineCore.outputText( 'balls' );
			} else if( CoC.getInstance().player.hasVagina() ) {
				EngineCore.outputText( 'cunt' );
			} else {
				EngineCore.outputText( 'asshole' );
			}
			EngineCore.outputText( ' with the little tuft of fur.  "<i>That bad boy will be just perfect.</i>"' );
		} else {
			EngineCore.outputText( '\n\nSanura\'s eyes go wide upon seeing your monstrous cock.  She opens her mouth, attempting to speak, but no words come out.  Her tail reaches out, coiling around your dick in futility.  "<i>By Marae\'s pillowy tits that thing is huge,</i>" she says finally, regaining her voice.  "<i>I don\'t know if I can take something that big... but goddamnit, I\'m going to try.</i>"' );
		}

		EngineCore.outputText( '\n\nYour manhood spikes upwards at the attention, becoming painfully hard as the sphinx continues to survey your body.  Her tail flicks over your ' + CoC.getInstance().player.skinFurScales() + ' gently, stopping briefly to tantalize ' );
		if( CoC.getInstance().player.totalNipples() === 2 ) {
			EngineCore.outputText( 'both' );
		} else {
			EngineCore.outputText( 'each' );
		}
		EngineCore.outputText( ' of your nipples, which stiffen in response, just like your cock.  You can\'t help but think there\'s some sort of magic at work here.  Her tail passes between your thighs, gracefully tickling your ' );
		if( CoC.getInstance().player.hasVagina() ) {
			EngineCore.outputText( 'damp cunt, which suddenly tightens up and practically gushes with slick juices.' );
		} else {
			EngineCore.outputText( 'asshole, which reflexively tightens, sending a shiver up your spine.' );
		}

		EngineCore.outputText( '\n\nFinally she stops and looks at you head on.  "<i>All right then, lay down and let\'s do this,</i>" she says casually, crossing her arms under her small breasts.  You quirk your eyebrow at her, questioningly.  "<i>This is what you want, isn\'t it?</i>" she asks,  turning her sensuous tauric body around to show off a moist, dripping cunt.  "<i>Because that,</i>" she says, pointing at your dick as she licks her lips, "<i>is what I want.</i>"' );
		EngineCore.outputText( '\n\nThe sight of that lionpussy is all the enticement you need.  You sink to your knees, and then flop onto your back, your cock standing tall and proud just like the stone pillar nearby.  The brilliant and ravishing sphinx strides over top of you, placing a soft leathery paw over your wrists gently.  "<i>Mmm, don\'t worry about this, love, I just want to make sure you\'re not going anywhere.</i>"  You gently struggle against the paws, not actually trying to free yourself, but rather testing her strength, and she is indeed strong.' );
		EngineCore.outputText( '\n\n"<i>Let\'s start off with a bit of a warm up, shall we?</i>" she asks with a mischievous grin.  Her leonine body lowers down towards yours, making you gasp sharply as your rigid rod contacts her feline folds.  But alas, there\'s no penetration.  Instead, Sanura rocks her body up and down your shaft, tantalizing and teasing it with her hot, wet folds.  You bite your lip while the sphinx above you moans with mild delight.  "<i>O-ho,</i>" she laughs, "<i>you may have bested me intellectually, but I can still tease you.</i>"' );
		EngineCore.outputText( '\n\nSanura grips one of her breasts, pinching the nipple roughly while she continues to slip up and down your pillar of cock.  You attempt to push your hips forward, aching to penetrate her pussy, but she merely mutters, "<i>Tut-tut,</i>" and waggles a finger at you disapprovingly.  You glower up at her for a moment, and then a plan alights in your brain.  As soon as the sumptuous sphinx turns her attentions back to her breasts, you concentrate on her hip motions, developing the rhythm in your head.' );
		EngineCore.outputText( '\n\nYou count out the rhythm, and when the time is right, thrust your hips up and forward, splitting Sanura\'s cunt wide.  A look of shock crosses her face, quickly replaced by an ecstatic look of bliss.  Her lips form an O-shape, allowing a long moan to escape.  "<i>I... you\'re not supposed to...</i>" she starts, looking down at you with a mixture of annoyance and pleasure.  "<i>Oh fuck... so good!  Don\'t stop!</i>"' );
		EngineCore.outputText( '\n\nYou grin and thrust into her again.  Her hips pick up the pattern and bounce along with your hips, making wet squelching noises as you plunge your [cock biggest] into her again and again.  Sanura\'s cunt squeezes you tightly, tighter than you\'d imagine a tauric creature to be, while she plays with her pert little breasts, apparently lost in a sea of euphoric oblivion.  Small gasps leave her lips with every other thrust, escaping onto the warm desert breeze.  Your hips hammer away, your entire body becoming passionately hot, craving some form of release, but you don\'t give in just yet.' );
		EngineCore.outputText( '\n\nYou bring Sanura to her first screaming orgasm, then a second, and a third.  You don\'t stop until the sphinx is little more than a quivering mass of flesh wrapped in orgasmic rapture.  Her legs shake like jelly, barely holding your arms down, but that doesn\'t matter anymore.  You know who\'s in control of this situation, and it\'s certainly not the lioness atop you.  Thrust after thrust you bury your tool deeper within Sanura\'s cavern, bringing her to a fourth orgasm as her face distorts, showing little more than a climax-induced grin, her eyes rolled back in their sockets.' );
		EngineCore.outputText( '\n\nYou can\'t hold out much further either, and give one last push forward, embedding your cock as far as it will go' );
		if( CoC.getInstance().player.hasKnot( CoC.getInstance().player.biggestCockIndex() ) ) {
			EngineCore.outputText( ', your knot slipping into place with a moist <b>pop</b>, ensuring you\'ll be locked together for the foreseeable future' );
		}
		EngineCore.outputText( '.  Jet after jet of cum erupts from your [cock], painting the sphinx\'s inner walls white.' );
		//(low-average cum);
		if( CoC.getInstance().player.cumQ() < 250 ) {
			EngineCore.outputText( '\n\nSome of your spunk dribbles out the side and down your shaft before dripping into the hot desert sand below.' );
		}//(average-high cum);
		else if( CoC.getInstance().player.cumQ() < 750 ) {
			EngineCore.outputText( '\n\nA spurt of cum escapes Sanura\'s folds, splattering out onto your legs and the hot desert sand.' );
		}//(high-really high cum);
		else if( CoC.getInstance().player.cumQ() < 3000 ) {
			EngineCore.outputText( '\n\nSanura\'s belly visibly enlarges with all the love spunk you\'re pumping into her, and several spurts of the stuff escape her folds, coating your legs and the sand beneath you.' );
		}//(really high-woah there cum);
		else if( CoC.getInstance().player.cumQ() < 10000 ) {
			EngineCore.outputText( '\n\nSanura\'s belly distends, looking suddenly pregnant with an enormous cum-baby.  A veritable flood of spooge surges out of her abused cunt, absolutely coating your lower body and almost all the sand within several feet in the hot white fluid.' );
		} else {
			EngineCore.outputText( '\n\nSanura\'s belly expands outwards, as though she were suddenly nine months pregnant, but it doesn\'t stop there.  Her belly continues to inflate until it\'s resting on your stomach... and then it lifts her body off several inches of yours.  To top it all off, a milky white flood of biblical proportions flows out of her abused hole, coating your entire body, as well as most of the desert within ten feet, in semeny goodness.' );
		}

		EngineCore.outputText( '\n\nFinally you collapse, letting all your muscles relax.  Sanura isn\'t far behind, falling to the side of you, ' );
		if( CoC.getInstance().player.hasKnot( CoC.getInstance().player.biggestCockIndex() ) ) {
			EngineCore.outputText( 'which proves somewhat uncomfortable, given your knot is still lodged firmly within her, ' );
		}
		EngineCore.outputText( 'panting wildly.  It takes you several minutes to recover, the sphinx even longer, ' );
		if( CoC.getInstance().player.hasKnot( CoC.getInstance().player.biggestCockIndex() ) ) {
			EngineCore.outputText( 'and even longer still for your knot to deflate enough to slip out of her, ' );
		}
		EngineCore.outputText( 'but you finally gather the strength to haul yourself up onto your [feet].' );
		EngineCore.outputText( '\n\n"<i>Well, that\'s certainly not what I had in mind,</i>" Sanura says, recomposing herself after that vicious fucking.  "<i>But I can\'t say I can complain.</i>"  Neither can you, you smirk to yourself.' );
		CoC.getInstance().player.orgasm();
		EngineCore.menu();
		EngineCore.addButton( 0, 'Enter', this.openZeDoorToParadize );
		EngineCore.addButton( 4, 'Leave', this.leaveBoobsDungeon );
	};
	//Submission Options;
	DungeonSandWitch.prototype.sphinxSubmissionOptions = function() {
		EngineCore.clearOutput();
		CoC.getInstance().flags[ kFLAGS.TIMES_SUBMITTED_TO_SANURA ]++;
		EngineCore.outputText( 'Having lost the Riddle Game, you do as the sphinx-girl commands: you pull off your [armor], leaving yourself bare under the desert sun. "<i>Now then, my dull little pet, what shall I do with you...</i>"' );
		EngineCore.menu();
		//SUBMISSION:;
		EngineCore.addButton( 0, 'Get Pegged', this.fenPutsHisShittyFetishInYoSphinx );
		//Reqs Penis;
		if( CoC.getInstance().player.hasCock() ) {
			EngineCore.addButton( 1, 'Get Blown', this.getBlown, true );
			EngineCore.addButton( 2, 'Pawjob', this.lionpaws, true );
		}
	};
	//Horsecock Symphony;
	DungeonSandWitch.prototype.fenPutsHisShittyFetishInYoSphinx = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'Starting to disrobe, ' );
		if( CoC.getInstance().player.hasCock() ) {
			EngineCore.outputText( 'you flop your ' + CoC.getInstance().player.multiCockDescriptLight() + ' free in the dry desert heat, allowing ' );
			if( CoC.getInstance().player.cockTotal() === 1 ) {
				EngineCore.outputText( 'it' );
			} else {
				EngineCore.outputText( 'them' );
			}
			EngineCore.outputText( ' to sway back and forth' );
		} else if( CoC.getInstance().player.hasVagina() ) {
			EngineCore.outputText( 'you expose your [vagina] to the hot desert air, allowing it to moisten' );
		} else {
			EngineCore.outputText( 'you expose your [butt], allowing it to redden' );
		}
		EngineCore.outputText( ' as the omnipresent heat and seductive sphinx have their way with your heightened libido.  Sanura snaps her palm up in front of your face as your [armor] hits the ground, landing with a heavy thump.' );
		EngineCore.outputText( '\n\n"<i>You don\'t need to seduce me, you know?  Just go ahead and assume the position,</i>" she commands, wings fluffing the hot, dry air across her breasts, fanning her delicious tan mounds.' );
		EngineCore.outputText( '\n\nUmm, position?  You\'re not quite sure you follow, and you\'re sure to say as much.' );
		EngineCore.outputText( '\n\nSanura folds her arms across her perky tits and rolls her eyes.  "<i>You know, bent over, on the ground, ass-up and open?</i>"  She blows a strand of black hair air of the way with an exasperated sigh.  "<i>Just how long have you been in Mareth?  You know what?  Never mind, just get that ass up so I can plow it.</i>"' );
		EngineCore.outputText( '\n\nYou can\'t help but point out the obvious: she doesn\'t have a penis, at least not one you can see.' );
		EngineCore.outputText( '\n\n"<i>So?</i>"' );
		EngineCore.outputText( '\n\nWell, she can\'t really fuck your [asshole] without one...' );
		EngineCore.outputText( '\n\nSanura laughs, "<i>I\'m a sphinx.  Reality is my plaything!  Go on...</i>"  Her heavy forepaw falls on your shoulder, the soft, feline-like pads compressing soft and pillow-like against your ' + CoC.getInstance().player.skinFurScales() + ', forcing you down.  You lean over reluctantly and lift your [butt] towards the assertive lioness, shivering at how open and exposed you are like this, your [asshole] puckered and ready to be plowed.  Her other paw comes down on your right shoulder, and the shadow of her muscular, leonine lower body falls across you, causing her warm body heat to wash over you.  Sanura\'s soft underfur brushes across your back, tickling you sensually as she gets in position.  Curling over your shoulders, her toes extend deadly looking claws, but they do no more than press against the top of your chest, securing you in place with cushy paw-pads and pointed threats.' );
		EngineCore.outputText( '\n\nTilting your head to the side, you try to look up above, but all you can see past her brustling belly-fur are the pert swells of her cleavage and a few swirling, ephemeral hexagons floating around her wrists while her fingers swivel with inhuman dexterity.  There\'s a barely audible \'fwoomp\' followed by a tingling against your [asshole], abruptly carrying its magical effervescence into your sphincter as something flat and blunted butts up against it.  Your eyes open wide in surprise at the pressure on your backdoor, something Sanura takes absolute delight in seeing, bending her human-half over to take in your expression while her forepaws push you harder onto her magical spear.' );
		//Big capable entrances 100+;
		if( CoC.getInstance().player.analCapacity() >= 100 ) {
			EngineCore.outputText( '\n\nYou will yourself to relax, and like magic, your [asshole] stretches out to handle the elephantine force-cock with ease, devouring the flat, flared phallus straight into your rectum.  It distends your belly slightly as it pushes deeper, Sanura grunting when a middle ring catches for a second before popping in, rapt with the ecstasy your welcoming asshole can provide.  She provides you with a lazy smile before straightening out and placing her hand on your head, stroking your ' + Descriptors.hairDescript() + ' and lazily patting you as she finally bottoms out, accompanied by the feeling of sparking, tingling nuts slapping hard into your [butt].' );
			EngineCore.outputText( '\n\n"<i>Mmmm, I knew you\'d be a good ' + CoC.getInstance().player.mf( 'boy', 'girl' ) + '.</i>"' );
		}
		//Medium capacity! 40+!;
		else if( CoC.getInstance().player.analCapacity() >= 40 ) {
			EngineCore.outputText( '\n\nYou will yourself to relax, but even so, your [asshole] is stretched to its limit even before Sanura\'s flared force-cock can pop inside.  Whimpering in discomfort, you try to endure her forceful attempts at buttfucking.  She doesn\'t seem to have any such plans, smashing her fat, butt-destroying horse-cock against you again and again, each time spreading your asshole further, pounding your sphincter\'s structural integrity down into that of a weak, accepting anus.  You feel it bow under the pressure.  Growling, Sanura holds it there, pressing with such insistent strength that your entrance yields all at once; her member\'s brutal, bulging tip pops into your rectum.  She doesn\'t stop there.  Inch after inch of tingling, phantasmal dong is pushed straight up your straining rectum, only pausing for a brief moment when the swollen middle ring catches for a half-second.' );
			EngineCore.outputText( '\n\nElectrically charged balls the size of large melons plop against your [butt] as she bottoms out.  "<i>Mmmm, I knew you\'d be a good ' + CoC.getInstance().player.mf( 'boy', 'girl' ) + '.</i>" Sanura purrs, patting you on the head.' );
		}
		//Lowish Capacity;
		else {
			EngineCore.outputText( '\n\nYou will yourself to relax, but you just aren\'t big enough back there to make much of a difference.  Just having such an immense dong pressing at your backdoor is enough to push you to your limits, but your sphincter hasn\'t even dilated enough to take a fraction of her girth.  Sanura growls in frustration and begins to hump at it, smacking the blunted tip into it again and again. The shocking sensation makes your anal muscles twitch, spasm, and relax as she works to plow her way through your more than token resistance.' );
			//VIRGIN ALT: ;
			if( CoC.getInstance().player.ass.analLooseness === 0 ) {
				EngineCore.outputText( '\n\nShe grunts, "<i>Don\'t tell me you\'re a virgin?</i>"  You nod and bite your lip as you try to endure.  Sanura stops immediately at that news, mulling it over with a detached expression, a smile slowly spreading across her features.  "<i>Really?</i>" she asks as her hips begin to slowly work at your ass once more, slowly picking back up to their old tempo.  "<i>Then it\'s a good thing you\'re getting to ride my magic cock and not some brute\'s.  It might hurt a little, but I promise this will be buttsex worth remembering....</i>"' );
			}
			//Non-virgin;
			else {
				EngineCore.outputText( '\n\nShe grunts, "<i>Gods, you\'re tighter than a virgin imp\'s asshole!</i>"' );
			}
		}
		//Merge, no new PG;
		EngineCore.outputText( '\n\nThat\'s no small comfort to your poor, sore rectum.  It\'s going to be left gaped by this monstrous woman in short order, pounded into open, stretched submission, just like its owner.  The pain of being opened up this forcefully is enough to bring a tear to your eye and a strange surge of excitement through your crotch.  How can you be enjoying this?  You don\'t have long to ponder it, your muscles are caving in underneath Sanura\'s butt-battering fucking, slowly, inexorably stretching to handle her fat flare.  Gods!  You whimper as your [asshole] abruptly gives up the ghost and allows Sanura\'s phantom member inside, inches of her tingly fuck-tool nestling inside you in seconds.' );
		EngineCore.outputText( '\n\nSanura straightens with an unseen smile, her hand playfully tangling with your ' + Descriptors.hairDescript() + ' as she hilts the rest of the way into your abused anus, not stopping until jiggling, magical nuts slap into your [butt].  "<i>Atta ' + CoC.getInstance().player.mf( 'boy', 'girl' ) + '.  I thought for a moment that this might have been a waste of magic.  Now just settle in and enjoy it.</i>"  You wince with the knowledge that somehow, you ARE enjoying it.  The pain seems to have faded with the magical buzzing in your butthole, and all that you\'re left with is a satisfied stretching and the friction that comes with it.' );
		//END VARIATION;
		//Buttchange 75;
		CoC.getInstance().player.buttChange( 75, true, true, false );
		EngineCore.outputText( '\n\nSanura reluctantly changes direction and begins to pull the immense length out of you.  She actually yanks it back far enough that the top flops out of your gaped orifice, flopping lewdly against a [leg] as she lines back up for a second push.  As the sphinx nudges her tree-trunk-like totem into you, you try to fathom the size of the thing.  It must be several feet long and at least four inches wide by the way it\'s distending your innards, maybe five inches across at the tip.  Moaning, you helplessly give yourself over to the unusual feelings her ephemeral erection installs in your plugged-up pucker.' );
		EngineCore.outputText( '\n\n"<i>Yeah, I knew you\'d like it,</i>" Sanura drawls, "<i>I had you pegged for some kind of butt-slut when I met you.</i>"  She lurches her hips forward to bury herself the rest of the way inside.  "<i>Now, I just have you pegged.</i>"  She smirks and resumes a long, slow reaming of your bowels.' );
		if( CoC.getInstance().player.cockTotal() > 0 ) {
			EngineCore.outputText( '  Pre-cum oozes from [eachCock] in steady strings that dangle onto the dirt, painting a swirled pattern beneath you as your prostate is pushed hard enough to squeeze trickles of your salty \'milk\' from you.' );
		}
		EngineCore.outputText( '\n\nMoving faster now, Sanura descends into sexual frenzy.  She ruts your butthole like a beast possessed, and given the phantasmal nature of her equine dick, you have to wonder if that isn\'t what happened.  The leonine beauty savagely pounds your [asshole] with long, heavy strokes, leaving nothing but tingling excitement in her wake.' );
		if( CoC.getInstance().player.cockTotal() > 0 ) {
			EngineCore.outputText( '  Whenever her flare slides past your prostate, the wide, blunt head squeezes it hard enough to express a huge strand of pre.' );
		}
		EngineCore.outputText( '  After a few such thrusts, her bouncing, fake balls rise up in their faux, fleshy sack.  Her swollen dick-tip engorges more than you thought possible inside you, wide enough for you to touch through your belly and marvel at the size.  Quivering from head to four lion-like toes, Sanura cums.' );
		EngineCore.outputText( '\n\nThe butt-breaking horse-cock releases enough cum into you to make your middle audibly gurgle and your belly begin to distend, flooding your intestines with tingles and liquid warmth.  Thankfully, Sanura slowly begins to pull out, even as she\'s cumming, her cock flexing in your brutalized asshole for every inch it\'s pulled past, leaving enough goo in its wake that your innards never get to relax.' );
		if( CoC.getInstance().player.cockTotal() > 0 ) {
			EngineCore.outputText( '  When she crosses the lump that is your well used prostate, you lose control and shudder with a nice, long cum of your own, your arms giving out and dumping you face-down on the ground while you spurt milky whiteness onto your chest, chin, and then the ground.' );
		} else {
			EngineCore.outputText( '  When she\'s almost out, you give in and cum, quivering around her magical breeding tool while it finishes inseminating your guts.' );
		}
		EngineCore.outputText( '  The head is so swollen that she actually struggles to pop it back out of your [asshole], bouncing her hips back a few times with little success' );
		if( CoC.getInstance().player.cockTotal() > 0 ) {
			EngineCore.outputText( ' and dragging you through your fresh, milky puddle' );
		}
		EngineCore.outputText( '.  Eventually, she gives a mighty, sphincter-stretching lurch and ejects from your [butt], painting it white on the way out.' );
		EngineCore.outputText( '\n\nYou collapse in a well-fucked heap while Sanura\'s extra addition fades away.  She lays down next to you, fanning her face with her wings as you try to recover.  Her arm rubs one of your cheeks, still sensitive from whatever magic was in her balls, and she says, "<i>That was great fun.  Let\'s do it again sometime?</i>"' );
		EngineCore.outputText( '\n\nYou muster the strength for a thumbs up, a dopey smile still painted on your face.' );
		CoC.getInstance().player.orgasm();
		OnLoadVariables.dungeonLoc = 0; //Replaces inDungeon = false;
		EngineCore.menu();
		EngineCore.addButton( 0, 'Next', CoC.getInstance().scenes.camp.returnToCampUseOneHour );
	};
	//Sand Mother;
	//*Notes:;
	//8'3" tall.;
	//Dark Tan, almost white-bleached hair.;
	//Sky blue eyes;
	//Four gigantic breasts that nearly obscure her belly button.;
	//Amused the PC made it to her, but Angry.;
	//Uses a scepter as a weapon;
	//*Encounter:;
	DungeonSandWitch.prototype.sandWitchMotherFriendlyMenu = function() {
		if( CoC.getInstance().monster.short !== 'Sand Mother' ) {
			Combat.startCombat( new SandMother(), true );
			CoC.getInstance().setInCombat( false );
			CoC.getInstance().monster.HP = 0;
		}
		EngineCore.menu();
		if( CoC.getInstance().flags[ kFLAGS.SAND_WITCH_LEAVE_ME_ALONE ] === 0 ) {
			EngineCore.addButton( 0, 'StopAttacking', this.leaveAloneSendLackeysToggle );
		} else {
			EngineCore.addButton( 0, 'StartAttacking', this.leaveAloneSendLackeysToggle );
		}
		EngineCore.addButton( 1, 'SandMothers', this.askHowSandMothersAreChosen );
		EngineCore.addButton( 2, 'Cum Witches', this.discussCumWitches );
		EngineCore.addButton( 3, 'CovenStatus', this.currentStateOfInterwebs );
		EngineCore.addButton( 4, 'History', this.sandWitchHistory );
		if( CoC.getInstance().flags[ kFLAGS.SAND_WITCH_LOOT_TAKEN ] < 5 ) {
			EngineCore.addButton( 5, 'Get LaBova', this.getLaBova );
			EngineCore.addButton( 6, 'Get Lactaid', this.getLactaidFromWitches );
		}
		if( (CoC.getInstance().flags[ kFLAGS.ESSY_MET_IN_DUNGEON ] > 0 && CoC.getInstance().flags[ kFLAGS.TOLD_MOTHER_TO_RELEASE_ESSY ] === 0) || (CoC.getInstance().flags[ kFLAGS.MET_MILK_SLAVE ] > 0 && !isNaN( CoC.getInstance().flags[ kFLAGS.MILK_NAME ] )) ) {
			EngineCore.addButton( 7, 'Free Slaves', this.slavesDiscussion );
		}
		if( CoC.getInstance().player.lust >= 33 ) {
			EngineCore.addButton( 8, 'Sex', this.sexWithFriendlySandMother );
		}

		EngineCore.addButton( 9, 'Leave', EventParser.playerMenu );
	};
	DungeonSandWitch.prototype.slavesDiscussion = function() {
		EngineCore.menu();
		if( CoC.getInstance().flags[ kFLAGS.ESSY_MET_IN_DUNGEON ] > 0 && CoC.getInstance().flags[ kFLAGS.TOLD_MOTHER_TO_RELEASE_ESSY ] === 0 ) {
			EngineCore.addButton( 0, 'Essrayle', CoC.getInstance().scenes.essrayle.askMotherToReleaseEssy );
		}
		if( CoC.getInstance().flags[ kFLAGS.MET_MILK_SLAVE ] > 0 && !isNaN( CoC.getInstance().flags[ kFLAGS.MILK_NAME ] ) ) {
			EngineCore.addButton( 1, 'Milk-Slave', this.freeSlaves );
		}
	};
	//Getting a Milk Slut, Purity Style;
	//{Having beat the Sammiches, and made Momma Witch your friend, add a button labeled [Free Slaves] to Momma's menu. Needs to have met Milk Slut.};
	DungeonSandWitch.prototype.freeSlaves = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'Thinking back to the poor, mind-broken tittymonster of a bath girl you met here in the witches\' coven, you tell the Sand Mother it\'s about time to free her and any other slaves she\'s got hidden away.' );
		EngineCore.outputText( '\n\nThe Sand Mother cocks an eyebrow at you, and makes a rather haughty scoff from atop her throne.  "<i>You may have beaten my guardians, but what makes you think you can just order something like that, outsider?  The slaves are vital to the workings of the coven; we can\'t simply </i>release<i> them.</i>"' );
		if( CoC.getInstance().player.inte <= 20 ) {
			EngineCore.outputText( '\n\nYou start to respond, stop, and have to think for a moment.  You spend a good long minute contemplating, before shrugging.  You\'re sure there\'s a convincing argument against this, but can\'t think of it at the moment.' );
			//[Back to menu;
			EngineCore.doNext( EventParser.playerMenu );
			return;
		}
		// Else:;
		EngineCore.outputText( '\n\nYou shake your head. The witches claim to be opposed to the demons, yet what do they do?  They attack travelers who don\'t submit, enslave those who resist, and Marae knows what else.  This cannot stand.  The Sand Mother\'s no better than the demons if she\'s a slaver, keeping people like the poor milk girl as little more than cattle.' );
		EngineCore.outputText( '\n\nThe Sand Mother scowls, and rises from her throne.  "<i>Come with me,</i>" she says, ushering you from the room and through the many corridors of her subterranean haven.  Eventually, she brings you to the bath chamber.  Huddled in the corner is the huge-breasted girl, dozing lightly until the elder witch clears her throat.  In an instant, the girl\'s up and crawling meekly over, hands supporting her massive teats as she mewls, "<i>Bath time, Mistress?</i>"' );
		EngineCore.outputText( '\n\n"<i>No, girl,</i>" the witch says, eliciting a confused look from the slave girl.  "<i>Why don\'t you tell your friend here just how much you want to be free, girl. Use your words.</i>"' );
		EngineCore.outputText( '\n\n"<i>M-mistress?</i>" the slave girl says, head cocked to the side.  "<i>I...</i>" she whines, visibly struggling to form a few simple words before giving up and repeating her milky mantra: "<i>Bath time?</i>"' );
		EngineCore.outputText( '\n\nThe Sand Mother shakes her head and turns back to you.  "<i>She\'s addled, [name].  Even if I were to let her go, she\'d just be snatched up by the demons or some wandering pervert.  Gods know there\'s no shortage of either.  Releasing her into the wilds is more cruel than keeping her penned, where at least she\'s cared for - and useful, too.  She fulfils a function amongst us, dear [name], and for that she is honored and tended to.  All her needs are met, and she wants for nothing.  Can you in good conscious demand her release, dooming her to rape and torment and corruption?</i>"' );
		//[Yes] [No] [Gimme her];
		EngineCore.menu();
		EngineCore.addButton( 0, 'Yes', this.yesDemandMilkRelease );
		EngineCore.addButton( 1, 'No', this.noDemandMilkRelease );
		EngineCore.addButton( 2, 'Gimme Her', this.gimmeDatDeliciousMilkWaifuINeedMoreWaifusCauseTheTwoCowslutsWerentEnoughForMyInsatiableLacticLustandDesire );
	};
	//Yes (No Change);
	DungeonSandWitch.prototype.yesDemandMilkRelease = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'You tell the Sand Mother that everyone deserves freedom, even if they\'re addle-minded, or useful.  She can\'t just <i>keep people</i> because she feels like they\'re better off in her care.' );
		EngineCore.outputText( '\n\nShe sighs, shaking her head sadly as she starts back toward the throne room.  "<i>You\'re a bleeding heart idealist, [name].  You\'d condemn the girl to torment for the sake of your petty morality.  There\'s no room for sentimentality these days.  Every soul I keep from becoming a demon, even if I keep them in chains, is on my conscious.  Yet I bear that weight gladly, [name].  Perhaps one day, when you\'re ready to take on that same responsibility, you\'ll understand.</i>"' );
		//[PC is left in Milk Room];
		CoC.getInstance().scenes.dungeonCore.dungeonEnterRoom( DungeonSandWitch.DUNGEON_WITCH_BATH_ROOM );
		//	kGAMECLASS.dungeonLoc = 33;;
		//	EngineCore.doNext(CoC.getInstance().scenes.camp.campMenu);;
	};
	//No (No Change);
	DungeonSandWitch.prototype.noDemandMilkRelease = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'You suppose not, when she puts it that way.  The poor girl\'s probably better off here than in the clutches of the demons.  Seeing you relent, the Sand Mother smiles and pats your shoulder.  "<i>I\'m glad you can see things my way, [name].  There is wisdom in you.  Come, let us speak of other things,</i>" she says, leading you back to her throne room.' );
		EngineCore.doNext( EventParser.playerMenu );
	};
	//Gimme her (Gimme dat delicious milk slut);
	DungeonSandWitch.prototype.gimmeDatDeliciousMilkWaifuINeedMoreWaifusCauseTheTwoCowslutsWerentEnoughForMyInsatiableLacticLustandDesire = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'You have a better idea: give the girl to you.  You can care for and protect her in your camp, but also give her at least as much freedom as is safe in these dire times.' );
		EngineCore.outputText( '\n\nThe Sand Mother sighs, shaking her head sadly.  "<i>You\'re an idealist, [name].  But there is wisdom in your words.  Perhaps...  perhaps you are correct.  However, she is quite useful to our coven.  Perhaps I could be persuaded to part with her, if certain recompense was made.  Two thousand gems should be sufficient.</i>"  The sorceress looks at you, awaiting your answer.' );
		if( CoC.getInstance().player.gems < 2000 ) {
			EngineCore.outputText( '\n\n<b>You haven\'t got that much.</b>' );
		}
		EngineCore.menu();
		//[2 Expensive][Buy Her];
		EngineCore.addButton( 0, '2 Expensive', this.TwoExpensive4Me );
		if( CoC.getInstance().player.gems >= 2000 ) {
			EngineCore.addButton( 1, 'Buy Her', this.BuyHer );
		}
	};
	DungeonSandWitch.prototype.TwoExpensive4Me = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'You explain that you can\'t afford that much.' );
		EngineCore.outputText( '\n\nThe Sand Mother shrugs and says, "<i>Then ask after her when you do.</i>"  She doesn\'t stick around long enough for you to reply, leaving you standing there with the milk girl.' );
		EngineCore.outputText( '\n\n"<i>Bath time?</i>"' );
		CoC.getInstance().scenes.dungeonCore.dungeonEnterRoom( DungeonSandWitch.DUNGEON_WITCH_BATH_ROOM );
		//	kGAMECLASS.dungeonLoc = 33;;
		//	EngineCore.doNext(CoC.getInstance().scenes.camp.campMenu);;
	};
	DungeonSandWitch.prototype.BuyHer = function() {
		EngineCore.clearOutput();
		CoC.getInstance().player.gems -= 2000;
		EngineCore.outputText( 'You hand over two thousand of your hard-earned gems.' );
		EngineCore.outputText( '\n\nThe Sand Mother quips, "<i>Very well, take the girl.  Give her freedom, and keep her safe.  She has more than earned a life of ease after years of faithful service.  The others we keep...  there is a city not far from here.  I will deliver my other servants there in the night.  Perhaps they will find solace in the arms of the last free city in Mareth.</i>"' );
		EngineCore.outputText( '\n\n"<i>Mistress?</i>" the milk girl says, looking between you and the Sand Mother.' );
		EngineCore.outputText( '\n\nSmiling beatifically, the Mother kneels down and pats the slave\'s cheek.  "<i>You\'re free now, daughter.  [name] will take you from here, to someplace where you can be free and safe.  Do you understand, darling?  I\'m no longer your mistress.</i>"' );
		EngineCore.outputText( '\n\nA confused moment later, the idea seems to dawn on her milk-addled mind.  The slave girl turns to you, trying desperately to stand under the weight of her gigantic udders.  "<i>[Master]?</i>"' );
		EngineCore.outputText( '\n\n"<i>No, no,</i>" you say, moving to support her tremendous teats\' weight, "<i>Not [master], [name].  Understand?  I\'m [name].</i>"' );
		EngineCore.outputText( '\n\n"<i>[name]!</i>" she echoes with childish glee, finally able to stand upright with your aid.' );
		EngineCore.outputText( '\n\nOpening the chamber\'s door for you, the Sand Mother adds, "<i>I will send a few of my daughters to your camp with her... trappings.  You\'ll need to milk her frequently, and that deluge of lactation must go somewhere; a big bowl, if you like.  If nothing else, your camp and any other followers you accrue will never lack for milk.</i>"' );
		EngineCore.outputText( '\n\nYou thank the Sand Mother for her understanding, and the kindness she\'s shown your milky friend.  She nods, a wry smile on her dusky lips as you steady the milkmaid, helping her out of the room she\'s called home for gods know how long, and out into the desert sands - to camp.  To her new home.' );
		OnLoadVariables.dungeonLoc = 0; //After buying her the player leaves the dungeon and returns to camp
		//[Next] (To Arriving At Camp);
		EngineCore.menu();
		EngineCore.addButton( 0, 'Next', CoC.getInstance().scenes.milkWaifu.arriveWithLacticWaifuAtCamp );
	};
	DungeonSandWitch.prototype.sexWithFriendlySandMother = function() {
		EngineCore.menu();
		//friendly cunt fuck:;
		if( CoC.getInstance().player.hasVagina() && CoC.getInstance().player.lust >= 33 ) {
			EngineCore.addButton( 0, 'GetMilkFill', this.lesboMilkFilling );
		}
		//dick fucking, must fit!;
		if( CoC.getInstance().player.hasCock() && CoC.getInstance().player.lust >= 33 ) {
			if( CoC.getInstance().player.cockThatFits( CoC.getInstance().monster.vaginalCapacity() ) >= 0 ) {
				EngineCore.addButton( 1, 'Fuck Her', this.friendlySandMotherFuck );
			}
		}
		EngineCore.addButton( 4, 'Back', this.sandWitchMotherFriendlyMenu );
	};

	DungeonSandWitch.prototype.sandMotherPOMenu = function() {
		if( CoC.getInstance().monster.short !== 'Sand Mother' ) {
			Combat.startCombat( new SandMother(), true );
			CoC.getInstance().setInCombat( false );
			CoC.getInstance().monster.HP = 0;
		}
		EngineCore.menu();
		//toggle withc attacking;
		if( CoC.getInstance().flags[ kFLAGS.SAND_WITCH_LEAVE_ME_ALONE ] === 0 ) {
			EngineCore.addButton( 0, 'StopAttacking', this.unfriendlyWitchToggle );
		} else {
			EngineCore.addButton( 0, 'StartAttacking', this.unfriendlyWitchToggle );
		}
		if( CoC.getInstance().player.lust >= 33 ) {
			if( CoC.getInstance().player.hasVagina() ) {
				EngineCore.addButton( 1, 'Scissor', this.scissorAndDrink );
			}
			if( CoC.getInstance().player.tentacleCocks() >= 5 ) {
				EngineCore.addButton( 2, 'TentacleBang', this.tentacleGangBang );
			}
			if( CoC.getInstance().player.hasCock() ) {
				if( CoC.getInstance().player.cockThatFits( CoC.getInstance().monster.vaginalCapacity() ) >= 0 ) {
					EngineCore.addButton( 3, 'Fuck Her', this.fuckTheSandMothersCunt );
				}
			}
		}
		if( CoC.getInstance().flags[ kFLAGS.SAND_WITCH_LOOT_TAKEN ] < 5 ) {
			EngineCore.addButton( 5, 'Get LaBova', this.takeLaBovaOrLactaid, false );
			EngineCore.addButton( 6, 'Get Lactaid', this.takeLaBovaOrLactaid );
		}
		if( CoC.getInstance().flags[ kFLAGS.ESSY_MET_IN_DUNGEON ] > 0 && CoC.getInstance().flags[ kFLAGS.TOLD_MOTHER_TO_RELEASE_ESSY ] === 0 ) {
			EngineCore.addButton( 7, 'Essrayle', CoC.getInstance().scenes.essrayle.askMotherToReleaseEssy );
		}
		EngineCore.addButton( 9, 'Leave', EventParser.playerMenu );
	};

	DungeonSandWitch.prototype.sandMotherStuffGOA = function() {
		EngineCore.clearOutput();
		//*Encounter Repeat:;
		if( CoC.getInstance().flags[ kFLAGS.SAND_WITCHES_FRIENDLY ] > 0 ) {
			EngineCore.outputText( 'The Sand Mother slightly inclines her head in your direction as you enter her throne room.  She is every bit as imposing as you recall, or at least as imposing as a woman with four watermelon-sized jugs on her chest can be.  "<i>You have returned to us, far traveler.  Is there something you desire from the coven of the sands?  Simply ask for what you need, and we shall aid you against the demon Queen.</i>"  The lactation-obsessed arch-enchantress idly pushes a whitish-blonde curl out of her eyes as she awaits your reply.' );
			//Display Friendly Choices;
			this.sandWitchMotherFriendlyMenu();
			return;
		}
		//*Encounter Repeat: Cowed;
		else if( CoC.getInstance().flags[ kFLAGS.SAND_MOTHER_DEFEATED ] > 0 ) {
			EngineCore.outputText( 'The Sand Mother glares down at you from atop her throne, but does not dare lift a finger against you, not after her previous defeat.  She hisses, "<i>You\'ve already plundered my coven!  What more do you want from us?</i>"  even as her chest heaves in a panic.  Four mountainous peaks jut from the witch\'s silken robe... you have a few ideas, and the Queen Witch seems to have some of her own.' );
			//Resisting Options;
			EngineCore.outputText( '\n\nThe Sand Mother cringes back in her throne, eyeing you warily.  It appears you\'ve made an enemy, however, at least it is an enemy that fears you.  There\'s a chest full of potions of La Bova and Lactaid behind her throne' );
			if( CoC.getInstance().flags[ kFLAGS.SAND_WITCH_LOOT_TAKEN ] >= 5 ) {
				EngineCore.outputText( ', though right now it sits empty.  You\'ll need to wait for them to restock it' );
			} else {
				EngineCore.outputText( ', and noone could stop you from taking them' );
			}
			EngineCore.outputText( '.' );
			this.sandMotherPOMenu();
		}
		//Encounter Repeat: Undecided;
		//The Sand Mother gazes at you uncertainly as you return, her defeat at your hands still fresh in her memory.  The bleach-blond matriarch looks to have recovered from the fight, but she lamely queries, "<i>Well, you've proven yourself mightier than my magic.  All that remains is a choice.  Do you show your true colors, pawn of demons, or do you tread the path of virtue?</i>"  Sure, she puts on a brave face, but the nervous tics at the taut corners of her mouth reveal her worry. ;
		else {
			EngineCore.outputText( 'Reclining atop an intricately carved throne is what can only be described as the Queen Sand Witch.  The imposing, statue-esque woman must be over eight feet tall when standing, with a quartette of watermelon-sized tits and proud, three-inch long nipples that clearly show through her fine, silken robe.  Platinum blonde tresses hang down to her shoulders, so bleached they\'re nearly white.  She glares down at you imperiously with unusual, glowing eyes.  Her irises are solid white and luminant, leaving only the black of her pupils to eye you with.  She inquires, "<i>So, you are the one to get my girls\' skirts in a bunch.</i>"' );
			EngineCore.outputText( '\n\nThe Witch Queen steeples her fingers and considers you above them.  "<i>Well, what brings on your intrusion of my coven?  ' );
			if( CoC.getInstance().player.cor >= 66 ) {
				EngineCore.outputText( 'You stink of corruption, but I still sense a soul within you.  You are not a demon... yet.' );
			} else {
				EngineCore.outputText( 'You do not stink of corruption over-much, like many in this land, but that does not mean you are not an agent of the Lethice\'s.' );
			}
			EngineCore.outputText( '  Explain your actions, heathen, or be scourged from this chamber like one of Lethice\'s demons.</i>"' );
			EngineCore.outputText( '\n\nThis woman... she seems poised to attack.  You had best choose your actions carefully.  Do you simply explain your situation?  Do you just fight her and explain later?' );
			//[Explain] [Fight];
			EngineCore.menu();
			EngineCore.addButton( 0, 'Explain', this.explainYourSelfToZeSandBitch );
			EngineCore.addButton( 1, 'Fight', this.fightTheSandWitch );
		}
	};
	//*Explain to Sand Mother;
	DungeonSandWitch.prototype.explainYourSelfToZeSandBitch = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'You explain that you came here through a portal from a place called Ingnam, sent as a champion to defend your land from the demons.  Recounting your travels and experiences here, you confidently explain your discovery of this coven, and your misconceptions about the sand witches.  They seemed as lust crazed as the rest of the lands, and you had assumed them to be in league with the demons you found so frequently.' );
		EngineCore.outputText( '\n\nThe Queen Witch listens with rapt attention to your tale, but when you finish, all she does is close her eyes, seemingly lost in thought.  You pause, awaiting her reply.  Seconds tick by, then merge into minutes.  You idly tap your [foot].  Will she ever get done mulling over your words?' );
		EngineCore.outputText( '\n\nSuddenly, the Queen jerks up, looking you in the eye with her strange, white-irised gaze.' );
		//(No new PG.  Corrupt version);
		if( CoC.getInstance().player.cor > CoC.getInstance().player.inte || CoC.getInstance().scenes.jojoScene.monk >= 5 || CoC.getInstance().player.findStatusAffect( StatusAffects.Exgartuan ) >= 0 || CoC.getInstance().scenes.amilyScene.amilyCorrupt() || CoC.getInstance().flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00283 ] > 0 || CoC.getInstance().flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00282 ] > 0 || CoC.getInstance().flags[ kFLAGS.NIAMH_STATUS ] > 0 ) {
			EngineCore.outputText( '  "<i>There is some truth to your tale, [name], but I am a Sand Mother.  We are schooled in the art of sussing out the corrupt or unclean.  If we could not detect disguised demons and demonic agents, we would not flourish as we do now, and this great desert would not be on the cusp of resurrection.</i>"' );
			EngineCore.outputText( '\n\nThe Sand Mother steps out of her throne, brandishing a shining scepter as she rises.  Her lips curve into a cruel smile and she challenges, "<i>Fight me, [name], and fall like every demonic agent before you.  Do not fear, for when you lose, you shall be reborn to serve a just cause.  Your taint may yet be exorcised.</i>"' );
			EngineCore.outputText( '\n\nThere\'s no way out, it\'s a fight!' );
			//(start combat);
			Combat.startCombat( new SandMother(), true );
		}
		//(No new PG. Corruption is less than intellect and no major asshole moves made:) ;
		else {
			EngineCore.outputText( '  "<i>Your tale has the ring of truth to it, [name].  I am the Sand Mother of this coven, and it seems we are not enemies after all.  If you like I can instruct my daughters to let you pass through the sands unhindered.</i>"  She spreads her arms graciously and asks, "<i>Was there anything you would like to discuss?  It has been an age since I\'ve had a new arrival to converse with.</i>"\n\n(+200 XP)' );
			//(Award XP);
			CoC.getInstance().player.XP += 200;
			MainView.statsView.showStatUp( 'xp' );
			EngineCore.statScreenRefresh();
			//(Set friendly);
			CoC.getInstance().flags[ kFLAGS.SAND_WITCHES_FRIENDLY ] = 1;
			//Options: Turn off Sand Witches, Turn on Sand Witches, Fuck (if PC is male or fem), Discuss history, Discuss Coven's Current State;
			//friendly menu!;
			this.sandWitchMotherFriendlyMenu();
		}
	};
	//*Fight;
	DungeonSandWitch.prototype.fightTheSandWitch = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'You brandish your [weapon] and advance threateningly.  The Sand Witch Queen slowly rises, pulling a scepter from beneath her robes with a resolute look in her eyes.  "<i>You shall regret this action for a time, until we\'ve corrected your diseased way of thinking.  Now, taste the power of a Sand Mother!</i>"' );
		Combat.startCombat( new SandMother(), true );
	};
	//Earthshield;
	DungeonSandWitch.prototype.earthShield = function() {
		//Surrounds the witch a vortex of stones, raising her defense greatly and conferring 25% block to standard attacks.;
		EngineCore.outputText( 'Lowering her scepter towards the ground, the eight-foot tall sorceress suddenly grunts, lifting it as if carrying great weight.  As the small staff passes her chest, bits of stone and rock begin to lift out of the ground, accelerating into a vortex of earth that spins around her.  <b>It\'s going to be harder to hit her with physical attacks now!</b>' );
		CoC.getInstance().monster.createStatusAffect( StatusAffects.Earthshield, 0, 0, 0, 0 );
		Combat.combatRoundOver();
	};
	//*GigaFire;
	DungeonSandWitch.prototype.gigaFire = function() {
		//Begins focusing into her staff, which floats in front of her.  PC disrupt attack by attacking.  Attack hits at half strength if disrupted.;
		EngineCore.outputText( 'Releasing the scepter, the Sand Mother spreads her hands, each glowing with eldritch, white flames.  Her heels slowly float up off the ground as she closes her eyes in concentration.  You can sense the power and heat rolling off her in waves, and if you don\'t do something to disrupt her, you\'ll likely be burned to a crisp.' );
		if( CoC.getInstance().player.inte > 40 ) {
			EngineCore.outputText( '  She\'s not even looking at you and seems steeled against lusty interruptions.  Perhaps you can hit her hard enough to shatter her concentration.' );
		}
		CoC.getInstance().monster.createStatusAffect( StatusAffects.Gigafire, 0, 0, 0, 0 );
		Combat.combatRoundOver();
	};
	DungeonSandWitch.prototype.gigaFire2 = function() {
		var damage = 40 + Utils.rand( 11 );
		//Not interrupted:;
		if( CoC.getInstance().monster.statusAffectv1( StatusAffects.Gigafire ) < 10 ) {
			EngineCore.outputText( 'The Sand Mother grabs her scepter in both hands, combining the flames that wreath them into an immense, blinding conflagration.  She points at you, and the fire washes out in a wave like a serpent, twisting at you as you try to avoid it, doubling back on itself whenever it misses.  It\'s unavoidable!  You\'re enveloped in the consuming fire!' );
			damage *= 3;
		}
		//Interrupted:;
		else {
			EngineCore.outputText( 'Thumbling back to the ground from your damaging hit, the Sand Mother grabs at her head, one flame going out.  She recovers in time to grab the staff and fling it towards you, but it\'s at a fraction of the strength she intended.  Still, it burns all the same.' );
		}
		damage = Combat.takeDamage( damage );
		EngineCore.outputText( ' (' + damage + ')' );
		CoC.getInstance().monster.removeStatusAffect( StatusAffects.Gigafire );
		Combat.combatRoundOver();
	};
	//*Telekinesis;
	//Throws the PC against the wall.  Does more damage to shorter, thinner PCs.;
	DungeonSandWitch.prototype.sandMotherTelekinesis = function() {
		EngineCore.outputText( 'She narrows her eyes at you, and an immense, magical pressure reaches out, taking hold of you.  It spins you in the air before slamming you into the walls!' );
		var sizeMod = 100;
		var thickMod = CoC.getInstance().player.thickness / 100 + 0.5;
		sizeMod += CoC.getInstance().player.tallness * thickMod;
		if( sizeMod < 140 ) {
			EngineCore.outputText( '  You immediately wish you weren\'t so small, as you\'re sure she couldn\'t have flung a heavier champion nearly as easily.' );
		} else if( sizeMod >= 200 ) {
			EngineCore.outputText( '  You\'re glad for your size, as she couldn\'t seem to accelerate you into the stone as fast as she\'d like.  Sometimes eating plenty pays off.' );
		}
		//0 thickness, 4' tall: 124;
		//100 thickness, 4' tall: 172;
		//0 thickness, 6' tall: 136;
		//100 thickness, 6' tall: 208;
		//0 thickness, 8' tall: 148;
		//100 thickness, 8' tall: 244;
		var multiplier = sizeMod / 170;
		var damage = 20;
		damage = multiplier * damage;
		damage = Combat.takeDamage( damage );
		EngineCore.outputText( ' (' + damage + ')' );
		Combat.combatRoundOver();
	};
	//*Lightning Bolt;
	//Unavoidable magic damage.;
	DungeonSandWitch.prototype.eatALightningBolt = function() {
		EngineCore.outputText( 'Holding her staff back, she lifts her free hand with her fingers outstretched in a fan.  Sparks dance between her slender digits, coiling around them like snakes.  In a flash, they rush to her palm and erupt in a lightning bolt, striking you instantly and unavoidably!' );
		var damage = 30 + Utils.rand( 10 );
		damage = Combat.takeDamage( damage );
		EngineCore.outputText( ' (' + damage + ')' );
		Combat.combatRoundOver();
	};
	//*Whisper:;
	//As ackbal, stuns the PC 1 round.  Cannot be resisted.;
	DungeonSandWitch.prototype.getWhispered = function() {
		EngineCore.outputText( 'Mouthing, "<i>Can you hear me?</i>" the witch\'s voice intrudes into your mind, matching her mouth word for word.  She floods your psyche with words and thoughts, all of your defeat or submission, each more degrading and more humiliating than the last.  Perhaps the worst are the ones where she turns you over to Lethice after you\'re broken...  The tumultous thoughts and emotions both stun and arouse you, preventing you from attacking while you try to clear your beleaguered consciousness.' );
		CoC.getInstance().player.createStatusAffect( StatusAffects.Whispered, 0, 0, 0, 0 );
		EngineCore.dynStats( 'lus', 15 );
		Combat.combatRoundOver();
	};
	//Notes:;
	//Starts combat with sandstorm.  GigaFire's every fifth round.;
	//Whispers every fourth.;
	DungeonSandWitch.prototype.sandWitchMotherAI = function() {
		if( CoC.getInstance().monster.findStatusAffect( StatusAffects.Sandstorm ) < 0 ) {
			this.sandStormAttack();
			return;
		}
		if( CoC.getInstance().monster.findStatusAffect( StatusAffects.Gigafire ) >= 0 ) {
			this.gigaFire2();
			return;
		}
		var choices = [];
		if( CoC.getInstance().player.findStatusAffect( StatusAffects.Whispered ) < 0 ) {
			choices[ choices.length ] = this.getWhispered;
		}
		choices[ choices.length ] = this.eatALightningBolt;
		choices[ choices.length ] = this.sandMotherTelekinesis;
		choices[ choices.length ] = this.gigaFire;
		choices[ choices.length ] = this.earthShield;
		choices[ Utils.rand( choices.length ) ]();
	};

	//*Defeat the Sand Mother;
	DungeonSandWitch.prototype.defeatTheSandMother = function() {
		EngineCore.clearOutput();
		CoC.getInstance().flags[ kFLAGS.SAND_MOTHER_DEFEATED ] = 1;
		EngineCore.outputText( 'Panting ' );
		if( CoC.getInstance().player.HP < 1 ) {
			EngineCore.outputText( 'in exhaustion' );
		} else {
			EngineCore.outputText( 'with lust' );
		}
		EngineCore.outputText( ', the Sand Mother sinks back into her throne with sweat and milk staining her silky robes.  She groans softly, the milk-stains slowly spreading as you consider your options.  This woman dared to stand against you.  What do you do?' );
		//[Fuck Her Cunt] [ScissorAnDrink] [Talk Her Down];
		EngineCore.menu();
		EngineCore.addButton( 0, 'TalkHerDown', this.talkDownTheMother );
		if( CoC.getInstance().player.hasVagina() ) {
			EngineCore.addButton( 1, 'Scissor', this.scissorAndDrink );
		}
		if( CoC.getInstance().player.hasCock() && CoC.getInstance().player.cockThatFits( CoC.getInstance().monster.vaginalCapacity() ) >= 0 ) {
			EngineCore.addButton( 2, 'Fuck Her', this.fuckTheSandMothersCunt );
		}
		if( CoC.getInstance().player.tentacleCocks() >= 5 ) {
			EngineCore.addButton( 3, 'TentacleFuck', this.tentacleGangBang );
		}
	};
	DungeonSandWitch.prototype.loseToTheSandMother = function() {
		EngineCore.clearOutput();
		//DUDALICIOUS;
		if( CoC.getInstance().player.hasCock() ) {
			this.loseToSandMotherBadEnd();
		}//Chicks/neuters;
		else {
			this.loseToSandMother();
		}
	};

	//Talk Her Down;
	DungeonSandWitch.prototype.talkDownTheMother = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'Calmly, you approach the Sand Mother\'s throne, saying, "<i>I am no demon, witch.  I am [name], and I am ' );
		if( CoC.getInstance().player.cor < 33 ) {
			EngineCore.outputText( 'a champion' );
		} else if( CoC.getInstance().player.cor < 66 ) {
			EngineCore.outputText( 'beholden to no-one' );
		} else {
			EngineCore.outputText( 'unstoppable' );
		}
		EngineCore.outputText( '.  No demon\'s yoke holds me.</i>"  You grab her by her shoulders with firm but gentle pressure to drill the point home, looking into her sky blue eyes as you make your proclamations of innocence.  The Queen Witch nods dumbly and visibly calms, though she remains shaken from the recent combat.  Hesitantly, she nods at you and smooths her robes, slowly reasserting her dominant, royal persona.' );
		EngineCore.outputText( '\n\n"<i>Very well.  You are either not a demon agent or the most clever spy this side of Marae\'s Lake,</i>" the regal enchantress admits, quietly fixing her hair.  "<i>Either way, it seems I have no choice but to take you at your word until your actions prove otherwise.</i>"  She finishes with her hair and idly folds her hands across her lap, which only serves to strain her silken robe tighter around her double-bust.' );
		EngineCore.outputText( '\n\n"<i>Is there something you would like to discuss, or aid you would request?  It has been a great deal of time since I have had the pleasure of discourse with an outsider.</i>"' );
		CoC.getInstance().player.XP += 200;
		MainView.statsView.showStatUp( 'xp' );
		// xpUp.visible = true;;
		EngineCore.statScreenRefresh();
		//(Set friendly);
		CoC.getInstance().flags[ kFLAGS.SAND_WITCHES_FRIENDLY ] = 1;
		CoC.getInstance().setInCombat( false );
		this.sandWitchMotherFriendlyMenu();
	};
	//*Tentacle Gangbang;
	DungeonSandWitch.prototype.tentacleGangBang = function() {
		EngineCore.clearOutput();
		//>Requires 5+ tentacles.  Every hole is plowed.;
		EngineCore.outputText( 'Grinning, you discard your [armor] with glee, releasing your wriggling bunch of genital appendages to wave in the air, slithering over each other\'s spongy, sweat and pre slicked skin.  They wave in the air menacingly, an orgy of glistening green cocks just waiting to be let loose upon the formidable female flesh before you.  Fearfully, the Sand Mother pushes herself against the wall, stammering, "<i>No... ' );
		if( CoC.getInstance().flags[ kFLAGS.TIMES_TENTACLED_SAND_MOTHER ] === 0 ) {
			EngineCore.outputText( 'it can\'t be like this!  W-we were going to free Mareth!' );
		} else {
			EngineCore.outputText( 'not again!' );
		}
		EngineCore.outputText( '</i>"' );
		if( CoC.getInstance().flags[ kFLAGS.TIMES_TENTACLED_SAND_MOTHER ] === 0 ) {
			EngineCore.outputText( '\n\nThe dumb cunt still thinks you\'re working with the demons!' );
		} else {
			EngineCore.outputText( '\n\nThe dumb cunt still thinks she has a say in this!' );
		}
		EngineCore.outputText( '  Well, no sense in disabusing her of that mistaken notion.  You unleash your array of hungry tentacles, allowing them to stretch out, lengthening beyond their normal, meager sizes to slide under the witch\'s hem.  The silken fabric tickles your fleshy shafts delightfully as they slide up into it, gliding between it and the trembling slut\'s flawless skin.  She tries to shake your questing members, but you twine them around her legs, methodically wiggling them higher.' );
		EngineCore.outputText( '\n\nWhen the first one slides across her upper thighs, you\'re happy to find a complete lack of undergarments.  Your tip touches against a pair of smooth hairless lips and a moment later, a second, identical set.  Slippery moisture lubricates both pairs, and two prominent clitties prod and stab at your shaft as it feels around.  Inspired by this, you set your verdant cock-flora wild, climbing up the enchantress\'s torso and between her four watermelon-sized breasts.  You can see it disappear into the mammary valley through the milk-whetted cloth, utterly devouring your length, at least, until it pops back out the top, pleasantly pulsing.' );
		EngineCore.outputText( '\n\nThe Sand Mother gasps as she\'s firmly wrapped up with dick, subsumed in squirming cocks that rapidly immobilize her arms and legs.  The one between her tits arcs around the side of one, then zips through the tits again, horizontally.  It continues its voyage, squirming and sliding around the quad-breasts until all four are tightly bound in tentacle, massaged by its every motion and squeezed just hard enough to make them squirt and leak their bountiful milk.  The rest of your cock-tentacles aren\'t idle, and at the same time, they encircle her neck and hips, a pair of them poising above the slick openings below.  Tiring of having a sub-par view of the action, you flex one of your members and easily tear the supple fabric, ripping it from the large matron\'s frame.' );
		EngineCore.outputText( '\n\nNow fully exposed, you\'re treated to the magnificent sight of the dark-skinned enchantress all trussed up with green cock.  The swollen, purple heads of your many members leave behind smears of shining pre-cum as they move, turning the queen of the sand witches into little more than a cock-stained slut.  While the view and sensation of her glossy skin combine to make you dizzy, you crave more.  [EachCock] is achingly hard and ready to go, and you desperately need something to sheath them in.  You pause long enough to judge your target\'s readiness.  She\'s gasping, blushing and squirming in your restraints, not in panic but in lust.  Her nipples are hard, milk-squirting bullets.  You flick one to test its firmness and get rewarded with a thick gout of creme.  She\'s ready.' );
		EngineCore.outputText( '\n\nAs one, you take your twin, cunt-hungry tentacle cocks and thrust them forward.  A cacophony of liquid squelches signal your successful penetration, and each cock can feel the other through the narrow divide.  The twin shafts gleefully double-penetrate the witch without even touching her anus... yet.  Even after a foot of cock is inside her, you keep pushing further, pushing past cervixes in order to curl your penises about in the warm, welcoming wombs.  You shudder from feeling the tight cervical ring around yourself and nearly cum, but you hold back, waiting until you can tend to all of your needs.' );
		EngineCore.outputText( '\n\nHigher up, you try to press a tool through the Sand Mother\'s nicely plumped lips, glossing them with your cock-juice.  The puckered gateway remains steadfastly closed to you, blocked by a barrier of gleaming white teeth that no amount of dick pressure will move you.  Growling, you pull back and whip your vine-like dick to and fro, smacking her cheeks punishingly hard.  The impact sends stinging lances of pain through your marvelous member, but you endure it, punishing her until her cheeks are rosy red and slimed.  Once she gasps in pain, you retract and thrust with one sinuous motion, burying nine inches of dick-flesh down her unprotected throat.  Her reaction is a muted gurgle, any words of protest turning into a vibrating staccato of pleasure for your forced blowjob.' );
		EngineCore.outputText( '\n\nNot to be outdone, your fifth cock crawls down the blonde bitch\'s back towards the gentle swell of her posterior where it knows the last unviolated hole remains.  It squishes through the cushiony butt-cheeks and kisses past the puckered asshole.  The witch immediately clenches tight, something you can feel in the dicks already double-stuffing her twats.  Your teasing tendril slowly hotdogs its way through the taut anal valley, allowing those tight muscles to relax.  The tip gently circles her anus at the culmination of each stroke, bumping the clenching hole gently as it encourages it to relax.  That resistant hole puts up a valiant fight, but after a minute or so of being fucked in three holes, the Sand Mother\'s fourth hole begins to relax, first accepting a portion of the tip, then the whole thing with a wet pop.' );
		if( CoC.getInstance().player.tentacleCocks() >= 6 ) {
			EngineCore.outputText( '\n\nYou still have ' );
			if( CoC.getInstance().player.tentacleCocks() >= 7 ) {
				EngineCore.outputText( 'untended serpentine shafts to please' );
			} else {
				EngineCore.outputText( 'an untended serpentine shaft to please' );
			}
			EngineCore.outputText( ', but all the holes are full!  You take the ' );
			if( CoC.getInstance().player.tentacleCocks() === 6 ) {
				EngineCore.outputText( 'leftover one and thread it' );
			} else {
				EngineCore.outputText( 'leftover ones and thread them' );
			}
			EngineCore.outputText( ' through the dick-dominated enchantrix\'s fingers.  By now, her body has completely and utterly betrayed her, and she grabs hold like a cock-hungry slut, immediately stroking up and down, jacking it like a pro.  A muffled sigh of contentment shivers up your throat-fucking cock, alerting you to your depraved foe\'s prick-addled state.  You begin to pump your quartette of buried cocks into their respective holes with renewed vigor.  The titty-fucking vine pistons through its curvy path along with them, sending the witch\'s tits jiggling and squirting wildly.  The only thing' );
			if( CoC.getInstance().player.tentacleCocks() === 6 ) {
				EngineCore.outputText( ' held still is the one getting a hand job, and you only hold it still' );
			} else {
				EngineCore.outputText( 's held still are the two getting hand jobs, and you only hold them still' );
			}
			EngineCore.outputText( ' so that part of you can relax and enjoy your captive Queen\'s enthusiastic wanking.' );
		}
		//(10+);
		if( CoC.getInstance().player.tentacleCocks() >= 10 ) {
			EngineCore.outputText( '\n\nThat accounts for seven of your myriad members, but you are endowed to the extreme.  Three of your dongs have been lurking in the back, hidden behind their more enthusiastic brothers.  Now that she has become a willing participant, supine in a bed of penis, the Cum Witch is assaulted by those same tentacles.  One thrusts down towards the dick-stuffed anal star and jams itself in beside, doubling the dilation and allowing you to experience bliss - twice the anal sex AND frotting, all at the same time.  The other two penises jump into the orgy with a vengeance, snaking into the pair of cunts alongside their buried brethren.' );
		}
		EngineCore.outputText( '\n\nNow fully enveloped, you lean over your happily gurgling prey, admiring her swollen, milk-engorged bust as you take her in every way imaginable.  You wordlessly command your multitude of dongs to fuck faster, then, lean down for a sip of sweet breast milk.  Drinking happily, you allow your body to whip into a sexual frenzy, pumping and pounding, sliding and squeezing, fucking with the relentless power of a champion-turned-tentacle-beast.  Every ounce of exposed skin and every orifice is liberally slicked with your pre-cum, and as your one man orgy winds to a fever pitch, you let the milky tit pop free and bellow out in bliss, cumming hard.' );
		EngineCore.outputText( '\n\nA bevy of bulges work their way up your shafts as you orgasm, dozens of them quickly traveling from base to tip, stretching cunnies and gaping anuses as they go.  When they reach your large, throbbing tips, your cum slits stretch wide and unleash matching waves of white.  Both cunts are creamed from womb to lips.  Your new favorite slut\'s anus is given an alabaster enema.  All four tits get a frothing jizz-bath.' );
		if( CoC.getInstance().player.tentacleCocks() >= 6 ) {
			EngineCore.outputText( '  Bubbling seed soaks her frantically jerking hands.' );
		}
		EngineCore.outputText( '  That was just the first explosions of relief.  You orgasm drags on as you squirt like a firehose, drenching the poor witch with white from head to toe.  Her belly rounds obscenely, stuffed from her throat, ass, and wombs, filled to absolute capacity until all four of the aforementioned holes are squirting torrents of sticky white man-milk into thick puddles.' );
		EngineCore.outputText( '\n\nYou pull out as your pleasure dies down, aiming all ' + Utils.num2Text( CoC.getInstance().player.tentacleCocks() ) + ' of your cum-nozzles above her like an obscene shower, and drench her from head to toe again, a salty white wreck of a cumslut.  With her throat free for the first time in a long time, she swallows and whimpers, "<i>Oooooh... gods.</i>"  The cum-drunk fuck-slut begins to clean herself the only way she can right now - with her mouth.  She\'s so fucked out that she couldn\'t channel her magic if she tried.  You get dressed with a satisfied swagger.' );
		if( CoC.getInstance().flags[ kFLAGS.SAND_WITCHES_COWED ] === 0 ) {
			EngineCore.outputText( '\n\nThe witches are suitably cowed, but you\'ve ruined any chance at a friendly peace with them.' );
			CoC.getInstance().flags[ kFLAGS.SAND_WITCHES_COWED ] = 1;
		} else {
			EngineCore.outputText( '\n\nThey may not think much of you, but turning the Sand Witch Queen into a mewling slut never gets old.' );
		}
		CoC.getInstance().flags[ kFLAGS.TIMES_TENTACLED_SAND_MOTHER ]++;
		CoC.getInstance().player.orgasm();
		EngineCore.dynStats( 'cor', 1 );
		if( !CoC.getInstance().isInCombat() ) {
			EngineCore.doNext( EventParser.playerMenu );
		} else {
			Combat.cleanupAfterCombat();
		}
	};
	//*Fuck Her Cunt;
	//>Sets to resisting with options for repeat rapes.;
	DungeonSandWitch.prototype.fuckTheSandMothersCunt = function() {
		EngineCore.clearOutput();
		if( !CoC.getInstance().isInCombat() ) {
			Combat.startCombat( new SandMother(), true );
			CoC.getInstance().setInCombat( false );
			CoC.getInstance().monster.HP = 0;
		}
		var x = CoC.getInstance().player.cockThatFits( CoC.getInstance().monster.vaginalCapacity() );
		var y = CoC.getInstance().player.cockThatFits2( CoC.getInstance().monster.vaginalCapacity() );
		EngineCore.outputText( 'You admire your prize for a moment, reveling triumphantly in your victory as you hastily disrobe.  The Sand Mother, defeated and weak, declares, "<i>Fine then, do as you will.  You won\'t break me.</i>"  The venom in her voice takes you off-guard - she still thinks you\'re a demonic agent!  You shrug and roll her over, pulling her up onto her hands and knees.  She can think what she wants, but you\'re going to tap her super-curvy body regardless.  You smack the weakened Queen through her sheer robes and admire the ripple that moves from one side of her well-endowed tush to the other.' );
		if( EngineCore.silly() ) {
			EngineCore.outputText( '  Dat booty be poppin\', yo!' );
		}
		EngineCore.outputText( '  Another slap, this time from the other side, sends waves of motion back across, and you cannot help but give the supple cheeks a tight squeeze immediately after.' );
		EngineCore.outputText( '\n\n"<i>Just... just get it over with already!</i>" implores the queen witch, glaring daggers back at you over her shoulder.  Her skin is warm to the touch, even through the fabric of her robe, and a slight blush is visible on her cheeks.  Whatever she says, she must be enjoying this to some degree.  You lift the hem of her robe to expose the reddened derriere, gently caressing it.  Dipping a finger lower, you find her womanly folds and casually test them.  Two pairs of simmering snatches slick your fingers with her copious lady-lube, so thick it feels ready to drip and ooze out in long strings.' );
		EngineCore.outputText( '\n\nYou laugh and ask her why she\'s pretending not to want this - her pussy is wet enough to flood the deserts!  Shamed by your discovery, the Sand Mother casts her eyes down and shudders in shame, her juices beginning to spatter wetly on the floor.  You stand up from underneath her and wipe your fingers off ' );
		if( CoC.getInstance().player.tallness >= 90 ) {
			EngineCore.outputText( 'at the nape of her neck,' );
		} else {
			EngineCore.outputText( 'on her stomach,' );
		}
		EngineCore.outputText( ' then shift position to cup her swollen mammaries.  The super-soft, fluid-filled breasts seem to devour your fingers with their softness, and you begin to roughly grope and knead them, expressing a few drops of milk as you maul her tits.  Her nipples grow hard under your less-than-gentle ministrations, engorging to near double their original size.  You flick one and smile when the huge-breasted Queen of the desert lets out a little moan of a whimper.' );
		EngineCore.outputText( '\n\nYou go back to grabbing her ass with one hand and fondling her pussy with the other until your digits are soaked with the slobbery lady-lube.  Now that she\'s nice and ready, you smear her juices across your ' + Descriptors.cockDescript( x ) + ', mixing it in with your own bubbling pre.  She starts to push back into you, hungry for stimulation now that you\'ve left her womanhood untended.  You smirk and aim your slippery member at one of the approaching holes' );
		if( y >= 0 ) {
			EngineCore.outputText( ', grabbing a second cock as well, intent on penetrating both of her sopping entrances' );
		}
		EngineCore.outputText( '.  The moment her labia caress your ' );
		if( y >= 0 ) {
			EngineCore.outputText( 'cockheads' );
		} else {
			EngineCore.outputText( CoC.getInstance().player.cockHead( x ) );
		}
		EngineCore.outputText( ', she freezes as she realizes what she\'s doing, and she tries to pull away.' );
		EngineCore.outputText( '\n\nIntent on penetration, you grab hold of the witch\'s well-developed hips and drag her weakened body down, smoothly impaling her on your ' );
		if( y >= 0 ) {
			EngineCore.outputText( 'tools' );
		} else {
			EngineCore.outputText( Descriptors.cockDescript( x ) );
		}
		EngineCore.outputText( '.  She moans out loud, throwing her bleached tresses around wildly in pleasure while inch after inch of cock snakes into her passage' );
		if( y >= 0 ) {
			EngineCore.outputText( 's' );
		}
		EngineCore.outputText( '.  Your [hips] clap against her jiggly butt when you bottom out, rocking her whole body forward from the impact and setting all four breasts bouncing and swaying beneath her, painting trails of milk across the floor.  Gradually, you draw back, exposing your sex-slicked length, and thrust back in, leaving no time for her to pull away.  As soon as you hilt yourself to the [sheath], you bounce away, pushing in and out, back and forth, a slow, steady fuck that leaves the Sorceress little time to do anything but roll her hips in your palms and moan like a whore in heat.' );
		EngineCore.outputText( '\n\nThe tall, statue-esque lady is little more than putty in your hands and around your penis' );
		if( y >= 0 ) {
			EngineCore.outputText( 'es' );
		}
		EngineCore.outputText( ', her pulsing, slick oven quivers in anticipation of the next stroke every time you leave her vacant.  You really work her over, spanking her encouragingly whenever you feel she isn\'t into it enough.  She\'s blatantly, unashamedly moaning by this point, and she lowers herself to the floor so she can begin to squeeze her breasts with her hands, squirting out puddles of milk from one pair then the other, bouncing back and forth until the resulting four puddles turn into one small lake.  The Witch\'s twin cunnies are gushing out fem-lube with every motion, and as you feel both of your orgasms approaching, you pull completely out, leaving her achingly empty and gaped.' );
		EngineCore.outputText( '\n\nThe Sand Mother begs, "<i>Put it back in!  Please, fuck me!  I neeeeeed it!</i>"  She tries to crawl back into you, aiming to pin you between the wall and her sizeable ass.  You easily shift to the side and let her smash her butt into the stone, squeezing her plump cheeks obscenely as she moans disconsolately.  When she crawls away, there\'s two cunt-shaped stains on the wall, dripping long rivulets to the ground.  Gods in heaven, she\'s wet!' );
		EngineCore.outputText( '\n\nYou tell her that if she wants to be fucked like a bitch, she needs to beg like a bitch - face down, ass up, and whimpering like the needy slut that she is.  Hope sparks in her eyes, warring with suppressed pride, and she gingerly lowers her face to the ground, not daring to meet your gaze as she lifts her rump high and spreads her legs.  A pitiful whine so quiet that you can barely hear it squeaks from her lips.  Not good enough.  You tell her that you aren\'t convinced.  She doesn\'t sound like a horny bitch just begging to be plugged full of cock.  Again, the witch whines, but this time, it\'s high and keening, a plaintive wail that\'s part moan and part encouragement.  Juices drip freely down her legs as she gives in completely, her knees twitching, her twin pussies opening, blooming like flowers and pulsing with hungry dilations, still slightly gaped from your fuck.' );
		EngineCore.outputText( '\n\nWatching her debase herself like this, [eachCock] grows even harder, oozing and aching to cum.  You congratulate the simpering excuse for a sorceress on her proper mewling by pushing back inside her sweltering snatch' );
		if( y >= 0 ) {
			EngineCore.outputText( 'es' );
		}
		EngineCore.outputText( '.  Fucking her hard and fast, you pay little heed to her pleasure and simply mount her, rutting her roughly.  She doesn\'t even stop her begging either, and every now and then you can actually pick out words like, "<i>Please,</i>" and "<i>Cum.</i>"  You grab a fistful of her hair and pull her head back, commanding her to cum for you, even as you feel your orgasm rising, welling up within you.' );
		EngineCore.outputText( '\n\nThrusting hard enough to clap your loins to her ass audibly, you erupt, spurting wildly into the convulsing, snug love tunnel' );
		if( y >= 0 ) {
			EngineCore.outputText( 's' );
		}
		EngineCore.outputText( '.  Semen floods out of you from the force of your orgasm, creaming the juicy cunt' );
		if( y >= 0 ) {
			EngineCore.outputText( 's' );
		}
		EngineCore.outputText( ' as ' );
		if( y < 0 ) {
			EngineCore.outputText( 'it clamps down' );
		} else {
			EngineCore.outputText( 'they clamp down' );
		}
		EngineCore.outputText( ', squirting femlube and leftover spunk across your [feet].' );
		if( CoC.getInstance().player.cumQ() >= 500 ) {
			EngineCore.outputText( '  Again and again, you flood the poor spellcaster\'s twat' );
			if( y >= 0 ) {
				EngineCore.outputText( 's' );
			}
			EngineCore.outputText( ', shooting so much that it bubbles out in thick globs to fall wetly on the ground.' );
			if( CoC.getInstance().player.cumQ() >= 2000 ) {
				EngineCore.outputText( '  They fall faster and faster as you cum, the witch\'s belly bloating, rounding out to a ridiculous degree.  Her legs are drenched with the leaking spooge.' );
			}
		}
		EngineCore.outputText( '  Once you\'ve pumped every ounce of your virile fluid into the waiting receptacle' );
		if( y >= 0 ) {
			EngineCore.outputText( 's' );
		}
		EngineCore.outputText( ', you pull, admiring the salty, mark you\'ve left on the once proud woman.' );
		EngineCore.outputText( '\n\n"<i>Ahhhh,</i>" she sighs, slumping down into the puddles of sex, "<i>Told... told you... you couldn\'t - mmmm... break me...</i>"' );
		if( CoC.getInstance().flags[ kFLAGS.SAND_WITCHES_COWED ] === 0 ) {
			EngineCore.outputText( '\n\nThe witches are suitably cowed, but you\'ve ruined any chance at a friendly peace with them.' );
			CoC.getInstance().flags[ kFLAGS.SAND_WITCHES_COWED ] = 1;
		} else {
			EngineCore.outputText( '\n\nThey may not think much of you, but turning the Sand Witch Queen into a mewling slut never gets old.' );
		}
		CoC.getInstance().player.orgasm();
		EngineCore.dynStats( 'cor', 1 );
		if( !CoC.getInstance().isInCombat() ) {
			EngineCore.doNext( EventParser.playerMenu );
		} else {
			Combat.cleanupAfterCombat();
		}
	};
	//*ScissorAnDrink;
	DungeonSandWitch.prototype.scissorAndDrink = function() {
		EngineCore.clearOutput();
		//>Sets to resisting with options for repeat rapes.;
		EngineCore.outputText( 'Looking at the Sand Mother, you can\'t help but feel a flutter of heat swim through your nethers, and as you close in, you can feel the moisture gathering on your mons in anticipation.  The ultra-curvy witch\'s teats have turned her robe into a set of four soaked tents, and you can tell from the scent she\'s giving off that she\'s as ready for a little womanly love as you are.  You squeeze one of her breasts until the exceedingly well-endowed woman is moaning, squirting milk through her silken robes to dribble down the curvature of her bust\'s underside.  You collect some on a fingertip before roughly thrusting it into her protesting lips to silence the insipid complaints she\'s started voicing.' );
		EngineCore.outputText( '\n\n"<i>Shut up.  You and your ilk have done nothing but cause me trouble.  The least you can do is cooperate and enjoy it while I get off on you,</i>" you growl, giving her heavy chest a firm squeeze in warning.' );
		EngineCore.outputText( '\n\nThe witch queen pants as you withdraw the finger, "<i>You won\'t break me, demon-slave!  0...But I can\'t fight you any longer.  Just know that you will not break me!</i>"' );
		EngineCore.outputText( '\n\nWhatever.  You grope the top two tits until rivers of milk are running onto her bottommost bosom, the creamy milk sheeting down the thin, fabric covering, turning it semi-transparent and clingy.  The Sand Mother\'s dusky cheeks color slightly as she watches her breast\'s creamy issue spill out in rivers, undoubtedly dripping down the interior of her garments in even greater quantities.  You grab one of her plump nipples and squeeze it from base to tip, spraying a gout of milk into your waiting mouth.  Finally starting to enjoy it, the Sand Mother moans and arches her back, pressing her milk-laden chest into your hand.  You lick the lactose-bearing juice from your lips.  She tastes great!' );
		EngineCore.outputText( '\n\nYou make derogatory comments on her productivity until the tall woman\'s eyebrows knit together in anger.  She purses her lips to retort, and you swoop in, grabbing her platinum tresses as you smash your mouth against hers, hungrily jamming your tongue into her oral cavity until the anger-stiffened muscles relax into quiet, lusty complacence.  Her eyes drift closed as her tongue hesitantly extends to dance with your own.  In no time, the two of you are swapping spit almost non-stop.   Your hands gleefully caress her sodden, milk-slicked fleshed, peeling away her coverings until you can feel the smooth flesh giving under your probing fingers, her heavy tits compressing and sloshing at your feverish touches.' );
		EngineCore.outputText( '\n\nGuiding one of her hands to your [armor], you pull back long enough to whisper, "<i>Help-</i>"  You muffle yourself by diving back into the kiss with ardent gusto.  Your reluctant lover hesitantly fumbles with your [armor] for a few seconds before you threateningly tweak one of her leaky nipples, causing her to groan.  Her vocalizations are muffled by your own lusty maw, but she gets the idea and begins to peel away your gear with shaking hands, only stopping when your lascivious lip-lock grows overwhelmingly passionate.  It takes another tweak to get her going.  Soon, you\'re naked and cradled against the' );
		if( CoC.getInstance().player.tallness < 85 ) {
			EngineCore.outputText( ' larger' );
		} else if( CoC.getInstance().player.tallness > 105 ) {
			EngineCore.outputText( ' smaller' );
		}
		EngineCore.outputText( ' woman, moist, slick bodies entwined as you both grope and grind.' );
		EngineCore.outputText( '\n\nYou nip at the enchanting blond\'s lower lip just hard enough to make her gasp.  Her eyes show hurt and anger along with an unquenchable, fiery resolve.  That\'s fine.  She can have her resolve so long as she gets you off and lets you get at that milk!  Kissing down her vulnerable neck, you nestle your face square into the middle of her quartet of melon-sized breasts, licking and kissing your way through the quad-cleavage until a fat teat drips against your cheek.  You tilt your face to the side until it\'s sliding across your mouth, trailing milk in its wake, and you gleefully suck it in, smirking around the fat nipple as its owner\'s hands squeeze down on your [butt] uncontrollably.' );
		EngineCore.outputText( '\n\nHer doubled labias have grown so hot that they\'re almost steaming against your [leg].  She keeps shifting to press them against you, leaving hot, slippery, cunt-shaped stamps of clear moisture on your ' + CoC.getInstance().player.skinFurScales() + '.  Groaning with your own unfulfilled needs, you drink a deep draught of delectable milk and bring your own burning-hot furnace of need to bear on your once-foe.  Her creamy thigh feels like heaven against your vulva, and you lewdly grind your [clit] against her supple leg until you can feel her moisture starting to drip into your honeypot.  Your traitorous muscles lurch your sordid snatch straight into the Sand Mother\'s copious, clenching crotch, and both of your minds are buried under the avalanche of raw, sensuous pleasure.' );
		EngineCore.outputText( '\n\nYou drag your slippery vulva across the twin twats, fold slipping over fold and [clit] bumping clit after clit.  This obscene scissoring is an exquisite symphony of sensation that your [vagina] is all to happy to drink down.  Gushes of hot fem-cum froth around each set of clinging lips as they\'re pressed against their opposite pair, setting off fireworks in your brain that make it impossible to do anything but moan and gurgle around the milk-seeping teat in your mouth in between swallows.  Shuddering, the platinum-haired enchantress seems to be trying to hold back from her own orgasm, but your hedonistic, pleasure-seeking loins seem intent on making her pussies melt.' );
		EngineCore.outputText( '\n\nSuddenly, the milk-flow intensifies, the three remaining nipples gushing hot fountains of creamy delight across your nubile form, and waves of sticky girl-goo explode across your [vagina], [hips], and thighs, the hot love-syrup bursting across your nerves in an explosion of heat so warm that it feels like it sets off some kind of aphrodisiac orgasm-bomb in your fluttering canal.  The white-hot explosion causes your muscles to lock and relax in senseless paroxysms of pleasure.  Your slick fem-cum ' );
		if( CoC.getInstance().player.wetness() >= 5 ) {
			EngineCore.outputText( 'explodes out in a cunt-shattering spray' );
		} else if( CoC.getInstance().player.wetness() >= 4 ) {
			EngineCore.outputText( 'gushes out in a heavy spray' );
		} else if( CoC.getInstance().player.wetness() >= 3 ) {
			EngineCore.outputText( 'pours out in a thick, wet river' );
		} else if( CoC.getInstance().player.wetness() >= 2 ) {
			EngineCore.outputText( 'drools out in a steady trickles' );
		} else {
			EngineCore.outputText( 'drips out during the cunt-shattering convulsions' );
		}
		EngineCore.outputText( '.  Bulging obscenely, your cheeks barely contain the flood of milk, and you swallow it without thinking, acting entirely on instinct.' );
		EngineCore.outputText( '\n\nTwo strong arms encircle the back of your head and press your ' + CoC.getInstance().player.face() + ' deeper into the gushing chest-flesh until you\'re left but no choice but to suckle and swallow while the fluttering cooches finish bathing each other in liquified orgasm.  You hum in super-sensitive bliss - well fed and sated, trembling every few seconds whenever your [clit] catches on a fold or the other two rigid buttons.  The Sand Mother\'s sculpted body slowly goes limper and limper under your attentions until she\'s on her back and your grinding draws a few, last trembling sparks of pleasure from her body.' );
		EngineCore.outputText( '\n\nA few minutes later, you separate from her drained teat and wipe the white from your chin.  That hit the spot.' );
		EngineCore.outputText( '\n\n"<i>Ahhhh,</i>" the Cum Witch sighs, slumping down into the puddles of sex, "<i>Told... told you... you couldn\'t - mmmm... break me...</i>"' );
		if( CoC.getInstance().flags[ kFLAGS.SAND_WITCHES_COWED ] === 0 ) {
			EngineCore.outputText( '\n\nThe witches are suitably cowed, but you\'ve ruined any chance at a friendly peace with them.' );
			CoC.getInstance().flags[ kFLAGS.SAND_WITCHES_COWED ] = 1;
		} else {
			EngineCore.outputText( '\n\nThey may not think much of you, but turning the Sand Witch Queen into a mewling slut never gets old.' );
		}
		CoC.getInstance().player.orgasm();
		EngineCore.dynStats( 'cor', 1 );
		if( !CoC.getInstance().isInCombat() ) {
			EngineCore.doNext( EventParser.playerMenu );
		} else {
			Combat.cleanupAfterCombat();
		}
	};
	//*Lose Male Loss;
	//>Get turned into breeder or sumthin.;
	DungeonSandWitch.prototype.loseToSandMotherBadEnd = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'Stumbling back into a wall, you try to hold your ' );
		if( CoC.getInstance().player.HP < 1 ) {
			EngineCore.outputText( 'battered body aloft, but your wounds are too great, robbing you of strength.' );
		} else {
			EngineCore.outputText( 'rebellious body aloft, but your lust is too great, turning your body into a quivering wreck.' );
		}
		EngineCore.outputText( '  You ' );
		if( CoC.getInstance().player.HP < 1 ) {
			EngineCore.outputText( 'spitefully watch the Sand Mother approach, only able to admire her sculpted form as she towers over your prone form.' );
		} else {
			EngineCore.outputText( 'hungrily watch the Sand Mother approach, only able to touch yourself as you gaze up at her sculpted form' );
		}
		EngineCore.outputText( '.  She sniffs in disdain as she looks down at you.  "<i>Disappointing.  Lethice sends a weakling like you after us, and the sisters do not even slow you.  Their atonement shall be severe.</i>"  Her eyes, blue as the desert sky, consider you again, and she mutters, "<i>First, there is the matter of you, isn\'t there?</i>"' );
		EngineCore.outputText( '\n\nA manicured, shoeless foot peeks from beneath the swishing silken robes to prod your [armor], deftly peeling open the crotch to expose your ' );
		if( CoC.getInstance().player.HP < 1 ) {
			EngineCore.outputText( 'rapidly-swelling erection' );
		} else {
			EngineCore.outputText( 'turgid, pre-cum slathered boner' );
		}
		if( CoC.getInstance().player.cockTotal() > 1 ) {
			EngineCore.outputText( 's' );
		}
		EngineCore.outputText( '.  "<i>Oh, what have we here?  Were you thinking impure thoughts, my little demon agent?</i>" the towering sorceress asks.  You protest, decrying your innocence, even though your throbbing manhood pulses fitfully, bouncing on your belly.  The silk-robed queen snorts and gently plants her foot atop you, dragging her soft sole along your sensitive urethral bulge, her toes curling down to either side of it.  "<i>Oh, there\'s no need to keep up the pretense of innocence now, though I must admit, it is amusing to watch you cry out so,</i>" she says with a smile.  "<i>Whatever you were, that is at an end.  You will serve the sands and revere me as your Queen, just like the sisters.</i>"' );
		EngineCore.outputText( '\n\nNo!  You try to squirm out from under her, but with her deft caresses and your recent combat, your muscles are as weak as a babe\'s.  You can\'t even roll over to make a crawl for it.  The best you manage is a weak rocking from side to side and pushing yourself an inch or two towards the exit, which seems further away than ever.  Your [hips], reacting to a particularly skillful squeeze, lurch upward, and a weak whimper escapes your mouth.  A dollop of clear pre oozes out of your tip onto the Sand Mother\'s soft arch, acting as lubricant for the gentle, forced footjob.  Gasping in between guttural whimpers, you slump down and submit to the insistent caresses of her toes.' );
		EngineCore.outputText( '\n\nWhile you may have given in bodily to the pleasure, some part of your mind is still resisting.  You\'re being treated like a demonic agent, when all you had wanted to do was save your village.  It\'s not right!  Blushing from the inexplicably enjoyable cock-rub, you manage to stop moaning long enough to utter a weak protest.  You tell her that you ' );
		if( CoC.getInstance().player.cor < 66 ) {
			EngineCore.outputText( 'aren\'t corrupt' );
		} else {
			EngineCore.outputText( 'don\'t serve the demons' );
		}
		EngineCore.outputText( ', looking up at her pleadingly ' );
		if( CoC.getInstance().player.cockTotal() === 1 ) {
			EngineCore.outputText( 'while she gleefully pumps you, smearing your leaky juices all over your shaft.' );
		} else {
			EngineCore.outputText( 'while she gleefully moves to your second cock, smearing it with your first dick\'s pre-cum, messing your ' + CoC.getInstance().player.multiCockDescriptLight() + ' with each penis\'s leaky drippings.' );
		}

		EngineCore.outputText( '\n\nThose torturous strokes slow, eventually stopping entirely, leaving you achingly hard, tremblingly tumescent and ready to pop, but unable without any stimulation.  The imposing sand witch considers you, adjusting a free-flowing lock of her bleached crown behind her shoulder as she thinks.  At last, she murmurs, "<i>...the ring of truth.</i>"  Hope surges through you, warring with disappointment at the sudden halt of your carnal pleasure.  The Sand Mother lazily slides her big toe across the pre-glazed length of your cock as she proclaims, "<i>It doesn\'t matter.  I cannot let you go with your knowledge and weakness, or you\'ll give us up to the demons.</i>"  Your dream of freedom shatters, while a dark, feral part of you rejoices at the return of the teasing touches.' );
		EngineCore.outputText( '\n\n"<i>SISTERS!  Fetch the Cum Witch!</i>" your captor bellows, never slowing in her dick-focused manipulations.  A chorus of assents echoes back, and the doubly-buxom beauty returns her focus to you, pressing down with her foot, gently dragging your dick through the puddle of pre-cum you\'ve made over your belly-button.  The scent of sex is growing heavier in the air, mostly from your own productions' );
		if( CoC.getInstance().player.hasVagina() ) {
			EngineCore.outputText( ' and ignored womanhood' );
		}
		EngineCore.outputText( ', but there is a hint of foreign female musk that you can detect as well.  Four bullet-like nipples are visible in the Sand Mother\'s thin silk robe, pressing out lewdly and staining it with damp, milky moisture.  The sight sends a pleasant tingle to your overloaded groin, adding to the heavy heat that\'s been building under the practiced fondling.' );
		EngineCore.outputText( '\n\n[EachCock] thickens in anticipation, flexing hard enough to lift clear of your middle.  Internal muscles clench and quiver, pumping slick warmth through your middle, a bubbling load just ready to burst.  Without warning, the enchantress pushes her foot down harder, squeezing [oneCock] back into your pre-puddle.  "<i>Go on, let it out,</i>" she encourages, quickly sliding up and down while keeping up the pleasure.  "<i>I promise, I\'ll make your new life enjoyable.</i>"  The agonizingly intense sensation triggers an gigantic wave of hot bliss inside you, and you arch your back, pinned as you are.  Lewdly pumping your [cock biggest] into the slippery arch, you cum, [eachCock] bouncing and dilating as it fires ribbons of fresh, salty cream across your body.' );
		if( CoC.getInstance().player.cumQ() >= 500 ) {
			EngineCore.outputText( '  Wave after wave of jism washes across you, thoroughly drenching you with your spooge, the alabaster spunk soaking you from crown to waist with sticky slickness.' );
		}
		if( CoC.getInstance().player.cumQ() >= 3000 ) {
			EngineCore.outputText( '  A puddle pools around you, deepening nicely as your boundless virility does its work, inching up your body until you feel as if you\'ll float away in your own pearly jism.' );
		}
		EngineCore.outputText( '\n\nJust as you\'re finishing, dribbling out a few weak spurts of cum, another robed figure enters the chamber.  Despite the penetrating scent of your ropey orgasmic goo filling the room, the smell of jizz intensifies at the new arrival, doubling in magnitude as the robed woman approaches you.  The Sand Mother wipes her foot off on your [leg] and whispers, "<i>Good ' + CoC.getInstance().player.mf( 'boy', 'girl' ) + '.  Now relax, we\'ll make this feel good.</i>"  She turns away from you to greet the ebony sister.  This one isn\'t just dark-skinned or well-tanned... she\'s virtually midnight black.  Worse, her robes are spattered with whitish stains, and a protrusion that would put most men\'s erections to shame tents them with unabashed eagerness.  ' );
		if( CoC.getInstance().flags[ kFLAGS.CUM_WITCH_DEFEATED ] > 0 ) {
			EngineCore.outputText( 'The Cum Witch is here, and she seems to have recovered from her defeat!' );
		} else {
			EngineCore.outputText( 'This must be the Cum Witch!' );
		}

		EngineCore.outputText( '\n\nThe two women exchange a few whispered words, too quiet for you to make out.  From the little bits you do here, it sounds like they\'re almost arguing over something... you.  The Sand Mother frowns and shakes her head, speaking just loud enough for you to hear, "<i>I don\'t think we need it, but you\'re right.  It would be a waste.</i>"  They both nod at that and turn back to your orgasm-wrecked form, admiring your heaving [chest] and thick coat of glaze.' );
		EngineCore.outputText( '\n\nThe chocolate woman tosses her robe away with a flourish, revealing a surprisingly normal form (aside from her rather gifted maleness) with only two breasts.  "<i>This won\'t do,</i>" she tuts, poking and prodding your body with her foot, "<i>But the body can wait.  We need to fix you up here.</i>"  The Cum Witch pokes a finger to your forehead for emphasis as she mounts you, mashing her drooling ebon cock over your half-hard, cum-coated maleness.  Still over-sensitive from your ' );
		if( CoC.getInstance().player.balls > 0 ) {
			EngineCore.outputText( 'testes' );
		} else {
			EngineCore.outputText( 'prostate' );
		}
		EngineCore.outputText( ' emptying orgasm, you shudder and try to pull away, but there\'s nowhere to go.  Gentle hands place themselves to either side of your head, immobilizing you, and the lusty hermaphrodite begins to chant, punctuating her arcane words with slow pumps of her body across your cum-slicked middle' );
		if( CoC.getInstance().player.balls > 0 ) {
			EngineCore.outputText( ', two sets of slippery balls bouncing and sliding across each other' );
			if( EngineCore.silly() ) {
				EngineCore.outputText( '.  Great, now it\'s gay' );
			}
		}
		EngineCore.outputText( '.' );
		EngineCore.outputText( '\n\nA quiet hum buzzes in your ears along with a gradual, growing tingle in your temples.  A pinkish glow can be seen from the edges of your vision as the chant finishes, and the droning intensifies, thrumming through your head powerfully.  Between the sensations from your loins and the potent magics seeping into your mind, your thoughts are scattered, shattering apart even as you try to scrape the pieces together into meaningful consciousness.  You aren\'t accustomed to anything like this, and you keep trying to think, to react, to do anything, but every single time, the half-born cogitation vibrates apart, melting away into a syrupy soup of nothingness.  After a while, you just give up.  Feeling... experiencing the here and now... that becomes your whole world.' );
		EngineCore.outputText( '\n\nYou don\'t react when your memories begin to fragment, vibrating apart into little pieces.  They slip into the pink morass in the bottom of your skull, dissolving into the pink sea of pleasure one by one.  That time you got caught stealing fades, along with a year or two of your childhood, replaced by a rising tide of sensational, unthinking bliss.  [EachCock] erupts again, spurting fitfully at the Cum Witch\'s command, each jet timed perfectly to the tempo of her dark, pistoning member.  With every spurt, more memories and knowledge melt away into sludge.  Soon, even your purpose is gone.  Your eyes roll back as you continue to cum unceasingly, an empty vessel of nothing but orgasmic pleasure.' );
		EngineCore.outputText( '\n\nThe midnight-hued magician abruptly pulls away, the pink light fading from your vision.  She\'s fully erect, her glans huge and engorged, shuddering with every beat of her heart as she struggles not to cum.  Even without her touches, you continue to orgasm, subsumed in bliss that doesn\'t end, not even when your [balls] ' );
		if( CoC.getInstance().player.balls > 0 ) {
			EngineCore.outputText( 'empty' );
		} else {
			EngineCore.outputText( 'empties' );
		}
		EngineCore.outputText( ' and the pearly flow fails.  The Sand Mother, who has watched this whole time, has a hand up her robes, meticulously probing her crotch.  You can easily make out her masturbation through the utterly soaked, silken robes, which only grow wetter thanks to her other hand\'s squeezing, milking white flows out of each of her four tits, one after another.' );
		EngineCore.outputText( '\n\n"<i>Now that you are empty, it is time to fill you,</i>" a silky voice solemnly proclaims.  You feel a pressure at your [vagOrAss], smoothly sliding into you without warning or resistance.  The sheer amount of cum covering the cock makes its passage easy, and the entire length quickly slips into you with only the sloppy squish of wet balls on your [butt] to announce the full penetration.  Moaning, the dark chocolate spellcaster chants, her words tinged with pleasure and gleeful, inarticulate exhalations.  Her thick length, immobile inside your tightly-clenching ' );
		if( !CoC.getInstance().player.hasVagina() ) {
			EngineCore.outputText( 'innards' );
		} else {
			EngineCore.outputText( 'folds' );
		}
		EngineCore.outputText( ' thickens slightly, and the heaving balls below jiggle with liquid weight, swelling larger against you.  They grow heavier and heavier, until they slosh with audible, barely contained need, each as large as one of your butt-cheeks and three times as soft.' );
		EngineCore.outputText( '\n\nThe swollen cockhead inside you widens, forming a perfect, penetrative seal inside you.  Then, the thick shaft belches out its hot load, forcefully injecting warmth into your very core.  A second pair of hands grace your temples, and a familiar but unremembered voice takes up the chant.  The buzzing returns, and information begins to enter your mind to the tempo of the free-flowing semen.  You gurgle out a happy noise, your tongue lamely hanging from the corner of your mouth as you cum again to the unnatural fullness.  Jism floods your ' );
		if( !CoC.getInstance().player.hasVagina() ) {
			EngineCore.outputText( 'bowels' );
		} else {
			EngineCore.outputText( 'womb' );
		}
		EngineCore.outputText( ', pumping into you with enough force to audible splash and churn about, gently thickening your middle.  A crystalline lattice-work erects from the mental syrup, climbing higher into a brand new frame of reference, filled with the thoughts and experiences of others - no, of your past.  New memories fill in the gaps while your gut rises, forming a small bump that would be easily mistaken for pregnancy.' );
		EngineCore.outputText( '\n\nDissonant thoughts gradually begin to gather, and you blink through the confusing pink haze as comprehension reasserts itself.  Your belly-bump jiggles with fluid weight, and your belly button pops out, visible for all to see.  Above you, your best friend, the Cum Witch, is smiling down at you, shuddering as she blasts a last few flows of her seed into your jam-packed ' );
		if( !CoC.getInstance().player.hasVagina() ) {
			EngineCore.outputText( '[butt]' );
		} else {
			EngineCore.outputText( 'uterus' );
		}
		EngineCore.outputText( '.  She gives a contented sigh and slides out, followed by a noisily-spurting torrents of her virile seed.  Gods, even though she fucks you like this all the time, it feels as good as the first time she stuffed you full.  You\'re so lucky she\'s willing to give you so much after sharing with the coven all day!  You cradle your pregnant-feeling middle and giggle out a thank you, slumping back into the puddling spooge.  With heavy eyelids, you bid farewell to wakefulness, slumbering fitfully after your ordeal.' );
		CoC.getInstance().player.orgasm();
		//[Next];
		EngineCore.menu();
		EngineCore.addButton( 0, 'Next', this.menLoseToQueenMotherVolI );
	};
	//Epilogue:;
	DungeonSandWitch.prototype.menLoseToQueenMotherVolI = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'The champion woke to a body changed.  ' + CoC.getInstance().player.mf( 'He', 'She' ) + ' now looked every bit the mirror image of the Cum Witch - a thick, girthy cock, two swollen balls, a pair of pendulous breasts, and skin as dark as the blackest night.  She had become one of them, a futanari witch with an insatiable libido.  As best as she could remember, she had been born a scant ten years earlier, and aged to maturity in five.  She volunteered to be a cum witch when the call went out and beat out over two dozen of her lusty sisters for the vaunted position.  Now, the elder Cum Witch was her best friend, and the two gleefully spent their days dick-deep in double-cunts, knocking up their sisters with reckless abandon.  In their free time, they studied spells and practiced stuffing each other with increasingly large seminal deposits.' );
		EngineCore.outputText( '\n\nTwo years later, at the call of the Great Mother, the sand witches went to war.  ' );
		if( CoC.getInstance().flags[ kFLAGS.HEL_HARPY_QUEEN_DEFEATED ] === 0 ) {
			EngineCore.outputText( 'Their harpy and phoenix allies allowed them to approach Lethice\'s fortress unhindered, and i' );
		} else {
			EngineCore.outputText( 'I' );
		}
		EngineCore.outputText( 'n the bloodiest battle ever to take place on Mareth, the demons were defeated, wiped from the world in a blaze of white fire.  In the years that followed, the covens worked to undo all that had been wronged in the world.  Many demons remained, but their influence was on the wane.  The world moved on, and those that remained wisely hid.' );
		EngineCore.outputText( '\n\nThe sand witches turned the deserts into a jungle paradise, and though they lacked the taint of corruption, they never stopped their policies of aggressively bringing in blood.  Many were brainwashed into service, like the champion, but peace was brought to Mareth.  The unanswered question... is a world ruled by lusty milk witches any better than the corrupt one that preceded it?' );
		EventParser.gameOver();
	};
	//*Lose Female Loss;
	//>Get turned into sand witch.;
	//Additional Sand Witch Entry (BY XODIN);
	DungeonSandWitch.prototype.loseToSandMother = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'The world grows dizzy as your ' );
		if( CoC.getInstance().player.HP < 1 ) {
			EngineCore.outputText( 'heavily punished and aching body is filled with too much agony to continue.' );
		} else {
			EngineCore.outputText( 'hot and aroused body fills with unbearable urges that finally distract you from fighting any further.' );
		}
		EngineCore.outputText( '  Instead, you fall backwards against the wall ' );
		if( CoC.getInstance().player.HP < 1 ) {
			EngineCore.outputText( 'and grit your teeth in anger as the Sand Mother approaches.' );
		} else {
			EngineCore.outputText( 'panting deeply, and your blood races as the Sand Mother approaches.' );
		}
		EngineCore.outputText( '  You can not help but admire her incredible physique as she towers over you, looking down upon your body with disdain in her fierce eyes.  "<i>Lethice should have known better than to send such a pathetic imbecile like you to battle us.  I can hardly believe you managed to get by so many of our sisters.</i>"  She sighs.  "<i>Though I suppose it\'d be a greater waste if we just killed you.</i>"' );
		EngineCore.outputText( '\n\nWith an intricate gesture of her fingers, your [armor] begins stripping away as if undone by invisible hands.  In moments, your flesh is laid bare before her and subject to her judgments.  ' );
		if( !CoC.getInstance().player.hasVagina() ) {
			EngineCore.outputText( 'Remarkably, a divot appears on your groin, slowly dividing into two puffy lips with a moist crease between.  The fresh mons of your new pussy glistens with immediate arousal as the Sand Mother\'s magic molds your flesh with a simple spell.  ' );
			CoC.getInstance().player.createVagina();
			CoC.getInstance().player.clitLength = 0.25;
		}
		EngineCore.outputText( 'Your [vagina] is eyed momentarily as it ' );
		if( CoC.getInstance().player.wetness() <= 2 ) {
			EngineCore.outputText( 'grows moist.' );
		} else if( CoC.getInstance().player.wetness() <= 4 ) {
			EngineCore.outputText( 'drips with arousal.' );
		} else {
			EngineCore.outputText( 'drools obscenely.' );
		}
		EngineCore.outputText( '  "<i>We can certainly improve upon this.</i>"  You attempt to voice opposition but she quickly silences you.  "<i>No! Understand here and now, you live by our mercy.  Your body belongs to the sand.  Your old life is over.  From now on, your failed life will serve a greater purpose.</i>"' );
		EngineCore.outputText( '\n\nYou try to resist but ' );
		if( CoC.getInstance().player.HP < 1 ) {
			EngineCore.outputText( 'the pain of your abused body' );
		} else {
			EngineCore.outputText( 'lustful urges fill your senses and' );
		}
		EngineCore.outputText( ' hinders all of your attempts to fight back.  You try to argue that you aren\'t a servant of the demons, that you were fighting against them for your own people just as she is, but every time you open your mouth she forces it closed again with her magic.  "<i>I am not interested in the lies of a demonic servant.  It is time we dealt with you once and for all.</i>"' );
		EngineCore.outputText( '\n\nShe kneels and prods your slick pussy with her fingers, forcing sensations that rise up through your body and exit your lips as moans.  "<i>You\'ll need an extra one of these of course.</i>"  The Sand Mother reaches forwards with her free hand to grope your tits.' );
		if( CoC.getInstance().player.bRows() === 1 ) {
			EngineCore.outputText( '  Plus an extra set of these to ensure you produce as much milk as the rest of your soon-to-be sisters.' );
			CoC.getInstance().player.createBreastRow();
		}
		//if player has four breasts;
		else if( CoC.getInstance().player.bRows() === 2 ) {
			EngineCore.outputText( '  Thankfully you\'re already endowed with enough breasts to begin immediate production of milk.' );
		}//if player has six breasts;
		else {
			EngineCore.outputText( '  Hmmm. We\'ve never had a sister blessed with more than four breasts. I wonder if perhaps we can use your unusual anatomy to our advantage.' );
		}
		EngineCore.outputText( '  She squeezes a [nipple] and a yelp of pleasure escapes you.  "<i>I see you like that idea. Excellent.</i>"' );
		//if breasts are smaller than a normal sand witch's;
		if( CoC.getInstance().player.biggestTitSize() < 3 ) {
			EngineCore.outputText( '  "<i>Of course we\'ll have to grow them a bit to suit our needs.</i>"' );
		}//if breasts are larger than a normal sand witch's;
		else if( CoC.getInstance().player.biggestTitSize() >= 14 ) {
			EngineCore.outputText( '  "<i>Mmmm, and with such massive ones I\'m sure we can expect you to produce more than most of our sisters could.</i>"' );
		}
		EngineCore.outputText( '\n\nThe Sand Mother\'s fingers slide around your labia, teasing them, occasionally fingering your entrance and thumbing your clit.  A light sweat breaks out all over your ' + CoC.getInstance().player.skinFurScales() + '.  "<i>Yes, you\'re really starting to enjoy that idea, aren\'t you?</i>"  You start to nod before regaining your senses. "<i>I see.  You still need persuasion.</i>"  She pinches your clit and an orgasm starts shivering inside your [hips].  "<i>Of course that was never in doubt.  I could never completely trust you, even if I could bring you around to our way of thinking.</i>"' );
		EngineCore.outputText( '\n\n"<i>SISTERS! Fetch the Cum Witch!</i>"  The Sand Mother smiles as she gives the command.  She watches your body flinch and your breasts ' );
		if( CoC.getInstance().player.biggestTitSize() < 5 ) {
			EngineCore.outputText( 'jiggle' );
		} else if( CoC.getInstance().player.biggestTitSize() < 10 ) {
			EngineCore.outputText( 'bounce' );
		} else {
			EngineCore.outputText( 'quake' );
		}
		EngineCore.outputText( ' with every twitch of her fingers inside you.' );
		if( CoC.getInstance().player.lactationQ() >= 50 ) {
			EngineCore.outputText( '  Streams of milk are already starting to pour down the swells of your tits.' );
		}
		EngineCore.outputText( '  Her fingers start pressing deeper, playing upon your erogenous zones like an instrument, strumming your body\'s sense of pleasure to new heights.  She plays your cunt until you cum again and again around palm and gush your juice down her arm.  Everything below your waist abandons your control and submits itself to her administrations.  You cum and all you can do is grope your own tits as you ride the waves of pleasure that saturate your flesh.' );
		EngineCore.outputText( '\n\nBy the time the Sand Mother has finished reducing the pleasure centers of your brain to mush, a robed figure has entered the room.  Through an erotic haze, you squint and make out the features of an ebony-skinned woman clad in a robe covered in fresh white stains. It fails to hide the sizable erection that she bears; one large enough to shame most normal men.' );
		if( CoC.getInstance().flags[ kFLAGS.CUM_WITCH_DEFEATED ] === 1 ) {
			EngineCore.outputText( '  It is obviously the Cum Witch you encountered, and she has clearly regained her strength!' );
		} else {
			EngineCore.outputText( 'This must be the Cum Witch the Sand Mother sent for!' );
		}

		EngineCore.outputText( '\n\nShe and the Sand Mother whisper back and forth, and they seem to disagree about something.  From the stares the Cum Witch gives you, you infer that their discussion concerns you.  Finally, the Cum Witch frowns and speaks loud enough to be heard, "<i>I don\'t think we need it, but you\'re right.  It would be a waste.</i>"  She bows to the Sand Mother and then approaches you' );
		if( CoC.getInstance().player.bRows() <= 2 ) {
			EngineCore.outputText( ', admiring the extra set of breasts you already possess' );
		} else {
			EngineCore.outputText( ', admiring how you\'ve managed to grow ' + Utils.num2Text( CoC.getInstance().player.bRows() ) + ' rows of breasts instead of just two on your panting torso' );
		}
		EngineCore.outputText( '.' );
		EngineCore.outputText( '\n\nThe chocolate skinned woman tosses aside her robe dramatically and lowers her incredibly toned body between your thighs.  Despite the presence of an overly endowed human cock that\'s already rising beyond your expectations, her overall figure is quite feminine and normal - just one pair of breasts.  She pokes your thoroughly soaked vagina and says, "<i>This\'ll have to change.  Just one simply won\'t do, but right now, the body is the lesser priority.</i>"  She angles her cock between the folds of your pussy and immediately spears your, shoving her length inside you as if testing your depths.  Once comfortable she raises her hands to either side of your head while her cock thrusts with a steady rhythm into your cunt.  "<i>Up here...</i>"  She taps your head with her fingers while she angles your face to stare her in the eyes, "<i>...is what we have to fix first.</i>"' );
		EngineCore.outputText( '\n\nThe dark hermaphrodite begins chanting in time with her steady thrusts.  You try to struggle but it\'s useless in your weakened and aroused state.  All you can do is look into her eyes and listen to her, the words filling your head.  The incantations force themselves into your mind, just as her engorged manhood is forcing itself into your body.  Your brain seems to hum as it fills up with her words, and your pussy quivers while it fills up with her cock.  So much filling, but not enough space.' );
		EngineCore.outputText( '\n\nYou feel crowded within your own skin.  The sensation of being stuffed to the point of bursting fills you.  There\'s not enough room for both of you inside this body.  "<i>Feeling full?</i>" she coyly asks.  "<i>No more room left?</i>"  You can\'t help but to nod.  "<i>Not enough room for both of us is there?  But what\'s going to happen when I cum?</i>"  The thought sends shivers down your spine.  You feel uncomfortably full, and the notion of being filled even a little bit more makes your belly ache with the thought of bursting.' );
		EngineCore.outputText( '\n\n"<i>I\'m, ung... going to cum soon little one.  You\'d better make room for it.</i>"  Panic starts to creep through your foggy mind.  You\'re going to burst if you don\'t make space, but how?  "<i>Let go, little one.  It\'s so crowded inside you, and you want my cum, right?</i>"  That did sound like it made sense.  If the Cum Witch is inside you, and you\'re inside you, then one of you has to leave, and since you loved having cum inside you, it makes sense that you should be the one to leave... right?' );
		EngineCore.outputText( '\n\nThe ebony shaft of the Cum Witch throbs thicker as gooey gobs of her seed fill it up.  With the first hot spurts of jism inside your cunt, you feel your mind slipping away.  Thoughts fall apart to make way for the cum.  Memories are tossed aside to make way for the precious spunk the Cum Witch has to give you.  Dreams, hopes, ambitions, all break down, discarded to make more room for her.  "<i>Yes, little one.  Just let go.  Let me take you, fill you, have you...</i>"  That sounds sensible.  The Cum Witch already filled you, so just letting her have your body is probably for the best. She\'s the one using it anyways.  All you really wanted to do was fill it with cum anyways, and she can do that for you.  She can do everything for you... you just have to let her... you just have to give in... just give in... give... in...' );
		EngineCore.outputText( '\n\nPale streams of cum pour from your [vagina] as the Cum Witch finishes her orgasm.  Every muscle in your slutty flesh tenses as you climax again and again, each orgasm slowly hollowing out your mind.  A vacant stare overcomes your expression as pleasure becomes the only thing you comprehend.  The only thing you want.  Ever...' );
		EngineCore.outputText( '\n\n"<i>Is it done?</i>" The Sand Mother asks with a hand between her own thighs, rubbing herself lewdly as she watches the spectacle.' );
		EngineCore.outputText( '\n\nThe chocolate witch stands up with her somewhat-stiff cock hanging between her thighs and dripping the collective juices of your cunt and her cum, "<i>I have filled her with a new purpose.</i>"  She stares down at your sweat-stained body that tingles with the afterglow of sex.  "<i>Now to the matter of her flesh.</i>"' );
		CoC.getInstance().player.orgasm();
		EngineCore.menu();
		EngineCore.addButton( 0, 'Next', this.sandMotherBadEndsLadiesEpilogue );
	};
	//Epilogue:;
	DungeonSandWitch.prototype.sandMotherBadEndsLadiesEpilogue = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'The Champion awoke to a body changed. ' + CoC.getInstance().player.mf( 'His', 'Her' ) + ' body had been transformed in to that of a Sand Witch\'s.' );
		//if player had six breasts;
		if( CoC.getInstance().player.bRows() > 2 ) {
			EngineCore.outputText( '  Although unlike the other Sand Witches, this one sported extra breasts which she used to her utmost advantage.' );
		}
		//if player had gigantic breasts;
		if( CoC.getInstance().player.biggestTitSize() >= 22 ) {
			EngineCore.outputText( '  She was unrivaled in her ability to produce milk thanks to the natural enormity of her breasts that her other sisters couldn\'t come close to.  They were so large that they often impeded her movement, which she admittedly didn\'t mind so much.' );
		}
		EngineCore.outputText( '\n\nAs best as she could remember, her life had begun only a decade ago, aging quickly to become ready for service in her Sand Mother\'s coven at the age of five.  She\'d been eager to give her milk and use her two wombs to breed as many new sisters as possible.' );
		//if player had the broodmother perk;
		if( CoC.getInstance().player.findPerk( PerkLib.BroodMother ) >= 0 ) {
			EngineCore.outputText( '  She\'d immediately shown a unique propensity for rapid pregnancies, birthing new sisters at twice the rate of any other Sand Witch.  Her surprisingly fertile wombs helped give an extra edge to the Sand Mother\'s plans.' );
		}
		//if player had broodmother and gigantic breasts;
		if( CoC.getInstance().player.findPerk( PerkLib.BroodMother ) >= 0 && CoC.getInstance().player.biggestTitSize() >= 22 ) {
			EngineCore.outputText( '  As a result, the champion who could no longer remember her true past became little more than a giant pregnant belly surrounded by ' + Utils.num2Text( CoC.getInstance().player.bRows() ) + ' breasts so massive that the other sand witches often used her tits as comfortable cushions to sit upon, their thighs tightly gripping each giant nipple against their aching cunts for pleasure.' );
		}
		EngineCore.outputText( '\n\nTwo years later, at the call of the Great Mother, the sand witches went to war.  ' );
		if( CoC.getInstance().flags[ kFLAGS.HEL_HARPY_QUEEN_DEFEATED ] === 0 ) {
			EngineCore.outputText( 'Their harpy and phoenix allies allowed them to approach Lethice\'s fortress unhindered, and i' );
		} else {
			EngineCore.outputText( 'I' );
		}
		EngineCore.outputText( 'n the bloodiest battle ever to take place on Mareth, the demons were defeated, wiped from the world in a blaze of white fire.  In the years that followed, the covens worked to undo all that had been wronged in the world. Many demons remained, but their influence was on the wane.  The world moved on, and those that remained wisely hid.' );
		EngineCore.outputText( '\n\nThe sand witches turned the deserts into a jungle paradise, and though they lacked the taint of corruption, they never stopped their policies of aggressively bringing in new blood.  Many were brainwashed into service, like the champion, but peace was brought to Mareth.  The unanswered question remains: is a world ruled by lusty milk witches any better than the \'corrupt\' one that preceded it?' );
		EventParser.gameOver();
	};

	//Friendly Options;
	//(Alt(More complex options above): The Sand Mother sits atop her throne, smiling benevolently at you as you approach.  It appears you've made an ally.;
	//*Friendly Fuck (Optional?);
	//>Fuck her friendly style.;
	DungeonSandWitch.prototype.friendlySandMotherFuck = function() {
		EngineCore.clearOutput();
		Combat.startCombat( new SandMother(), true );
		CoC.getInstance().setInCombat( false );
		var x = CoC.getInstance().player.cockThatFits( CoC.getInstance().monster.vaginalCapacity() );
		var y = CoC.getInstance().player.cockThatFits2( CoC.getInstance().monster.vaginalCapacity() );
		//First Time:;
		if( CoC.getInstance().flags[ kFLAGS.TIMES_FRIENDLY_FUCKED_SAND_MOTHER ] === 0 ) {
			EngineCore.outputText( 'Casting your gaze around to ensure privacy, you lower your brows conspiringly and inquire into the Sand Mother\'s love life.' );
			EngineCore.outputText( '\n\nThe Sand Mother blushes slightly, her hand idly fanning at her reddened cheek before pushing a strand of white-blonde hair out of her face.  She bites her lower lip nervously before admitting, "<i>Not that it is any business of yours, Champion, but no, my duties are quite demanding.  I am much too busy to saddle myself with offspring, and the milkers provide all the... stimulation that I require.</i>"  Her large nipples are slowly stiffening, lifting her silken robes away from her breasts as they erect needily.  You swear you can hear the liquid bounty sloshing around inside her immense orbs as she shifts position, crossing her legs, and then you smell the unmistakable aroma of an aroused woman.' );
			EngineCore.outputText( '\n\nLooking at her stiff, moist teats, you comment that she seems to have been left wanting in more ways than one.  She squirms visibly when she traces your gaze down to her breasts, and she gasps, "<i>Why... I... I don\'t...</i>"  Her glowing eyes flick towards your crotch, taking in the swelling bulge as you approach her throne.  She licks her lips without meaning to and disentangles an idle finger that had been twirling her shimmering hair.' );
			EngineCore.outputText( '\n\nShe sighs and admits, "<i>I do... um... I do have some needs.  Perhaps a coupling would be beneficial after all.</i>"' );
		}
		//Repeat;
		else {
			EngineCore.outputText( 'Casting your gaze around to ensure privacy, you lower your brows conspiringly and you ask if she\'d like you to tend to her baser needs.  The Sand Mother looks at your crotch and licks at her lips, her nipples erecting her robes into stiff little tents.  She twirls a lock of hair around her finger and purrs, "<i>Well, a little copulation to clear my head might be just what I need.</i>"' );
		}
		EngineCore.outputText( '  The dark-skinned sorceress makes an arcane gesture, hand glowing with power, and a glowing blue rune spreads out around her belly-button, the intricate webs of illuminated tracery forming a hexagonal pattern that makes you dizzy just to look at.  "<i>While I am the Sand Mother, I am not ready to be a mother just yet.</i>"  The glow is already fading, vanishing as fast as it appeared.' );
		EngineCore.outputText( '\n\n"<i>Undress,</i>" she tuts, gesturing at your [armor].' );
		EngineCore.outputText( '\n\nYou start to disrobe, watching and waiting for her to get naked as well, but she doesn\'t.  Sure, she\'s shifted position so that she\'s sitting on the edge of her throne, but she hasn\'t even slipped an arm out of the silky, masterfully crafted robe that she wears.  You teasingly ask her if she\'s planning to make you fuck her through her dress.' );
		EngineCore.outputText( '\n\nThe Sand Mother giggles, slowly lifting the hem of her vestments to expose her knees, smooth thighs, and the steamy delta between them.  Her feminine juices are already visible even from this far away, slowly dripping in sinuous streams to puddle beneath her, squishing softly under her bubble bottom when she shifts position under your lusty gaze.  The doubled pussies have four puffy lips peeking out through their vulvas, reddish and inflamed with ardor.  You can\'t quite see her clits, but the slight distortion of her hoods are visible, glistening softly.  You\'re sure a little stimulation would bring the sensitive buzzers out to play.' );
		EngineCore.outputText( '\n\n"<i>Surely you don\'t mind servicing me while I rule from my throne?</i>" the Sand Mother asks, tugging the robe up high enough that it will be out of the way, the fabric bunched up around her hips and behind her.  One hand traces in lazy circles around her puffy, large nipple, and milk answers almost immediately, steadily trickling down her many breasts.  The other three grow moist as they begin to sympathetically lactate, soon turning her top into a wet, warm mess.  Her cheeks are blushing as deeply as a dark-skinned woman\'s can.  Gasping, she pleads, "<i>Come take me, Champion.  I need it.  I need you inside me!</i>"  The last word comes out half as a moan, her fingers pinching down on her nipple hard enough to send a spout of milk in a wet spray in front of her throne.' );
		EngineCore.outputText( '\n\nFeeling more than a little ready yourself, you step up to her, ' );
		if( !CoC.getInstance().player.isTaur() ) {
			EngineCore.outputText( 'holding [oneCock] in ' );
			if( y >= 0 ) {
				EngineCore.outputText( 'one' );
			} else {
				EngineCore.outputText( 'your' );
			}
			EngineCore.outputText( ' hand' );
			if( y >= 0 ) {
				EngineCore.outputText( ' and another in the other' );
			}
			EngineCore.outputText( ', the meaty cock-flesh wobbling, veins pulsing just under the surface as you nose ' );
			if( y < 0 ) {
				EngineCore.outputText( 'it' );
			} else {
				EngineCore.outputText( 'them' );
			}
			EngineCore.outputText( ' up against the twin, wet pussies.' );
		} else {
			EngineCore.outputText( 'dick' );
			if( y >= 0 ) {
				EngineCore.outputText( 's' );
			}
			EngineCore.outputText( ' bobbing under your equine belly, the meaty cock-flesh wobbling with veins pulsing just under the surface as ' );
			if( y < 0 ) {
				EngineCore.outputText( 'it noses' );
			} else {
				EngineCore.outputText( 'they nose' );
			}
			EngineCore.outputText( ' up against the twin, wet pussies.' );
		}
		if( CoC.getInstance().player.tallness >= 90 ) {
			EngineCore.outputText( '  You have to kneel down to make it work, tall as you are.  ' );
		} else if( CoC.getInstance().player.tallness <= 48 ) {
			EngineCore.outputText( '  You can barely reach her cunt standing, short as you are.  ' );
		}
		EngineCore.outputText( 'Her lube-glossed gates spread around your ' + CoC.getInstance().player.cockHead( x ) );
		if( y >= 0 ) {
			EngineCore.outputText( ' and other cock-tip' );
		}
		EngineCore.outputText( ', the hot moisture gobbling up your inches, clinging hot and wet to the oversensitive, pulsating dick' );
		if( y >= 0 ) {
			EngineCore.outputText( 's' );
		}
		EngineCore.outputText( '.  The large woman sighs with relief as you scratch her unspoken, hidden itch.  Your [hips] push forward with such fervor that you doubt you could stop if you wanted, pressing hard on her sensitive, innermost folds with ' );
		if( y >= 0 ) {
			EngineCore.outputText( 'both your cocks' );
		} else {
			EngineCore.outputText( 'your ' + Descriptors.cockDescript( x ) );
		}
		EngineCore.outputText( '.' );
		//HOARSES:;
		if( CoC.getInstance().player.isTaur() ) {
			EngineCore.outputText( '\n\nWhinnying in delight, you rest your forelegs on ' );
			if( CoC.getInstance().player.tallness < 78 ) {
				EngineCore.outputText( 'her shoulders' );
			} else {
				EngineCore.outputText( 'the top of her throne' );
			}
			EngineCore.outputText( ' and thrust, pumping yourself hard into her with animalistic delight.  The Sand Mother shudders beneath your bestial bulk as her hands begin to tug at her nipples through her soaked, not-so-concealing robes.  She whimpers and begins to kiss at your human abdomen, tonguing your belly button as she\'s mounted on your bitch-breaking erection' );
			if( y >= 0 ) {
				EngineCore.outputText( 's' );
			}
			EngineCore.outputText( '.  Grabbing a lock of platinum in your fingers, you keep a firm hold on her while you let your lower half\'s inhuman ardor take control of your body.' );
		}
		//NOTAHOARSE:;
		else {
			EngineCore.outputText( '\n\nGroaning in delight, you rest your hands on her ' );
			if( CoC.getInstance().player.tallness < 60 ) {
				EngineCore.outputText( 'bottom tits' );
			} else if( CoC.getInstance().player.tallness < 84 ) {
				EngineCore.outputText( 'top tits' );
			} else {
				EngineCore.outputText( 'shoulders' );
			}
			EngineCore.outputText( ' and thrust, powerfully pumping your manhood through her lube-gilded channel' );
			if( y >= 0 ) {
				EngineCore.outputText( 's' );
			}
			EngineCore.outputText( '.  The Sand Mother shudders before you, hands tugging her nipples through her soaked, not-so-concealing robes.  She\'s whimpering needily, and ' );
			if( CoC.getInstance().player.tallness < 72 ) {
				EngineCore.outputText( 'you kiss her to silence her, tongue pumping to the same timing that drives your hips.' );
			} else {
				EngineCore.outputText( 'you suckle one of the heavy, milk-laden tits to enhance her pleasure' );
			}
			EngineCore.outputText( '.  Her fingers roam through your ' + Descriptors.hairDescript() + ' as she allows her passion to overwhelm her.  Splattering noisily, her juices are dripping and squirting around your hard-thrusting dong' );
			if( y >= 0 ) {
				EngineCore.outputText( 's' );
			}
			EngineCore.outputText( ', replaced by fresh secretions as fast as you squeeze them out of her.' );
		}
		//Both;
		EngineCore.outputText( '\n\nYou groan as the suckling heat around your rod' );
		if( y >= 0 ) {
			EngineCore.outputText( 's' );
		}
		EngineCore.outputText( ' lurches into convulsions, too hot, tight, and sensuous for you to endure.  For a moment, you try your damnedest to hold out, to ride the wave of pleasure for another few minutes before you release into the agonizingly sweet puss' );
		if( y < 0 ) {
			EngineCore.outputText( 'y' );
		} else {
			EngineCore.outputText( 'ies' );
		}
		EngineCore.outputText( '.' );
		if( CoC.getInstance().player.hasVagina() ) {
			EngineCore.outputText( '  Your own [vagina] quivers weakly, insides grinding against insides, squeezing every drop of juice from your ' );
			if( CoC.getInstance().player.wetness() >= 4 ) {
				EngineCore.outputText( 'squirting ' );
			}
			EngineCore.outputText( 'passage.' );
		}
		if( CoC.getInstance().player.lactationQ() >= 200 ) {
			EngineCore.outputText( '  Escaping from your [nipples], milk ' );
			if( CoC.getInstance().player.lactationQ() < 200 ) {
				EngineCore.outputText( 'leaks' );
			} else if( CoC.getInstance().player.lactationQ() < 1000 ) {
				EngineCore.outputText( 'drips' );
			} else {
				EngineCore.outputText( 'erupts' );
			}
			EngineCore.outputText( ', splattering the throne with a fresh, lactic offering.  If you weren\'t mindlessly jamming yourself into her cunt, you\'d wonder if she approves of your offering, but every neuron is busy sending your body to a mind-blowing climax.' );
		}
		EngineCore.outputText( '  You grunt as the heat inside your clenching [balls] radiates through your groin and towards [eachCock].' );
		//Newline;
		EngineCore.outputText( '\n\n' );
		//More than 2 dongs or one doesn't fit;
		if( CoC.getInstance().player.cockTotal() > 2 || (CoC.getInstance().player.cockTotal() === 2 && y < 0) ) {
			EngineCore.outputText( 'White love-batter fires in thick ropes onto her robes from your unbound penis' );
			if( CoC.getInstance().player.cockTotal() > 3 || (CoC.getInstance().player.cockTotal() === 3 && y < 0) ) {
				EngineCore.outputText( 'es' );
			}
			EngineCore.outputText( '.  One after another, the syrupy strands mix in with the dripping milk to make an alabaster drapery of sex-juice.  ' );
		}
		//light ejaculate;
		if( CoC.getInstance().player.cumQ() < 250 ) {
			EngineCore.outputText( 'You spend your passion in numerous spurts, firing straight into the deepest depths of the Sand Mother\'s pussy.  Her slick walls squeeze you repeatedly, pulling you further inside, caressing you to encourage your orgasm to gift her with greater quantities of jism. As you continue to spurt, you realize that her hungry cunt' );
			if( y >= 0 ) {
				EngineCore.outputText( 's are' );
			} else {
				EngineCore.outputText( ' is' );
			}
			EngineCore.outputText( ' successful in some capacity, because you squirt until it\'s almost painful, finishing with ' );
			if( y < 0 ) {
				EngineCore.outputText( 'a fat white drop that\'s squeezed from your tip' );
			} else {
				EngineCore.outputText( 'fat white drops that are squeezed from your tips' );
			}
			EngineCore.outputText( '.' );
		}
		//medium ejaculate;
		else if( CoC.getInstance().player.cumQ() < 1000 ) {
			EngineCore.outputText( 'You spend your passion in heavy flows of fuck-batter.  Each lance of semen slides into the deepest depths of the Sand Mother\'s pussy where it can baste her sensitive tunnel and yielding cervix with thick jism.  Her sperm-gilded walls continue to squeeze you, encouraging you to give her even greater levels of virile juices, and you have no problem meeting that demand.  Your eyes roll partway back as your body rides out the unnaturally-long orgasm, unwilling to stop cumming until you feel drained and dry.  Goop is leaking out from her oozing, well-fucked lips in fat blobs.' );
		}
		//high ejaculate;
		else {
			EngineCore.outputText( 'You spend your passion in fountaining eruptions of jizz, the first one more than big enough to glaze the deepest depths of the Sand Mother\'s pussy.  The pressure from the second cumsplosion is enough to send your fuck-batter through her cervix, deep into her womb, and back out through her quivering cunt-lips in a drippy spunk-leak.  Her nethers squeeze emphatically around you in a way that encourages you to fill her fuller, the squeezing walls pulling you so deeply inside her that your next squirt' );
			if( y >= 0 ) {
				EngineCore.outputText( 's go' );
			} else {
				EngineCore.outputText( ' goes' );
			}
			EngineCore.outputText( ' straight into her womb' );
			if( y >= 0 ) {
				EngineCore.outputText( 's' );
			}
			EngineCore.outputText( ', rounding her belly to pregnant proportions.  She moans as she\'s filled beyond capacity with cum, only getting relief when the pressure in her packed womb' );
			if( y >= 0 ) {
				EngineCore.outputText( 's grow' );
			} else {
				EngineCore.outputText( ' grows' );
			}
			EngineCore.outputText( ' so high that jets of spooge spray out around you.  That doesn\'t stop you - you keep forcing more thick ejaculate into her until she\'s a nonsensical, babbling mess and you\'re totally spent.' );
		}
		//END;
		EngineCore.outputText( '\n\nSeparating from her produces sensations so strong that your [legs] nearly fold underneath you, peaking along with a wet \'schluuuuck\'.  You stagger back, panting for breath as you admire the creampied prize ahead.  The Sand Mother is a panting, milky mess that\'s wallowing in a puddle of her own cum.  After a few moments, she stops fondling herself and moaning, gradually lowering the hem of her stained robe as a content, blissful expression settles on her face.' );
		EngineCore.outputText( '\n\n"<i>Thank you, Champion.  Perhaps you wouldn\'t mind helping me again with this some time in the future...</i>"' );
		CoC.getInstance().flags[ kFLAGS.TIMES_FRIENDLY_FUCKED_SAND_MOTHER ]++;
		CoC.getInstance().player.orgasm();
		EngineCore.doNext( EventParser.playerMenu );
	};
	//*Friendly Milk-Ride (Optional?);
	//>Lesbo milk-filling;
	DungeonSandWitch.prototype.lesboMilkFilling = function() {
		EngineCore.clearOutput();
		CoC.getInstance().flags[ kFLAGS.TIMES_FRIENDLY_FUCKED_SAND_MOTHER ]++;
		//First Time:;
		if( CoC.getInstance().flags[ kFLAGS.TIMES_FRIENDLY_FUCKED_SAND_MOTHER ] === 1 ) {
			EngineCore.outputText( 'Casting your gaze around to ensure privacy, you lower your brows conspiringly and inquire into the Sand Mother\'s love life.' );
			EngineCore.outputText( '\n\nThe Sand Mother blushes slightly, her hand idly fanning at her reddened cheek before pushing a strand of white-blonde hair out of her face.  She bites her lower lip nervously before admitting, "<i>Not that it is any business of yours, Champion, but no, my duties are quite demanding.  I am much too busy to saddle myself with offspring, and the milkers provide all the... stimulation that I require.</i>"  Her large nipples are slowly stiffening, lifting her silken robes away from her breasts as they erect needily.  You swear you can hear the liquid bounty sloshing around inside her immense orbs as she shifts position, crossing her legs, and then you smell the unmistakable aroma of an aroused woman.' );
			EngineCore.outputText( '\n\nLooking at her stiff, moist teats, you comment that she seems to have been left wanting in more ways than one.  She squirms visibly when she traces your gaze down to her breasts and she gasps, "<i>Why... I... I don\'t...</i>"  Her glowing eyes flick towards your [chest], eying your supple form as you approach her throne.  She licks her lips without meaning to and disentangles an idle finger that had been twirling her shimmering hair.' );
			EngineCore.outputText( '\n\nShe sighs and admits, "<i>I do... um... I do have some needs.  Perhaps a coupling would be beneficial after all.</i>"' );
		}
		//Repeat:;
		else {
			EngineCore.outputText( 'Casting your gaze around to ensure privacy, you lower your brows conspiringly and you ask if she\'d like you to tend to her baser needs.  The Sand Mother looks at your crotch and licks at her lips, her nipples erecting her robes into stiff little tents.  She twirls a lock of hair around her finger and purrs, "<i>Well, a little copulation to clear my head might be just what I need.</i>"' );
		}
		//BOTH;
		EngineCore.outputText( '\n\nAllowing an eager, pleased expression to occupy your ' + CoC.getInstance().player.face() + ', you peel the top of your armor down to expose your [chest] and [nipples], heaving with your excited, eager inhalations.  The Sand Mother watches you with a lecherous expression as she opens the top half of her robe.  Her four areolae are huge and moist with her creamy drippings, the pebbly texture shining dully in the unnatural light as fresh liquid beads on her enormous, lust-tightened nipples.  Shimmying out of your bottoms, you stretch your hands up high over your head and arch your back' );
		if( CoC.getInstance().player.biggestTitSize() >= 10 ) {
			EngineCore.outputText( ', [fullChest] swaying enticingly as you strike your seductive pose' );
		}
		EngineCore.outputText( '.   Freeing your body from its bindings is almost as exciting as seducing the queen of the lactic sorceresses, and you ' );
		if( CoC.getInstance().player.biggestTitSize() >= 2 ) {
			EngineCore.outputText( 'cup your mammaries' );
		} else {
			EngineCore.outputText( 'run your hands down your chest' );
		}
		EngineCore.outputText( ' as you stride closer.' );
		EngineCore.outputText( '\n\n"<i>Oh by the Great Mother,</i>" the tanned spellcaster coos, "<i>Come here...  I have all this milk pent up and a good idea where I can put it.</i>"  She winks and grabs one of her teats around the base, expressing a thin stream of milk as she forces more into her bulging, three-inch long nipples.  Crooking a finger in your direction, she lifts the bottom of her robe and allows her free fingers to casually stroke across her swollen, sticky mons.  The Sand Mother whimpers softly as she begins to pleasure herself, but her eyes remain fixed on you, promising seductive pleasure and a thorough milk-filling.' );
		//HOARSE;
		if( CoC.getInstance().player.isTaur() ) {
			EngineCore.outputText( '\n\nPrancing up to her, you make to take a drink of her nipple, but she diverts the dribbling spout aside at the last moment.  "<i>Tut tut, naughty horsie.  I didn\'t mean for you to drink it,</i>" she says with a smile.  Her hand affectionately strokes your cheek, imploring you to turn, and you do, sudden realization hitting you - she\'s going to put her nipple in your [vagina]!  Backing up, you push your equine hindquarters as close as you can.  Your hind legs bump into her knees and her throne, arresting your movement, but that\'s more than close enough to feel the heat of her pebbly, soaked skin pressing against your labia and even your [clit].' );
		}
		//NOT A HORSE;
		else {
			EngineCore.outputText( '\n\nClosing in on her, you make to take a drink of her nipple, but she diverts it away at the last moment.  "<i>Tut tut, naughty ' + CoC.getInstance().player.mf( 'boy', 'girl' ) + '.  I didn\'t mean for you to drink my milk,</i>" she says with a smile.  Her hand affectionately strokes your hip, leaving you to mull on that until she pries her lusty digits from her sticky box, diverting them to your own [vagina].  She spreads your labia apart to reveal the glistening, inner slit, thumbing across your [clit] as she lets the implication set in - she wants to fuck you with her nipple!  Releasing your achingly sensitive folds, she grabs hold of you by the [hips] and lifts, smearing the mixed love-juice across your right side as she does.  She\'s amazingly strong, even for an eight-foot tall woman' );
			if( CoC.getInstance().player.tallness > 72 || CoC.getInstance().player.isTaur() ) {
				EngineCore.outputText( ', though judging by the glow around her hands, she used some magic to help' );
			}
			EngineCore.outputText( '.  Sliding enticingly across your nethers, her pebbly, soaked tip drags perfectly up against your [clit], just waiting to be jammed home and begin inseminating you with milk.' );
		}
		//Both;
		EngineCore.outputText( '\n\nYou bite your own lip, trying to stifle a moan of delight when she presses herself harder against you, that remarkably firm nipple sliding inside you with only the slightest token of resistance.  It\'s so slippery with dribbling milk and your hot secretions that you almost wonder if she could press her whole, sordid breast inside you, but you know that\'s impossible.  Instinctively, you push back against the welcome, heated pressure, grinding your twat hard on her textured tit-skin.  Warm fluid rushes into your channel almost immediately, thicker and more copious than a minotaur\'s seed.  Some of it even squirts into your womb, while a few stray trickles leak out, dripping over your vulva and onto the creamy, chocolate skinned woman you\'re riding.' );
		//CuntChange 3;
		CoC.getInstance().player.cuntChange( 3, true, true, false );
		EngineCore.outputText( '\n\nYou ' );
		if( CoC.getInstance().player.isTaur() ) {
			EngineCore.outputText( 'squeeze your own [nipples]' );
		} else {
			EngineCore.outputText( 'grab hold of her head' );
		}
		EngineCore.outputText( ' as you begin to pull away and thrust back, languidly fucking yourself on her gushing spout while it floods your pouty, dripping pussy and eager womb with lactic moisture.' );
		if( !CoC.getInstance().player.isTaur() ) {
			EngineCore.outputText( '  Somehow, she\'s able to pull her hand away from your hip while still holding you aloft.  A glowing, arm-shaped silhouette remains, even as she diverts her attention elsewhere.' );
		}
		EngineCore.outputText( '  \'Schluck-schluck-schluck.\'  You can hear her pushing her fingers deep into her neglected womanhoods, and judging by the doubled, wet sounds of penetration, she must be jamming two fingers in her doubled cunts.' );
		EngineCore.outputText( '\n\n"<i>Ooohh yes, Champion, this IS what I needed,</i>" she purrs, accompanied by the lewd sounds of her own self-pleasure.  A second, three-inch, mock-phallus starts to prod at your milky slit along with its brother, and with a pleasured moan, you feel it slide inside, stretching you twice as wide and wet.  Alternating back and forth, hot jets of alabaster cream lance deep inside you, one after another.  You can see the witch using her free hand to compress her breasts in turn, milking her gushing, over-productive breasts again and again.  ' );
		if( CoC.getInstance().player.pregnancyIncubation === 0 ) {
			EngineCore.outputText( 'Your poor womb is flooding with the stuff.  It\'s getting so full that you\'re starting to feel like you should be labelled \'cream-filled\', and a tiny bump has begun to swell on your midsection in response.' );
		} else {
			EngineCore.outputText( 'Your poor pregnant womb is battered with the stuff, but since you\'re already full, jets of hot cream are spraying out from your [vagina] around nipple-shaped milk-injectors.' );
		}
		//CuntChange 6;
		CoC.getInstance().player.cuntChange( 6, true, true, false );
		EngineCore.outputText( '\n\n"<i>Yesssss,</i>" you find yourself hissing, ' );
		if( CoC.getInstance().player.isTaur() ) {
			EngineCore.outputText( 'wishing you could rub your swollen belly' );
		} else {
			EngineCore.outputText( 'rubbing your swollen belly' );
		}
		EngineCore.outputText( '.  Your [vagina] feels like a living, breathing thing, taking in milk and producing nothing but lightning bolts of soul-filling pleasure.  Wracked by the erotic sensations, you shudder atop the Sand Mother, helplessly rutting her nipples.  She squeezes a third up against you, but fails to find purchase in your stuffed slit.  The extra teat merely hoses down your entrance, sloppily pressing itself against every moist, sexually-soaked fold.  Convulsing, your [vagina] spasms, pulling the tit-tips deeper into itself, and just when it relaxes in between suctioning compressions, the third one finds purchase, disappearing into your slavering honeypot in an explosion of white fluid.' );
		//Cuntchange 9;
		CoC.getInstance().player.cuntChange( 9, true, true, false );
		EngineCore.outputText( '\n\nThe Sand Mother gasps, "<i>So good.  How\'s the milk, Champion?  Is it good?  Your pussy is slurping it down so well!</i>"' );
		EngineCore.outputText( '\n\nIt IS good.  You nod to her, noting the way her tongue is lolling out and the rapidly increasing pace of her mastubatory noises.  She\'s going to cum soon and probably fountain from her nipples just as hard as she will from her two twats.  Your thoughts are interrupted by a sudden intrusion in your packed delta - is that... is that a FOURTH nipple inside you?  The answering injection of cream confirms what your startled consciousness is struggling to come to terms with.  Four nipples are spraying almost continually into you.  Gods, you\'re getting so full!  ' );
		if( CoC.getInstance().player.pregnancyIncubation === 0 ) {
			EngineCore.outputText( 'You can feel your midsection going round, wobbling wildly.  POP!  Your belly-button has turned into an outie, accompanied by a wobbling, comforting weight inside you.  Four months... five, no - six... you give up on counting, but with every second that passes, you\'re getting bigger and bigger, visually matching any of the pregnant women you saw growing up.' );
		} else {
			EngineCore.outputText( 'You can feel it fountaining out of you, backwashing out to splatter the witch with wetness, her skin going glossy under the tide of white.  If you weren\'t already pregnant, you\'d probably be ballooning up with her lactic cargo, a rounded, milk-filled cream-balloon.' );
		}

		EngineCore.outputText( '\n\n"<i>Ungh, uhh... gonna c-c-u-uuuhhhhhhh!</i>" the Sand Mother babbles, splattering wetness from her pussies onto your [butt] in a shower of girl-goo.  She screeches, "<i>FUCK YES!  SO GOOD!</i>" before shutting down.  with her four tits cradled in her arm, she squeezes all of them at once, and you you\'re suddenly stuffed with what feels like gallons of gushing pleasure.  Your body was climbing towards orgasm already, but the explosive injection is just too potent for your ecstatic, quivering pussy-lips to endure.  You groan as orgasmic heat radiates through you, culminating in a cunt-clenching squeeze so strong that the nipples are forced to empty inside you a moment before they\'re popped out.  A milky creampie drips down your [legs] as your twitching [butt] falls into the witch\'s lap, leaking all over her.' );
		EngineCore.outputText( '\n\nThe sorceress queen dips her fingers into your milky snatch and gathers up a handful of the oozing sexjuice.  She brings it to her lips, humming in pleasure at the taste before she shares it with you.  You\'re too wrapped in ecstasy to care, and lewdly lick everything from her palm whenever she brings it to your lips, and she does, again and again.' );
		EngineCore.outputText( '\n\nSighing, you eventually disentangle yourself from the satisfied enchantress, but not before giving her a long, wet kiss.' );
		EngineCore.outputText( '\n\n"<i>Perhaps we can tend to our needs the next time they get out of hand,</i>" she suggests.  Yes, you just might have to. ' );
		CoC.getInstance().player.orgasm();
		EngineCore.doNext( EventParser.playerMenu );
	};
	//*History;
	//>Learn about the origin of the sand witches.;
	DungeonSandWitch.prototype.sandWitchHistory = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'You inquire about the history of the sand witches, and how they came to be.  The Sand Mother gives you a benign smile and offers, "<i>With pleasure.  It is so rare that I get to recount the story to one not of our order.</i>"  She utters a few spidery words that seem to ring in your ears, and a luminous, floating illusion appears before her, all floating shapeless colors.  As she begins to talk, the blobs shift into the actors in her tale, allowing you to view the story as it happens.' );
		EngineCore.outputText( '\n\n"<i>A little over a score of years in the past, Mareth was a different place.  The desert was a tiny fraction of its current size, and tribes of all sizes and descriptions were settled all over.  In some places, it would be difficult to walk anywhere without stumbling into some town, trading post, or village.  A small city of human mages had sprung up atop the mountain, the descendants of settlers from ages past.  From this stock, both Sand Witches and demons were born.</i>"  The Sand Mother frowns as if she\'s swallowing a sour grape, clearly upset at sharing ancestry with such a repugnant foe.' );
		EngineCore.outputText( '\n\nIntrigued, you ask exactly how the two human factions came into being, and why these women wound up with doubled chests.  The Sand Mother nods and continues, "<i>A worthy question, to be sure.  Details of the great fall are hazy, of course, but my mother, the Great Mother and some of my older sisters lived through it.  I have yet to pry a detailed account from one of them.  I do know that the fall was hailed as a discovery of immortality and immense magical power all in one.  Within the span of a few hours, most had gleefully abandoned their souls in exchange for additional power and freedom from the tyranny of old age.  The Great Mother did not.</i>"' );
		EngineCore.outputText( '\n\nChuckling happily, the blue-eyed storyteller gleefully recounts, "<i>She sent her daughters away when she saw how it changed her beloved, and she refrained from joining in on the debauchery, promising the newborn demons that she would join them once she was sure there were no drawbacks.  Back then, they were jubilant in their newfound power, and did not greatly care if a few fools took their time in coming to join them.  After all, they offered pleasure and power unending, who could resist?  My mother took advantage of this lapse to study their characteristics and magics, taking the knowledge with her when she fled.  She vanished into the trackless sands, with the wind to mask her family\'s passage through the dunes.  Once there, she changed her body using their black sorceries in order to provide for herself.  Her abilities molded the earth itself into a home, and the Sand Mother began to refine her craft, teaching her daughters all she knew.</i>"' );
		EngineCore.outputText( '\n\nIntriguing.  So twenty years ago a mother and her daughters fled the newborn demons, and they\'ve bred fast enough to be an army now?  It boggles the mind, and you say as much.' );
		EngineCore.outputText( '\n\n"<i>Oh, I know, it sounds like a lot of inbreeding happened in a hurry, but that wasn\'t the case.  There were other dissidents that we sought out, though there weren\'t many of us.  They came to see things from Mother\'s perspective soon enough.  She can be... quite persuasive,</i>" the regal witch says, her eyes taking on a far away cast.  She shivers and resumes, "<i>In addition, portals had begun to open all over the world.  New people trickled in from most of them, and we saved those we could.  The first coven was bursting to capacity in two years time, and we were suitably diverse enough to begin breeding in earnest.</i>"' );
		EngineCore.outputText( '\n\nA hand unconsciously dips to a smooth middle as the witch continues her tale, "<i>A few of our number were chosen to become Cum Witches, the bearers of fertility for our tribe.  They learned magics of fertility and reproduction that allowed us to birth and mature with alarming rapidity.  The rest of us were to be vessels or gatherers, adding to our numbers by any means necessary.  Eventually, it was deemed wise that we split our numbers, and the second coven was born.  We spread like wildfire after that, breeding, hiding, and recruiting all that we could.  Of course, any demons we found were disposed of.</i>"' );
		EngineCore.outputText( '\n\nWell, you suppose that kind of makes sense, but how did the witches resist corruption?' );
		EngineCore.outputText( '\n\nLaughing, the Sand Mother explains, "<i>That one is easier than you would think.  The great bees of Mareth are highly resistant to corruption, to the point that their pure, undiluted honey actively combats it.  With proper treatment, the amber ambrosia can be distilled into a form that will not transform the imbiber but will still remove corruption from one\'s form.  We pursued a trading relationship with the bees, serving as incubators in exchange for honey.  It\'s a small indignity to suffer in exchange for maintaining sanity.  Sadly, our contacts with the fertile caste have gone silent, and we fear something may have happened to the hive.  We have enough ambrosia stockpiled for our own needs, but we must be careful how we ration it.</i>"' );
		EngineCore.outputText( '\n\nNodding, you ask if they would be willing to distill any pure honey you would bring in for your uses.  The Sand Mother answers, "<i>Of course.</i>"  She inclines her head and finishes, "<i>There is not much more to tell.  We grew, we spread, and there are many Sand Mothers now.  The demons took a coven or two, but our decentralized nature protected us.  We routinely wipe out patrols foolish enough to come hunting us, but that doesn\'t seem to stop them.  Was there something else you wanted, [name]?</i>"' );
		this.sandWitchMotherFriendlyMenu();
	};
	//*Current State;
	//>Learn about the current state of the sand witches and their plans;
	DungeonSandWitch.prototype.currentStateOfInterwebs = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'You inquire as to the current state of the sand witches, and this coven in particular. The Queen Witch\'s brow creases in thought as she considers your request, tapping her chin and gazing into the intricate, swirling lights above.' );
		EngineCore.outputText( '\n\n"<i>I suppose I would say that our situation is good, on the whole,</i>" she admits, "<i>We do not lack for nourishment, thanks to our magics.  Our caves shield us from the worst sandstorms and ensure we are never too cold or warm.  And until recently, we believed our dwellings to be well hidden and secure.</i>"  The Sand Mother gives you a wry look and a knowing sigh.  "<i>We both know we were wrong to think so.  Still, our defenses have not been breached by an agent of corruption yet, and this experience will give my sisters and I plenty to consider.  Better you broke down the front door than the Demon Queen\'s armies.</i>"' );
		EngineCore.outputText( '\n\nGently adjusting herself on her throne, the sorceress recounts, "<i>We are many, and the cum witch\'s magics only continue to swell our numbers.  Accelerated growth was one of the first things the great Mother pioneered, so it only takes a few years for a new witch to mature to adulthood and swell our numbers.  Goblins and imps outbreed us by a wide margin, but that\'s to be expected.</i>"  A proud smile graces the Sand Mother\'s face as she brags, "<i>Between the covens I know of, we should have the numbers to challenge the demons in a head-on assault in a year or two.</i>"' );
		EngineCore.outputText( '\n\nReally?  That is quite a mighty force indeed!' );
		EngineCore.outputText( '\n\nThe dusky matriarch grins wolfishly as she says, "<i>Really.  We have not been idle while corruption rises across the lands.  The Great Mother wisely set us upon this path, gathering us, moulding us, and grooming us for the time when we would resurface as saviors.  ' );
		if( CoC.getInstance().flags[ kFLAGS.HEL_HARPY_QUEEN_DEFEATED ] === 0 ) {
			EngineCore.outputText( 'All that remains is to ready those still maturing and wait on our allies to finish growing their numbers.  We shall be carried into the Demon Queen\'s fortress on the wings of phoenixes, to fight as glorious a battle as has ever been fought!' );
		} else {
			EngineCore.outputText( 'All that remains is for us to find new aerial allies or a method of easy, sustained flight.  The phoenixes were smashed apart by fiery demons, their lair raided and destroyed by an interloper.  If only things had been different... Calais was so close.' );
		}
		EngineCore.outputText( '</i>"' );
		EngineCore.outputText( '\n\nYou raise the question of their suitability for battle with the demons.  After all, when you encounter sand witches, they don\'t seem overly deadly.' );
		EngineCore.outputText( '\n\n"<i>Hah!  That\'s an understandable conclusion, but ultimately they aren\'t trying to kill you, they\'re trying to recruit you.  Do you realize how much control it takes to form a flawless sphere of stone and vibrate it inside someone without causing harm?  Forming a vortex of flesh-rending sand is child\'s play next to that.  Hurling boulders with peerless precision barely stretches our mental muscles.  Trust me, when it comes to battle magics, we can match the abilities of the demons,</i>" she assures you with a knowing smile.' );
		EngineCore.outputText( '\n\n"<i>So there you have it, [name].  We are mighty, we are somewhat secure, and if we can continue our plans, we may yet save Mareth.' );
		if( CoC.getInstance().flags[ kFLAGS.HEL_HARPY_QUEEN_DEFEATED ] > 0 ) {
			EngineCore.outputText( '  Of course, this is all contingent on us finding an ally that can breach the mountaintop citadel\'s walls.' );
		}
		EngineCore.outputText( '  Was there something else you needed to ask about?</i>"' );
		//[friendly options];
		this.sandWitchMotherFriendlyMenu();
	};
	//*Cum Witches;
	//(Requires met cum witch or had history chat);
	//>Ask about the role of cum witches in the covens.;
	DungeonSandWitch.prototype.discussCumWitches = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'You inquire as to why they have cum witches.' );
		EngineCore.outputText( '\n\n"<i>Oh, the Cum Witches?  Well, that order arose out of need rather than desire.  We needed to procreate, and just any old male would not suffice.  The Great Mother needed something beyond the ability of a normal human male - a body that knows what it is to be a woman combined with almost limitless virility and carefully engineered seed that would swell our numbers with exactly what we need.  She had learned how to shape bodies to her whims, so forming a phallus and specialized, high output gonads was something easily done.</i>"' );
		EngineCore.outputText( '\n\nThe Sand Mother blushes a bit at this, fidgeting nervously in her chair.  With your curiosity piqued, you ask her, "<i>Well, how are they chosen?</i>"' );
		EngineCore.outputText( '\n\n"<i>It\'s, errr... a rather grueling process.  The Sand Mother of the coven will judge when more cum witches are needed, and the selection process will begin.  Because the position of cum witch is rather... demanding physically, all who wish to become a cum witch must prove themselves capable of enduring the delivery of their duties.  To this end, the candidates are placed in a room to pleasure each other until fatigue takes its toll and all but one are unable to continue.  Being selected as a cum witch is being confirmed as a nymphomaniac by trial of sex, for the common good of course,</i>" the bronzed queen recounts with a wistful smile.' );
		EngineCore.outputText( '\n\nIt sounds rather grueling' );
		if( CoC.getInstance().player.cor + CoC.getInstance().player.lib > 100 ) {
			EngineCore.outputText( ', though potentially fun' );
		}
		EngineCore.outputText( '.  With a little bit of a lecherous smile, you ask if she ever tried out for it.' );
		EngineCore.outputText( '\n\nThe Sand Mother grimaces, but blushes darker, "<i>Yes, before I had a coven of my own, I tried out for that position as well.  I was young and foolish, believing it a position of power and glory.  Doubtless those who hold the station believe it so, but I see it for what it is now.  Slavery.  Slavery to the thrumming heat of one\'s own body and constant service of her sisters.  Sand witches can go free to roam the deserts, scouting or hunting for recruits.  Cum witches?  They fuck.  And fuck.  And fuck.  Their only real respite is studying magic, something they have little enough time for as is.</i>"  Smiling ruefully, she admits, "<i>I\'m glad I did not become a cum witch.  I was allowed to become something more, and perhaps some day, I shall inherit my mother\'s mantle, to rule over a free Mareth.</i>"' );
		EngineCore.menu();
		if( CoC.getInstance().flags[ kFLAGS.MORE_CUM_WITCHES ] === 1 ) {
			EngineCore.outputText( '\n\nYou already convinced her to add more cum witches to her harem so that they might experience a little freedom.' );
			if( CoC.getInstance().flags[ kFLAGS.CUM_WITCHES_FIGHTABLE ] === 0 ) {
				EngineCore.outputText( '  If you asked her to send them out hunting for recruits, you could potentially fight and fuck them in the deserts sands in the future.' );
				EngineCore.addButton( 0, 'Send Out', this.sendOutCumWitch );
			} else {
				EngineCore.outputText( 'Many of them are prowling the desert sands even now, hunting for recruits.  You could wind up having to fight them if you go out.  It\'s possible she might keep them away from you, if you request it.' );
				EngineCore.addButton( 0, 'KeepThemIn', this.keepCumWitchesIn );
			}
		} else {
			EngineCore.outputText( '\n\nYou could ask her to bolster their numbers, allowing them some free time for a change, if you wanted to better their situation.' );
			EngineCore.addButton( 0, 'Bolster Them', this.moreCumWitchesPlease );
		}
		//[Send Them Out] [Back];
		//[Keep Them In] [Back];
		//[Bolster Numbers] [Back];
		EngineCore.addButton( 4, 'Back', EventParser.playerMenu );
	};
	//Send them out:;
	DungeonSandWitch.prototype.sendOutCumWitch = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'You request she put the cum witches\' boundless virility and desire to work for the coven, letting some of them out to venture the sands in search of new recruits.  (<b>From now on, there\'s a chance you\'ll encounter cum witches in the desert.</b>)' );
		CoC.getInstance().flags[ kFLAGS.CUM_WITCHES_FIGHTABLE ] = 1;
		this.sendOutOrKeepInEnding();
	};
	//Keep Them In:;
	DungeonSandWitch.prototype.keepCumWitchesIn = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'You request she put a hold on sending out the cum witches.  Their aggressive, sexual recruitment methods are getting in your way, and for now, it would be best if they were out of your way.' );
		CoC.getInstance().flags[ kFLAGS.CUM_WITCHES_FIGHTABLE ] = 0;
		this.sendOutOrKeepInEnding();
	};
	DungeonSandWitch.prototype.sendOutOrKeepInEnding = function() {
		EngineCore.outputText( '\n\nThe Sand Mother nods and graciously answers, "<i>Very well.  I will honor your request, for now.  I cannot speak for the other covens, but you are unlikely to stray into their territory.  When our time of ascendance comes, do not expect me to honor your requests so freely.  We will stop the Demon Queen however we must, regardless of your wishes.</i>"' );
		EngineCore.doNext( EventParser.playerMenu );
	};
	//Bolster Numbers:;
	DungeonSandWitch.prototype.moreCumWitchesPlease = function() {
		EngineCore.clearOutput();
		//Bimbo version:;
		if( CoC.getInstance().player.findPerk( PerkLib.BimboBrains ) >= 0 || CoC.getInstance().player.findPerk( PerkLib.FutaFaculties ) >= 0 ) {
			EngineCore.outputText( 'Wouldn\'t it be better if there were like, lots of cum witches, with yummy cocks that you could suck?' );
			EngineCore.outputText( '\n\n"<i>No, it wouldn\'t,</i>" the Sand Mother retorts, ending the conversation.' );
			EngineCore.doNext( EventParser.playerMenu );
		}
		EngineCore.outputText( 'You ask her if it wouldn\'t be more humane to simply create a few more cum witches, allowing them to split their duties and actually have time to serve in other ways, either as normal sisters or perhaps helping with the recruitment.' );
		EngineCore.outputText( '\n\n"<i>Doing so would reduce milk production and our breeding population somewhat,</i>" the Dune Mother protests.  "<i>We have done things this way for nearly two decades... it is the most efficient way.</i>"' );
		EngineCore.outputText( '\n\nIt may be the most efficient way, but reducing someone in her charge to little more than a sex slave (even if it is a happy one) does not exactly make her compare favorably to the very demons she fights.' );
		EngineCore.outputText( '\n\nRocking back in her throne, the chocolate-hued matriarch considers your words with a flabbergasted expression.  "<i>I never thought of it that way,</i>" she says, stroking her chin as she mulls it over.  "<i>Would they even want to, that\'s the real question.  Our cum witch seems to take a perverse pride in her work.</i>"' );
		EngineCore.outputText( '\n\nWell, it wouldn\'t hurt to ask, right?' );
		EngineCore.outputText( '\n\nThe Sand Mother nods at that, visibly moved by your arguments.  She calls for her Cum Witch, who arrives in a hurry, soaked in sweat and her own cum.' );
		EngineCore.outputText( '\n\n"<i>My lady, have you decided to bear a child of your own?</i>" the ebony hermaphrodite questions.' );
		EngineCore.outputText( '\n\nSmiling serenely, the coven leader answers, "<i>No, no my dear.  [name] here had an idea.  ' + CoC.getInstance().player.mf( 'He', 'She' ) + ' suggested we add to your ranks, to give you more time to help the coven in ways besides reproduction.  Perhaps through magic, or even going out to patrol and recruit newcomers.  Would you have sisters to free up some of your time, or remain the only one to fill your sisters\' wombs?</i>"' );
		EngineCore.outputText( '\n\nGrinning devilishly the Cum Witch replies, "<i>Oh, mother, that would be splendid.  With more cum witches, I would have time to further research the blessings that speed our youngs\' growth.  Better still, I would get to teach my new sisters what it means to be a member of my order... first hand.</i>"  She visibly quivers with excitement, a string of clear drool hanging from the tip of her visibly erect, pulsing erection.' );
		EngineCore.outputText( '\n\n"<i>I see...  Well, I shall announce the trials at once, and before the day is out, you will have a few new sisters,</i>" the Queen Witch proclaims, waving her hand to dismiss you both.' );
		EngineCore.outputText( '\n\n(<b>This coven now has numerous cum witches.  You can talk to the Sand Mother again and ask her to send them out in search of recruits if you want the chance to fight them in the future.</b>)' );
		CoC.getInstance().flags[ kFLAGS.MORE_CUM_WITCHES ] = 1;
		this.sandWitchMotherFriendlyMenu();
		//Send them out, or back;
	};
	//*Pick Mothers;
	//>Ask about how Sand Mothers are chosen.;
	DungeonSandWitch.prototype.askHowSandMothersAreChosen = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'You ask the Sand Mother how her people choose who will be a Sand Mother of a new coven.' );
		EngineCore.outputText( '\n\nThe statuesque woman smirks ruefully, "<i>Politics, of course.</i>"  Politics?  She sees the confused look on your face and explains, "<i>It shouldn\'t surprise you.  You' );
		if( CoC.getInstance().player.race() === 'human' ) {
			EngineCore.outputText( '\'re a human' );
		} else {
			EngineCore.outputText( ' were a human' );
		}
		EngineCore.outputText( '.  Our people are notorious for forming gangs and cliques, groups focused around a leader\'s charisma.  It\'s only natural that has continued in Mareth.  It would not surprise me to learn that even the demons have their own factions and political malcontents, though I imagine they deal with them far more harshly than we.</i>"' );
		EngineCore.outputText( '\n\nWaving her arm nonchalantly, the Sand Mother says, "<i>When a coven grows a bit too big, the Sand Mother will announce the creation of a new coven.  Typically at this point, the more adventurous and ambitious witches will begin gathering the like-minded to their side, and they\'ll all try to curry favor with their Sand Mother in an attempt to secure the ascension of their chosen leader.</i>"  She steeples her fingers before interlacing them.  "<i>It doesn\'t always work out, even for the most popular groups.  Ultimately, it\'s up to the Great Mother or the Sand Mother\'s decision, and sometimes, she\'ll simply choose a favored daughter.</i>"' );
		EngineCore.outputText( '\n\nWouldn\'t that result in anger from a potentially powerful rival?  You voice your query.' );
		EngineCore.outputText( '\n\n"<i>Oh, that\'s a certainty.  However, discontent is not something that can be allowed to fester.  A few months being lavished with a cum witch\'s attentions and birthing fresh young has a way of smoothing out political differences.  In some ways, we are like the ant-girls of this world.  We must work together for the greater good, or we will fall.  Everyone has a place,</i>" she declares perhaps a bit too proudly.' );
		EngineCore.outputText( '\n\nRubbing your chin in thought, you thank her for the information and mull over their strange practices.  They\'ve given up every most personal agency and freedoms in exchange for a stronger, more cohesive whole.  You aren\'t so sure it\'s a great idea, but you have no alternative to offer.' );
		//friendly menu;
		this.sandWitchMotherFriendlyMenu();
	};
	//*Leave Alone/Send Lackeys;
	//>Request sand witches stop or start attacking you.;
	DungeonSandWitch.prototype.leaveAloneSendLackeysToggle = function() {
		EngineCore.clearOutput();
		//Leave Alone;
		if( CoC.getInstance().flags[ kFLAGS.SAND_WITCH_LEAVE_ME_ALONE ] === 0 ) {
			EngineCore.outputText( 'You request that the scouts in the desert stop bothering you with their barbed offers of magic.  Fighting them is not something you want to have to do.  It\'s a waste of effort on both sides you that feel should come to an end.' );
			EngineCore.outputText( '\n\nThe Sand Mother\'s tanned visage remains impassive as she digests your request.  The silence is almost palpable, and the longer it stretches out, the more you wonder if you\'ve committed some kind of faux pas.' );
			EngineCore.outputText( '\n\n"<i>Fine,</i>" she states with brevity so sharp it slightly startles you.  Her incandescent eyes fix your own as she continues, "<i>My girls will not trouble you in your journeys, but know that doing so is no easy task - our covens are not used to being that discerning about potential recruits.</i>"  She folds her arms across her bosom in an imperious gesture of finality.' );
			EngineCore.outputText( '\n\nWell, you guess that worked.' );
			CoC.getInstance().flags[ kFLAGS.SAND_WITCH_LEAVE_ME_ALONE ] = 1;
		}
		//Send Lackeys;
		else {
			EngineCore.outputText( 'You mention that you wouldn\'t mind the witches trying to recruit you as they used to.' );
			EngineCore.outputText( '\n\n"<i>Really?</i>" the Sand Mother coos with a tinge of eagerness in her voice.  "<i>You\'re not opposed to me taking the leash off my scouts and letting them try to... shape you?</i>"' );
			if( CoC.getInstance().player.cor > 66 ) {
				EngineCore.outputText( '\n\nGrinning confidently, you answer that you welcome the challenge.' );
			} else if( CoC.getInstance().player.cor > 33 ) {
				EngineCore.outputText( '\n\nSmiling ruefully, you tell her that it will be a good challenge to strengthen both sides.' );
			} else {
				EngineCore.outputText( '\n\nToeing the floor, you try to hide your blush at her words but tell her that it\'s good fighting practice.' );
			}
			EngineCore.outputText( '\n\nThe queen of the coven smiles, her eyes burning with desire as she proclaims, "<i>It will be so.  I hope you do not mind overmuch if the next time we meet your nipples are dragging the floor, leaking milk the whole way to the baths.</i>"  Her nipples have noticeably stiffened through her thick robes, dampening the material with her own lactic lust.  Humming happily, she calls for one of the lesser witches to attend to her.  When the younger enchantress arrives, she\'s given the order to spread the message, but before she goes, she gives you a long, lecherous look.' );
			EngineCore.outputText( '\n\nYou\'re suddenly not so sure this was a great idea.' );
			CoC.getInstance().flags[ kFLAGS.SAND_WITCH_LEAVE_ME_ALONE ] = 0;
		}
		EngineCore.doNext( EventParser.playerMenu );
	};
	//*Lactaid;
	//>Get lactaid;
	DungeonSandWitch.prototype.getLactaidFromWitches = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'You ' );
		if( CoC.getInstance().player.cor < 33 ) {
			EngineCore.outputText( 'politely request' );
		} else if( CoC.getInstance().player.cor < 66 ) {
			EngineCore.outputText( 'request' );
		} else {
			EngineCore.outputText( 'none-too-politely request' );
		}
		EngineCore.outputText( ' a dose of Lactaid from her coven.' );
		EngineCore.outputText( '\n\n"<i>Are you thinking of joining us?  We could do the deed much more directly with our magics,</i>" the Sand Mother offers.  "<i>These dunes are as comfortable to us as a mother\'s bosom, and your place among us could be most pleasant.</i>"' );
		EngineCore.outputText( '\n\nYou decline the offer and repeat your request for Lactaid, which sours the woman\'s expression slightly.  The corners of her mouth are still upturned in a half smirk when she procures a bottle and hands it to you.  After, she smooths her hand across her robed lap, and for a split second, you wonder if she\'s trying to beckon you to take a seat there...  You shake your head as you examine the bottle in your hand.  You got what you came for.\n\n' );
		CoC.getInstance().flags[ kFLAGS.SAND_WITCH_LOOT_TAKEN ]++;
		//Receive one lactaid;
		CoC.getInstance().inventory.takeItem( ConsumableLib.LACTAID, EventParser.playerMenu );
	};
	//*Labova;
	//>Get Labova;
	DungeonSandWitch.prototype.getLaBova = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'You ask for some La Bova' );
		if( CoC.getInstance().player.cor < 33 ) {
			EngineCore.outputText( ' with a blush' );
		} else if( CoC.getInstance().player.cor < 66 ) {
			EngineCore.outputText( ' a little uncertainly' );
		} else {
			EngineCore.outputText( ' with a knowing smile' );
		}
		EngineCore.outputText( '.' );
		EngineCore.outputText( '\n\n"<i>Oh?  You\'re not going to move into the mountains and try to woo the minotaurs into submission with milk are you?</i>" the Sand Mother questions.  "<i>That would be a sure descent into corruption.</i>"' );
		EngineCore.outputText( '\n\nYou shake your head' );
		if( CoC.getInstance().player.cor > 66 ) {
			EngineCore.outputText( ', though the idea does seem to nestle into your imagination quite alluringly' );
		}
		EngineCore.outputText( '.' );
		EngineCore.outputText( '\n\n"<i>That is good.  The ways of beasts offer many boons.  This one is quite useful for enhancing lactation, for instance.  However, there is great risk in reveling in such transformation.  Be sure that you don\'t lose yourself to it,</i>" the statuesque sorceress warns.' );
		EngineCore.outputText( '\n\nYou nod, and she gives you the La Bova.\n\n' );
		CoC.getInstance().flags[ kFLAGS.SAND_WITCH_LOOT_TAKEN ]++;
		CoC.getInstance().inventory.takeItem( ConsumableLib.LABOVA_, EventParser.playerMenu );
	};
	//TURN EM OFF!;
	DungeonSandWitch.prototype.unfriendlyWitchToggle = function() {
		EngineCore.clearOutput();
		if( CoC.getInstance().flags[ kFLAGS.SAND_WITCH_LEAVE_ME_ALONE ] === 0 ) {
			EngineCore.outputText( 'Imperiously, you fold your arms and tell the queen of the milky slatterns to cease her coven\'s constant, badgering attacks out on the sands.  Her face registers an incredulous expression at the decree, and she matches your confrontation pose, her forearms pressing deep into the recesses of her prodigious bust.  You await her response, and for a moment, you think you\'re going to have to fight her again.  Then, her stern gaze wavers as she sags into her throne, defeated before she could even start to resist.' );
			EngineCore.outputText( '\n\n"<i>Fine.  I guess then...</i>" she casts her incandescent gaze to the side, "<i>...you won\'t be able to force yourself on them.</i>"  You chuckle at that.' );
			if( CoC.getInstance().player.cor < 50 ) {
				EngineCore.outputText( '  You probably wouldn\'t do something like that, at least not without provocation!/  You could see how she would think that.' );
			} else {
				EngineCore.outputText( '  As if that would stop you.' );
			}
			EngineCore.outputText( '  Slapping her on the shoulder, you congratulate her on seeing good sense.  Her eyes narrow dangerously as she twists away from your touch.' );
			EngineCore.outputText( '\n\n"<i>Just... just, leave us be,</i>" the Sand Mother\'s reedy voice pleads.' );
			CoC.getInstance().flags[ kFLAGS.SAND_WITCH_LEAVE_ME_ALONE ] = 1;
		}
		//TURN EM ON;
		else {
			EngineCore.outputText( 'You smile and tell the Sand Mother that you\'d like her lackeys to start pestering you again.  It\'s been awhile since you\'ve gotten to show one of her pet witches her place, and mobile milk-dispensers are always a welcome treat out on the sands.  Her face grows livid at the suggestion, and she actually rises up out of her throne, shaking with rage.  Holding your [weapon] up, you cock your head to the side and dare her to oppose you.' );
			EngineCore.outputText( '\n\n"<i>No,</i>" the tanned enchantress mumbles, sitting back down.  "<i>I can\'t... fine.  I\'ll tell them they can pursue you if they dare.  Do not expect us to fall before you without a struggle.</i>"' );
			EngineCore.outputText( '\n\nYou reply, "<i>I wouldn\'t dream of it.</i>"' );
			CoC.getInstance().flags[ kFLAGS.SAND_WITCH_LEAVE_ME_ALONE ] = 0;
		}
		EngineCore.doNext( EventParser.playerMenu );
	};
	//EngineCore.addButton(5,'Get LaBova',this.takeLaBovaOrLactaid, false);;
	//EngineCore.addButton(6,'Get Lactaid',this.takeLaBovaOrLactaid);;
	//*Raid LaBova/Lactaid;
	DungeonSandWitch.prototype.takeLaBovaOrLactaid = function( lactaid ) {
		EngineCore.clearOutput();
		EngineCore.outputText( 'Smirking, you circle around the Sand Mother\'s throne towards the secure chests behind her.  She stiffens when you come close but doesn\'t make a move.  The poor little witch is afraid of you, and with good reason.  You gather the item you came for, condescending patting the sorceress\'s platinum tresses on your way back in front of her throne.  She glares at you.\n\n' );
		//New lines and take appropriate item.;
		if( lactaid === undefined || lactaid ) {
			CoC.getInstance().inventory.takeItem( ConsumableLib.LACTAID, EventParser.playerMenu );
		} else {
			CoC.getInstance().inventory.takeItem( ConsumableLib.LABOVA_, EventParser.playerMenu );
		}
	};
	DungeonSandWitch.prototype.pullLever = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'There is a loud rumbling from the direction of the cavernous commons...' );
		CoC.getInstance().flags[ kFLAGS.SANDWITCH_THRONE_UNLOCKED ] = 1;
		EngineCore.doNext( EventParser.playerMenu );
	};
	//*Take Fertile Pills ✓Kirbu;
	DungeonSandWitch.prototype.takeFertilePills = function() {
		EngineCore.clearOutput();
		if( CoC.getInstance().player.findStatusAffect( StatusAffects.Contraceptives ) < 0 ) {
			EngineCore.outputText( 'You aren\'t under the effects of a contraceptive, so taking a pink pill would do nothing.' );
		}//{Contraceptives};
		else {
			EngineCore.outputText( 'It doesn\'t take you long to figure out that the pink pill should cancel the effects of your contraceptives.  You pop it into your mouth and swallow, feeling a tingle near your crotch after a moment.  You should be capable of bearing children again' );
			if( !CoC.getInstance().player.hasVagina() ) {
				EngineCore.outputText( ', should you ever grow a vagina' );
			}
			EngineCore.outputText( '.' );
			CoC.getInstance().player.removeStatusAffect( StatusAffects.Contraceptives );
		}
		EngineCore.doNext( EventParser.playerMenu );
	};
	//*Take Barren Pills✓Kirbu;
	DungeonSandWitch.prototype.takeBarrenPills = function() {
		EngineCore.clearOutput();
		//{Already contraceptive'ed} ;
		if( CoC.getInstance().player.findStatusAffect( StatusAffects.Contraceptives ) >= 0 ) {
			EngineCore.outputText( 'You\'re already under the effects of contraceptives.  Taking one of the brown pills wouldn\'t do anything.' );
		}//{TAKE DAT SHIT YO};
		else {
			EngineCore.outputText( 'You figure one of these brown pills should render you barren, and you pop it into your mouth, not wanting to be impregnated.' );
			if( CoC.getInstance().player.pregnancyIncubation > 0 ) {
				EngineCore.outputText( '  Of course, you\'re already pregnant, and this doesn\'t seem to be doing anything about THAT.' );
			}
			EngineCore.outputText( '  You do feel an emptiness in your midsection, reassuring you that the pill did its job.' );
			if( !CoC.getInstance().player.hasVagina() ) {
				EngineCore.outputText( '  Now if you ever re-grow a vagina, you should be fine.' );
			}
			CoC.getInstance().player.createStatusAffect( StatusAffects.Contraceptives, 0, 0, 0, 0 );
		}
		EngineCore.doNext( EventParser.playerMenu );
	};
	//*Friendly Cum Witch Blessing;
	//✓Kirbu;
	DungeonSandWitch.prototype.friendlyCumWitchBlessing = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'You ask the Cum Witch if she could use her magic to gift you with some kind of blessing since she has such an affinity for sexualized magics and fertility.  ' );
		if( CoC.getInstance().player.cor < 33 ) {
			EngineCore.outputText( 'Blushing, ' );
		} else if( CoC.getInstance().player.cor < 66 ) {
			EngineCore.outputText( 'Nervously, ' );
		} else {
			EngineCore.outputText( 'Boldly, ' );
		}
		EngineCore.outputText( 'you remove your armor, figuring whatever blessing she\'s going to give is going to be at least a little bit sexual.' );
		EngineCore.outputText( '\n\n"<i>Oh my, you are eager, aren\'t you?</i>"  The dusky sorceress circles you as she takes off her hat, shaking her almost platinum-white tresses sensually as she frees them from constriction.  "<i>Well, I could give you my blessing, but you have to truly want it.  My \'magic wand\' will need to be charged up before it can gift you with its power.</i>" She sheds her robes, exposing her long, ebony phallus, already beading with pre.  It doesn\'t look like it would need much encouragement to \'bless\' you, but perhaps this woman\'s unceasing sexual conquests have given her stamina beyond your expectations.' );
		//{M:};
		if( CoC.getInstance().player.gender === 1 ) {
			EngineCore.outputText( '\n\nThe cum witch says, "<i>Since you\'re being so nice about this, I can bless you with enhanced volume and virility.  All you have to do is help me release some of mine onto you...</i>"' );
		}
		//{F:};
		else if( CoC.getInstance().player.hasVagina() ) {
			EngineCore.outputText( '\n\nThe cum witch says, "<i>Since you\'re being so nice about this, I can bless you with superhuman fertility.  Just a little seed inside you and you\'ll be swelling with babies.  Doesn\'t that sound nice?</i>"' );
		} else if( CoC.getInstance().player.gender === 3 ) {
			EngineCore.outputText( '\n\nThe cum witch says, "<i>Ohhh, a fellow hermaphrodite.  Tell me, would you rather I gift you with unceasing virility or the fertility of a slut in heat?  I can only give you one.</i>"' );
		} else {
			EngineCore.outputText( '\n\nThe cum witch says, "<i>Oh, you lack a gender.  Why don\'t you pick up some sexual equipment and come back for some real fun.</i>"' );
		}
		//[Virility] [Fertility] [Nevermind];
		EngineCore.menu();
		if( CoC.getInstance().player.hasCock() ) {
			EngineCore.addButton( 0, 'Virility', this.cumWitchBlessed, true );
		}
		if( CoC.getInstance().player.hasVagina() ) {
			EngineCore.addButton( 1, 'Fertility', this.cumWitchBlessed, false );
		}
		EngineCore.addButton( 4, 'Nevermind', this.changeMindAboutBlessings );
	};
	//*Nevermind ✓Kirbu;
	DungeonSandWitch.prototype.changeMindAboutBlessings = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'Thinking better of it, you grab your [armor] and get dressed, telling the jizz-obsessed enchantress that you don\'t need her gifts for now.' );
		EngineCore.outputText( '\n\n"<i>Awww, and I thought we were going to have some fun,</i>" the sable seductress purrs.  "<i>Perhaps you\'ll see the error of your ways and come back for a proper blessing soon.</i>"  She pumps her fat cock until thick dribbles of sperm-tinted pre-cum slobbers out of her drooling dick-tip once more.  "<i>Don\'t be a stranger.</i>"' );
		EngineCore.doNext( EventParser.playerMenu );
	};
	//*Virility/Fertility;
	DungeonSandWitch.prototype.cumWitchBlessed = function( virility ) {
		if( virility === undefined ) {
			virility = true;
		}
		EngineCore.clearOutput();
		EngineCore.outputText( 'Your choice made, you lower yourself until you are seated on your [legs], your face aligned at the perfect height to fellate her drippy, onyx dong.  You can still smell the scent of freshly-fucked pussy hanging around her shaft like some kind of sexual haze.  She saunters up, wide ebony hips swaying hypnotically as her male-half sways pendulously, closer and closer.  Her hands come to rest on your head and run through your ' + Descriptors.hairDescript() + ' with slow strokes as she nudges her crown against your upper lip, letting it smear her juices under your nose and across your cheek.  The eleven inches throb pleasantly against the side of your face, the veins standing out in stark relief as you glance down to her orange-sized cum-factories, held in a tight, smooth pouch just below.' );
		EngineCore.outputText( '\n\nUnthinkingly, you reach out to fondle the heavy package, your fingers curling around the woman\'s soft sack and rolling the swollen testes back and forth.  The black beauty grabs her shaft and lays it across your nose, up between your eyes, and onto your forehead, forcing you to go cross-eyed as you admire it.  An electric tingle runs through her fingers and into your scalp, short-circuiting your thoughts for a second.' );
		EngineCore.outputText( '\n\n...Her cock is gorgeous.  Your mouth waters just looking at it.  You lick your lips before hesitantly extending your tongue out, lapping at the bottommost portions of her divine dick.  The taste of her sweat and caked-on girl-cum is so strong that it makes you shiver.  Another jolt of power slips into you.  It tastes <b>soo good</b>!  You slobber all over it, trying to gather up every taste of her old, spent seed onto your tongue, your eyes fixated on the erection as it dribbles a trail of liquid need down the bridge of your nose.  It likes you!  A ecstatic thrill shivers through your spine at the knowledge that you\'ve pleased it so excellently, and you gingerly grab hold of it, pulling back so that you can plunge the entire thing straight into your mouth.' );
		EngineCore.outputText( '\n\nAs it plunges through your lips, across your wiggling tongue, and into the back of your throat, you stop caring about whether or not you get a blessing out of the deal.  You\'ve got her perfect prick in your mouth where it belongs, and you let out a hum of pure, divine excitement.  Bobbing back and forth, you admire the way your spit froths and shines her glorious rod while you fellate it.  A couple times, you nearly gag on it, but while you\'re coughing around her meat, the cum witch\'s hands massage her familiar tingles into you, tamping down any such worry.  The next time you go forward, you let her the entire way into your throat, and it feels oh so good to let her fuck your throat.' );
		EngineCore.outputText( '\n\nWrenching your eyes from her thickness, you look up at her innocently, still squeezing her slowly filling sack - those nuts are each big enough to fill a hand at this point.  The sorceress of seed gives you a lascivious smile and begins to rock her hips, fucking your mouth.  You let her have control and purse your lips into a tightly-sealed \'o\'.  Fucking your mouth faster and harder, the cum witch sighs and says, "<i>Oh, your mouth is nice and wet.  Such a tight little fuck-hole you\'ve got there - you\'ll have my blessing in no time slut.  Doesn\'t that make you happy?</i>"' );
		EngineCore.outputText( '\n\nGiving a hum of assent, you let the corners of your mouth crinkle upward in a smile as you\'re used.  It\'s starting to feel really good, like your throat really is a cunt, a horny, cock-hungry twat that needs to be plowed deep, long, and hard by her thick ebony dong.  It\'s dripping long ropes of wasted pre-seed into your belly, and it tingles with the pleasant promise of spooge to come.  You waggle your tongue around as best you can to enhance the sensation, getting hotter and hornier with each passing moment.' );
		if( CoC.getInstance().player.tongueType > AppearanceDefs.TONUGE_HUMAN ) {
			EngineCore.outputText( '  Your inhuman tongue slides further and further out, following the witch\'s bulging, pre-cum filled urethra towards her balls where it can curl around them, embracing them with slick, slippery saliva.  You can taste her unique flavor on her skin, and it makes you shudder with arousal.' );
		}

		EngineCore.outputText( '\n\n"<i>Fuck, I hope you\'re ready for a blessing,</i>" the groaning futanari announces as she pulls out.  One of her hands stays on her delicious, spit-and-cum soaked dick, pumping through the frothy mix as she looks at your whorish, pursed lips.  The other stays in your hair, tingling almost constantly as you ready yourself for her anointment, the perfect gift you\'ve been craving.  Your lust has risen to unbearable levels, making ' );
		if( virility ) {
			EngineCore.outputText( '[eachCock] drip and drool your own seed onto the floor.  The heat inside you is so hot that you can\'t keep your ardor penned up, and it\'s slowly boiling out of your [balls] in a pleasure-filled orgasm that provides everything but relief.  You\'re sure that touching yourself would give you a proper orgasm, but you keep your hands where they belong - on her balls.' );
		} else {
			EngineCore.outputText( 'your [vagina] ' );
			if( CoC.getInstance().player.wetness() < 3 ) {
				EngineCore.outputText( 'drip' );
			} else if( CoC.getInstance().player.wetness() < 4 ) {
				EngineCore.outputText( 'drool' );
			} else if( CoC.getInstance().player.wetness() < 5 ) {
				EngineCore.outputText( 'leak' );
			} else {
				EngineCore.outputText( 'spray' );
			}
			EngineCore.outputText( ' your juicy secretions onto the ground below.  Your lust has risen to such unbearable levels that you\'re clenching and dripping in orgasmic delight without any release.  You\'re sure just a touch on your clit would have you cumming your brains out, but you keep your hands on her balls.' );
		}
		EngineCore.outputText( '\n\nHer perfect, glossy tip suddenly opens up, and her holy fluid comes out.  You open up to try and catch it on your tongue, to taste her perfect flavor, but it slaps wetly across your forehead instead.  The next blob smears across your cheek, so voluminous that it\'s dripping from your chin already.  Everywhere her blessed goo touches lights up with pleasure, and soon you ARE cumming, shuddering and shaking with an orgasm of indescribable pleasure.  Your eyes roll back as fat dollops of seed splatter across your [chest] and belly, even your [legs].  You\'re painted with the stuff, and when you manage to catch some in your mouth?  Your tongue itself cums, spasming and slapping around your mouth, sloshing the tasty stuff around before you convulsively swallow it.' );
		EngineCore.outputText( '\n\nYou flop onto your back as she continues to hose you down with her unholy virility, giving you a full-body-gasm of incredible potency.  When you blink the ropes of jism from your eyes and look up with a dopey expression, you see the cum witch banging a sand witch on the other side of the room, already filling the twat with her oozing precum.  A pang of jealousy runs through you before you realize how she made you lust for her juices artificially, but there is a certain fullness in your ' );
		if( !virility ) {
			EngineCore.outputText( 'womb' );
		} else {
			EngineCore.outputText( '[balls]' );
		}
		EngineCore.outputText( ' that reminds you that you got exactly you asked for, even if she made you like it a little bit more than you would have liked...' );
		EngineCore.outputText( '<b>' );
		if( virility ) {
			EngineCore.outputText( '\n\n(Perk Unlocked: Magical Virility - 200 mLs more cum per orgasm and enhanced virility.)' );
			CoC.getInstance().player.createPerk( PerkLib.MagicalVirility, 0, 0, 0, 0 );
		} else {
			EngineCore.outputText( '\n\n(Perk Unlocked: Magical Fertility - 10% higher chance of pregnancy and increased pregnancy speed.)' );
			CoC.getInstance().player.createPerk( PerkLib.MagicalFertility, 0, 0, 0, 0 );
		}
		CoC.getInstance().flags[ kFLAGS.BEEN_BLESSED_BY_CUM_WITCH ] = 1;
		CoC.getInstance().player.orgasm();
		EngineCore.dynStats( 'lib', 1, 'sen', -5 );
		EngineCore.outputText( '</b>' );
		EngineCore.doNext( EventParser.playerMenu );
	};
	//*Impregnating Pregnant Sand Witches by Xodin (NEEDS EDIT);
	DungeonSandWitch.prototype.knockUpSomeDoubleStuffedSandWitches = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'Figuring these horny, pregnant sluts should be more than receptive to a little sex, you shed your [armor].\n\n' );
		EngineCore.outputText( 'The heavily pregnant sand witches all stare at your [cock biggest] with rapt attention before they begin crawling towards you.  "<i>Please!</i>" each of them cry out.  "<i>Too horny!  Too many hormones!</i>"  Some of them crawl on their hands and knees with their quadruple breasts and pregnant bellies dragging along the ground.  "<i>We need more!</i>"  One cries out.  "<i>More cock!</i>" cries another.  "<i>More children!</i>" begs a third rubbing her belly.  "<i>Fill us!</i>" chants one before the others chime in.  "<i>Yes; Fill us! Fill us!  Fill us!</i>"  They paw at your genitals with sexual hunger burning in their eyes.  The smell of wet pussies permeates the air, encouraging your body\'s own arousal.' );
		EngineCore.dynStats( 'lus', 33 );
		//[FUCK ONE] *Requires at least one Cock of appropriate size and enough lust.;
		EngineCore.menu();
		if( CoC.getInstance().player.cockThatFits( 50 ) < 0 ) {
			EngineCore.outputText( '\n\n<b>You\'re too damned big to fuck any of them.</b>' );
		}
		if( CoC.getInstance().player.hasCock() && CoC.getInstance().player.cockThatFits( 50 ) >= 0 && CoC.getInstance().player.lust >= 33 ) {
			EngineCore.addButton( 0, 'Fuck One', this.fuckOneSandWitch );
		}
		//[TWO AT ONCE] *Requires at least two Cocks of appropriate size and enough lust.;
		if( CoC.getInstance().player.cockThatFits( 50 ) >= 0 && CoC.getInstance().player.cockThatFits2( 50 ) >= 0 && CoC.getInstance().player.lust >= 33 ) {
			EngineCore.addButton( 1, 'Fuck Two', this.fuckTwoPregWitches );
		}
		//[FUCK EM ALL] *Requires at least one Cock of appropriate size and enough lust.;
		if( CoC.getInstance().player.cockThatFits( 50 ) >= 0 && CoC.getInstance().player.lust >= 33 ) {
			EngineCore.addButton( 2, 'Fuck\'EmAll', this.fuckAllThePregWitches );
		}
		//[MASS GANGBANG] *Requires lots of cocks of appropriate size and enough lust.;
		//[TENTACLE GANGBANG] *Requires lots of tentacle cocks and enough lust.;
		EngineCore.addButton( 9, 'Back', EventParser.playerMenu );
	};
	//~ FUCK ONE;
	DungeonSandWitch.prototype.fuckOneSandWitch = function() {
		EngineCore.clearOutput();
		var x = CoC.getInstance().player.cockThatFits( 50 );
		if( x < 0 ) {
			x = CoC.getInstance().player.smallestCockIndex();
		}
		//{if player does not have a tentacle cock} ;
		if( CoC.getInstance().player.tentacleCocks() === 0 ) {
			EngineCore.outputText( 'You grab the tanned shoulders of the closest pregnant witch and flip her over on to her back, trapping her beneath the weight of her belly and breasts while you grab both of her ankles.  Her dirty blonde, sweat-soaked hair lies in waves around her head on the floor as she pants heavily in sexual desperation.' );
		}//{else if player has a tentacle cock};
		else {
			EngineCore.outputText( 'Your tentacle cock lashes outwards, extending as it goes, and wraps around the ankle of the closest girl. It flips her over on to her back, trapping her own torso beneath the weight of her heavy pregnancy and her own four massive leaking breasts.' );
		}
		//{if player has two tentacle cocks};
		if( CoC.getInstance().player.tentacleCocks() > 1 ) {
			EngineCore.outputText( '  Another tentacle cock reaches out for the girl\'s other ankle, and together your cocks spread her tanned legs wide, revealing her large double pussy bloated from her pregnancy.' );
		} else {
			EngineCore.outputText( '  You reach forward with a hand to grab her other ankle and with your cock and arm you spread her tanned legs wide to reveal her large double pussy, bloated from her pregnancy.' );
		}

		EngineCore.outputText( '\n\nHer dual set of labia are a darker shade than the rest of her tan flesh and enthusiastically drip with her juices.  One set is gaping wide, clearly under pressure from her womb within.  The other set are swollen but eager to be filled with true cock flesh capable of sowing her second womb full of seed.  "<i>P-please!</i>" she begs as if she was a wounded animal.  Her multiple breasts and belly jiggle and sway over the rest of her as she tries to angle her pelvis towards you.  The knob of her belly button traces circles in the air as her hips gyrate.' );
		var multi = false;
		//{if player has two tentacle cocks and at least one other cock that will fit her pussy};
		if( CoC.getInstance().player.tentacleCocks() >= 2 && CoC.getInstance().player.cockTotal() >= 3 && CoC.getInstance().player.cocks[ x ].cockType !== CockTypesEnum.TENTACLE ) {
			EngineCore.outputText( '\n\nYour tentacle cocks release the pregnant witch\'s ankles and wrap around her thighs instead. You align a third cock at the base of her second pussy with the head gently sliding between her nether\'s sopping wet lips. With a strong tug your tentacle cocks pull on the girl\'s tanned thighs and impale her sex upon your manhood.' );
			multi = true;
		}
		//else if players without two long tentacle cocks have multiple cocks that fit;
		else if( CoC.getInstance().player.tentacleCocks() >= 2 && CoC.getInstance().player.cocks[ x ].cockType !== CockTypesEnum.TENTACLE && CoC.getInstance().player.cockThatFits2( 50 ) >= 0 && CoC.getInstance().player.cockTotal() >= 4 ) {
			EngineCore.outputText( '\n\nReleasing the girl\'s ankles you align your cocks between the drooling labia of her second pussy.  "<i>Y-yes!</i>" she squeals as you start pushing the multiple shafts into her all at once, "<i>S-so-much c-c-cock!</i>" she blissfully exclaims as her womanhood is stretched almost painfully beyond what it should be able to take.' );
			multi = true;
		}
		//else if player has one non-tentacle cock, or only one cock that fits;
		else {
			EngineCore.outputText( '\n\nYour hands slide along the witch\'s legs and up her thighs until they grasp her hips. You allow the shaft of your ' + Descriptors.cockDescript( x ) + ' to slide up and down the folds of her dripping labia until your cockhead slips in between and presses against her entrance.  "<i>P-please!  Q-quickly!  I n-n-neeeed it!</i>"  You\'re all too eager to service her as you thrust forwards.' );
		}
		EngineCore.outputText( '  The witch\'s moans and grunts of pleasure arouse the other witches in the room as they watch with the utmost jealously.  Some grab their nipples while others try to finger their pussies; whining and getting off on their envious voyeurism as they watch you fuck their sister.' );
		//{all} ;
		EngineCore.outputText( '\n\nYour thrusts become forceful enough to rock the impaled witch\'s torso up and down along the floor. Her upper breasts repeatedly smack her own face while her lower slap against the swollen sides of her pregnant belly. All four of her heavily milk engorged tits spray streams of her cream into the air. Whimpering moans of orgasmic ecstasy constantly stream from her perfectly plump lips. Her body shakes and trembles with the convulsions of constant climaxes. The sensation of your bare cock flesh sliding against the naked walls of her inner depths with every thrust quickly shuts down the girl\'s higher brain functions. She becomes a senseless pregnant she-beast lost in the throes of pleasure that your shaft' );
		if( multi ) {
			EngineCore.outputText( 's constantly pound' );
		} else {
			EngineCore.outputText( ' constantly pounds' );
		}
		EngineCore.outputText( ' into her nethers. Drool escapes her lips and drips down her cheek even as her eyes roll back in her head. Talk about an easy lay.' );
		//{if player has large but not extremely massive breasts} ;
		if( CoC.getInstance().player.biggestTitSize() >= 4 && CoC.getInstance().player.biggestTitSize() < 15 ) {
			EngineCore.outputText( '\n\nYour breasts bounce up and down as you get in to the groove of fucking your pregnant playtoy.' );
			//{if player is largely pregnant and has large breasts.};
			if( CoC.getInstance().player.pregnancyIncubation > 0 && CoC.getInstance().player.pregnancyIncubation < 200 ) {
				EngineCore.outputText( '  Each time it does so your own breasts slap against your swollen midsection.' );
			}
			//{if player has four or more large breasts and is not pregnant};
			else if( CoC.getInstance().player.bRows() >= 2 ) {
				EngineCore.outputText( '  Your lower pair of breasts slap against the pregnant girl\'s belly with each thrust.' );
			}
		}
		//else if player has extremely huge breasts;
		else if( CoC.getInstance().player.biggestTitSize() >= 15 ) {
			EngineCore.outputText( '\n\nYour [chest] are massive enough that they jiggle instead of bounce with each thrust.' );
			//if player has only one set of massive breasts ;
			if( CoC.getInstance().player.bRows() === 1 ) {
				EngineCore.outputText( '  Your two heavy milk sacs sway and at times you must rest them on top of the poor witch\'s belly to keep from prematurely exhausting yourself.' );
			} else if( CoC.getInstance().player.bRows() >= 2 ) {
				EngineCore.outputText( '  Resting on top of each other and on top of the witch\'s legs, your giant globes of tit flesh quake each time you hips move.' );
			}
			EngineCore.outputText( '  The witches around the room can\'t help but gawk at how much more endowed your mammaries are than even their own, and how the wrong forwards or backwards movement could result in either you or the witch you\'re fucking to be suddenly smothered under the weight of your ridiculously engorged tits.' );
		}
		EngineCore.outputText( '\n\nIt isn\'t long before the sensations of naked wet flesh sliding along your ' );
		if( multi ) {
			EngineCore.outputText( 'shafts' );
		} else {
			EngineCore.outputText( 'shaft' );
		}
		EngineCore.outputText( ' forces you to reach your own orgasm.' );
		if( CoC.getInstance().player.balls > 0 ) {
			EngineCore.outputText( '  Your [balls] tense with the anticipation of releasing the fruit of your loins into her waiting womb.' );
		}
		EngineCore.outputText( '  With both hands you reach up and grab the fat nipples of the witch\'s lower breasts, tugging on them like reins as you try to thrust deeper.  "<i>Ung! Ah!</i>" The witch bites her lower lip in pleasure and pain as you roughly handle her leaking teats.' );
		//{if player has huge or massive breasts} ;
		if( CoC.getInstance().player.biggestTitSize() >= 15 ) {
			EngineCore.outputText( '  The weight of your own tits bears heavily against your arms as you try to keep the motion of your hips constant while pulling on your lover\'s milk knobs.' );
		}//{if player's tits can lactate};
		else {
			EngineCore.outputText( '  Each of your [nipples] begin spraying milk over the witch as your body begins its crescendo.' );
		}

		EngineCore.outputText( '\n\nThe surge begins slowly.  You feel your cum pooling in your lower extremities before rising up within you to fill the base of your shaft' );
		if( CoC.getInstance().player.cockTotal() > 1 ) {
			EngineCore.outputText( 's' );
		}
		EngineCore.outputText( '.  The girl squeals as she feels you thicken within her, on the verge of releasing your torrent.  Her hands claw at the floor as if seeking any foundation to ground her senses, but it is to no avail as your bounty of cum explodes within her.' );
		//{if player produces cumNormal or cumMedium};
		if( CoC.getInstance().player.cumQ() < 500 ) {
			EngineCore.outputText( '\n\nYou feel your shaft' );
			if( multi ) {
				EngineCore.outputText( 's' );
			}
			EngineCore.outputText( ' pressing against the girl\'s abused cervix, pumping load after load into her empty womb.  Her moans become non-sensical words as she feels your baby gravy pouring into her oven.  Tears of bliss form in the corner of her eyes and roll down her cheeks as confidence fills her that she\'ll soon be carrying two full wombs.' );
		}
		//{else if player produces cumHigh};
		else if( CoC.getInstance().player.cumQ() < 1500 ) {
			EngineCore.outputText( '\n\n"<i>I-I-I f-feeel it!</i>" she cries out loud as a river of sperm fills her.  The tight grip her vaginal walls have on you forces all the cum to stream straight through her cervix and into her womb.  Her belly lightly paunches out as your ample supply of baby gravy fills her like a balloon.  With that much cum it seems doubtful that she won\'t be carrying a new child soon.' );
		}//{else if player produces cumVeryHigh};
		else if( CoC.getInstance().player.cumQ() < 5000 ) {
			EngineCore.outputText( '\n\nTears of joy roll down the cheeks of the heavily hormonal witch as your loins begin blasting forceful loads of sperm deep into her body.  The tight grip of her cunt on your cock forces over a liter of your sperm directly into her empty womb.  "<i>T-t-too much!</i>"  She cries out in orgiastic insanity as her already swollen belly grows to even more immense proportions.  With her second womb overfilled with sperm, her abdomen now looks as if she was already pregnant with a second child.  Despite her fearful exclamations her legs attempt to keep you within her in hopes of having her womb swallow even more baby batter.' );
		}//{else if player produces cumExtreme};
		else {
			EngineCore.outputText( '\n\nHer head shakes back and forth as her brain fails to process the intense pleasure of having a torrential flood of sperm pumped into her.  Her cervix fails utterly to slow the flow as liters of sperm gush like a flood from a broken dam into her.  In seconds her second womb swells to match the size of her already full term first womb.  Stretch marks appear along her belly\'s side as loads of baby batter continue to fill her. The odd positioning of her wombs forces each one to have its own distinct bulge, as if she was hiding two small boulders in her gut.  She screams in brainless bliss as her body becomes so thoroughly over pumped.' );
		}

		//{if player has pussy};
		if( CoC.getInstance().player.hasVagina() ) {
			EngineCore.outputText( '\n\nYour own vagina tenses in pleasure and you feel your clit throbbing hotly.  It\'s a shame there isn\'t a cock to fill you as you pump this horny pregger full of cum.' );
			//{if player is a squirter};
			if( CoC.getInstance().player.wetness() >= 4 ) {
				EngineCore.outputText( '  Gobs of pussy juice splash against yours and the witch\'s legs as your orgasm forces your cunt to squirt over and over again.' );
			}
			if( CoC.getInstance().player.balls > 0 ) {
				EngineCore.outputText( '  Your [sack] is soaking wet by the time your pussy finishes cumming.' );
			}
		}
		//{if player has cumNormal, Medium, or High};
		if( CoC.getInstance().player.cumQ() < 1500 ) {
			EngineCore.outputText( '\n\nYou allow your softening loins to slide out of her gash.  A small stream of white juices follow from between her labia.  The poor witch runs her hands over the bulky expanses of her belly and tits as the sexual afterglow sends her through a hazy euphoria.' );
		}//{else if player has cumVeryHigh or cumExtreme};
		else {
			EngineCore.outputText( '\n\nCarefully you pull out, even as your shaft' );
			if( CoC.getInstance().player.cockTotal() > 1 ) {
				EngineCore.outputText( 's' );
			}
			EngineCore.outputText( ' continue' );
			if( CoC.getInstance().player.cockTotal() === 1 ) {
				EngineCore.outputText( 's' );
			}
			EngineCore.outputText( ' to release loads of cum.  Ropes of your white jizz splash over the witch\'s bare belly and naked breasts.  With both hands you stroke your ' + Descriptors.cockDescript( x ) + ' until it has soaked the tanned beauty from head to foot in your cum.  The other witches quickly set upon the exhausted girl, licking the cum from her breasts and scooping it out of her various valleys of cleavage to slop against their own pussies in the desperate hope of seeding their own extra wombs.' );
		}
		CoC.getInstance().player.orgasm();
		EngineCore.dynStats( 'sen', -2 );
		EngineCore.doNext( EventParser.playerMenu );
	};
	// FUCK TWO AT ONCE;
	DungeonSandWitch.prototype.fuckTwoPregWitches = function() {
		EngineCore.clearOutput();
		var x = CoC.getInstance().player.cockThatFits( 50 );
		var y = CoC.getInstance().player.cockThatFits2( 50 );
		EngineCore.outputText( 'These hormonally overwrought witches are each little more than five huge fleshy orbs of tits and bellies, desperately crawling towards you on hands and knees as their stares fixate on your ' + Descriptors.cockDescript( y ) + '.  ' );
		//{if player has two long tentacle cocks} ;
		if( CoC.getInstance().player.tentacleCocks() >= 2 ) {
			EngineCore.outputText( 'Almost of their own accord your tentacle cocks lash out, wrapping around the arms of the two closest girls, lifting them to their knees only to roll them backwards and on to their sides with their backs to each other.  ' );
		} else {
			EngineCore.outputText( 'It takes little effort to grab the closest two witches and pull them up only to push them down again and on to their sides with their backs pressed against each other.  ' );
		}
		EngineCore.outputText( 'The two witches lay before you with their heaving breasts and bellies jutting out to either side while their asses are mashed against each other.  You grab an ankle from each of them and raise their legs up to expose the dual pairs of pussies that they possess.' );
		//{for non-serpent lower body};
		if( !CoC.getInstance().player.isNaga() ) {
			EngineCore.outputText( 'You straddle ' );
		} else {
			EngineCore.outputText( 'You entwine your serpentine tail around ' );
		}
		EngineCore.outputText( 'their two legs that remain on the floor while allowing their raised legs to ' );
		if( CoC.getInstance().player.biggestTitSize() >= 15 ) {
			EngineCore.outputText( 'slide between your cleavage' );
		}//{for small or non-breasted characters};
		else {
			EngineCore.outputText( 'rest against your torso and shoulders' );
		}
		EngineCore.outputText( '.' );
		if( CoC.getInstance().player.pregnancyIncubation > 0 && CoC.getInstance().player.pregnancyIncubation < 200 ) {
			EngineCore.outputText( '  Each of these raised legs carefully bend at the knee to accomodate your own pregnant belly that looms over their prone figures.' );
		}
		EngineCore.outputText( '  As each witch lays on her side both of them begin feeling your stiff cocks slap against their multiple pussies.  They moan as their four pairs of labia bloom in anticipation of the fucking to come.  Each set of nether lips are dark and dripping with gobs of desperation, but on each girl there\'s one set that looks particularly gaping as if the pressure inside was forcing it open.  It isn\'t difficult to figure out that those are the ones that lead to their already occupied wombs, while the other sets are the ones eagerly awaiting a fresh deposit of baby batter.' );
		EngineCore.outputText( '\n\nYou feel supremely ready to fulfill those cum craving needs and you carefully align your cocks for the purpose.' );
		//{if has two horse cocks} ;
		if( CoC.getInstance().player.cocks[ x ].cockType === CockTypesEnum.HORSE && CoC.getInstance().player.cocks[ y ].cockType === CockTypesEnum.HORSE ) {
			EngineCore.outputText( '  The wide flaring tips of your equine pricks press flatly against the pair of sweltering nether lips, but they easily part with only a little pressing.  The hot swollen folds eagerly slurp around the wide ridged crowns of your cock heads as you press against their vaginal entrances.  They\'re looser than most normal pussies, yet around such thick cock heads they nonetheless feel enjoyably tight.  With a slightly harsher shove forwards you easily impale both whorish witches.  Pleasured cries of shock escapes their lips as your horse-dongs bore through their depths.' );
		}
		//{else if two dog cocks} ;
		else if( CoC.getInstance().player.cocks[ x ].cockType === CockTypesEnum.DOG && CoC.getInstance().player.cocks[ y ].cockType === CockTypesEnum.DOG ) {
			EngineCore.outputText( '  Your canine pricks easily part the obscenely wet folds of the girls\' labia.  Each woman\'s juices drip down your smooth shafts as you begin pressing their pointed heads into their tight entrances, eliciting pleasured and desperate pleas for more from each of them.  A gentle thrust of your pelvis and both pussies become simultaneously impaled upon your doggy dicks, giving you complete control over the hormonal witches.' );
		}
		//{else if two tentacle cocks} ;
		else if( CoC.getInstance().player.cocks[ x ].cockType === CockTypesEnum.TENTACLE && CoC.getInstance().player.cocks[ y ].cockType === CockTypesEnum.TENTACLE ) {
			EngineCore.outputText( '  Your green tentacle formed cocks stiffen yet weave their ways around the various pussies in front of you.  Their dark fuchsia heads almost seem to have a mind of their own as they trace the outlines of each pussy, teasing the poor hormonal witches into even higher states of sexual desperation. Pussy juice squirts from the anxious cunts with each teasing slide along their labia.  Satisfied with the pleasured taunting your prehensile cocks get down to business, darting into each slutty snatch like snakes striking at prey.  You feel each girl\'s entrance brutally stretch to accommodate your shafts as they deeply worm a path into each girl\'s vaginal orifice, causing both to scream in frantic bliss.' );
		}
		//{else if two demon dicks};
		else if( CoC.getInstance().player.cocks[ x ].cockType === CockTypesEnum.DEMON && CoC.getInstance().player.cocks[ y ].cockType === CockTypesEnum.DEMON ) {
			EngineCore.outputText( '\n\nThe big bumps and nodules that line the rims of each of your demonic cockheads feel particularly wonderful as they force their way between the dark, swollen folds of each witch\'s as yet unseeded pussy.  Both girls whimper and yelp in pleasure as the demonic ridges and soft protrusions along your shafts tease and taunt the erogenous zones of the inner walls of their cunts.  Your blighted cocks seem to swell even larger specifically to ensure the tightest fit possible within these two girls and it isn\'t long before each girl is leaking copious amounts of pussy juice around each cock as the highly textured shafts double time the twin twats.' );
		}
		//{else all other cocks and combinations};
		else {
			EngineCore.outputText( '\n\nYou press a cock-head against each wet pair of swollen labia, separating the dark folds as your pricks seek the entrances within.  A slurping sensation spreads over each head as your dicks achieve their goal; spearing the respective entrances of these hormonally overwrought sluts.  Your shafts effortlessly slide in to the wanton pussies, forcing each whorish witch to blissfully cry out from the pleasure they\'ve been so desperately seeking.  Their inner walls clamp around each of your shafts as the muscles in their bodies tremble from the sensations.' );
		}
		//{if player has 4+ cocks};
		if( CoC.getInstance().player.cockTotal() >= 4 ) {
			EngineCore.outputText( '  Eyeing their puckered little assholes squashed in between the asses that are already pushed against each other, you align two other cocks, neatly allowing precum to lube their tight holes, and begin pushing your extra dongs into their backdoors.  One girl bites her lip from the tight fit while the other yelps as if she\'s experienced it before.' );
		}
		EngineCore.outputText( '\n\nWith yourself so nicely embedded within the doubly busty pair of pregnant sluts you begin to fuck in earnest.  Easy tilting of your hips allows your shafts to thrust with ease repeatedly into the wet and dripping pair of cunts.  Each girl\'s juices drip down your shafts and wet your thighs as you fuck them progressively deeper.' );
		//{if cocks > 12 inches and < 20 inches};
		if( CoC.getInstance().player.cocks[ x ].cockLength < 20 && CoC.getInstance().player.cocks[ y ].cockLength < 20 ) {
			EngineCore.outputText( '\n\nFinally, you penetrate them far enough to feel the thresholds of their wombs pressing back against your throbbing cock heads.  Each girl cries out in exquisite pain as you pound against their cervixes, yet both protest if you pull back.  Giving in to their needs you fuck and thrust away as hard as you can, and it isn\'t long until your shafts are tingling with the sensations of imminent release.' );
		}
		//{if cocks >= 20} ;
		else {
			EngineCore.outputText( '\n\nWith one thrust at a time you slowly delve inch by strangled inch deeper into the tight tunnels of each girl\'s womanhood.  You eventually manage to brush up against the deep and tight entrances to each one\'s womb, and both cry out in pleasured pain as you pound against their inner thresholds.  With plenty of length to spare, your cocks fill each cunt\'s passage completely, and the witches\' begging pleas for more despite the momentary jolts of pain leaves you no choice but to try to ram yourself into their actual wombs.  Leaning forward with their upright legs pressed tightly against your torso, you place more of your body weight behind each cock.  The girls cry out in joyous agony as they each feel their cervixes stretch and both wombs become impaled.  Their bodies suck in more cock than any normal woman ever could, allowing you to use their abdomens as living cock sleeves to fuck.  With such an opportunity you eagerly begin doing just that, thrusting repeatedly into their wombs.  Their cervixes feel like a second pussy within their first, and it isn\'t long before [eachCock] feels on the verge of climax.' );
		}

		EngineCore.outputText( '\n\nThe eight milk-filled breasts of the two preggo sluts wobble lewdly as each witch\'s body shakes from your thrusting.  Milk spurting nipples plaster the floor with their cream.' );
		//{if player lactates};
		if( CoC.getInstance().player.lactationQ() >= 200 ) {
			EngineCore.outputText( '  Your own breasts begin spraying down the two pregnant sluts with your own dairy fluids.' );
		}
		//{if player has large but not huge breasts} ;
		if( CoC.getInstance().player.biggestTitSize() >= 5 && CoC.getInstance().player.biggestTitSize() < 20 ) {
			EngineCore.outputText( '  Each thrust in to the eager cunts causes your breasts to bounce up and down.' );
		} else if( CoC.getInstance().player.biggestTitSize() >= 20 ) {
			EngineCore.outputText( '  Each thrust in to the eager cunts causes your massive breasts to sway back and forth, slapping against your own sides.' );
		}
		//{if player has six huge breasts};
		if( CoC.getInstance().player.bRows() >= 3 ) {
			if( CoC.getInstance().player.breastRows[ 2 ].breastRating >= 20 ) {
				EngineCore.outputText( '  Your lower beach ball sized breasts are large enough to rest on the floor to either side as you fuck, and both witches eventually lower the legs they\'ve had raised so as to hook them around your massive mammaries and hug your flesh even closer to their thighs.' );
			}
		}
		if( CoC.getInstance().player.balls > 0 ) {
			EngineCore.outputText( '  The closer your shafts come to their climax the more tense your balls become, preparing to pump their loads through your cocks.' );
		}

		EngineCore.outputText( '\n\nEvery other witch in the room is fingering herself off as they watch you recklessly pound their sisters.  Finally ready, you decide to let them see what they\'re missing as you plunge your cocks as deep as they\'ll go, and finally cum your brains out.  Your shafts swell as your seed surges upwards from their bases towards the tips that you\'ve buried so expertly inside the milky whores.' );
		//{if cumNormal or Medium} ;
		if( CoC.getInstance().player.cumQ() < 500 ) {
			EngineCore.outputText( '  The pair of girls yelp as they feel the hot seed splash forth inside them.  Millions of sperm swim in to their fertile wombs, seeking to turn them into doubly pregnant sluts.' );
		}//{else if cumHigh};
		else if( CoC.getInstance().player.cumQ() < 1000 ) {
			EngineCore.outputText( '  The slutty pair of milk bags cry out in sensual surprise as they feel extraordinary amounts of cum pumping directly into their baby makers, knocking them up with the double pregnancy they\'ve desperately wanted. Their bellies bulge with all of the cum you\'ve deposited within them.' );
		}//{else if cumVeryHigh} ;
		else if( CoC.getInstance().player.cumQ() < 3000 ) {
			EngineCore.outputText( '  The two piles of tits and bellies scream in pleasured insanity as their empty wombs are assaulted with a surging torrent of jizz.  You can feel the heavy blasts of cum surging within your shafts as they flood forth in to slutty orifices that have swallowed your manhoods.  Your brain burns with ecstasy as your genitals pump each womb over and over again, forcing them to swell far beyond what they\'re intended to take from cum alone.  By the time your cocks feel satisfied each witch looks as if she\'s already full term with a second child, the cum filled womb creating a distinct second orb next to the first pregnancy.' );
		}//{else if cumExtreme};
		else {
			EngineCore.outputText( '  The eyes of every witch in the room open wide in shock as they watch their sister\'s bellies swell obscenely.  Your cocks feel as if they\'re trying to wrest control of your body from you as liters of hot sperm pump forcefully directly in to the extra fertile wombs of each slutty witch.  The two quad-breasted whores convulse in brain damaging pleasure, causing their huge milk filled tits to quake and bounce everywhere. A white flood of ejaculate erupts from their pussies around your cocks as their overfilled wombs fail to contain your bounty of baby batter.' );
		}
		//{if player has 4+ cocks ie; did anal};
		if( CoC.getInstance().player.cockTotal() >= 4 ) {
			EngineCore.outputText( '  Streams of cum drip from their abused anuses as you finish them off.' );
		}
		//{if cumNormal through cumHigh};
		if( CoC.getInstance().player.cumQ() < 1000 ) {
			//{non-snake body};
			if( !CoC.getInstance().player.isNaga() ) {
				EngineCore.outputText( '\n\nOn weakened legs ' );
			}//{serpent body};
			else {
				EngineCore.outputText( '\n\nWith your weakend snake body ' );
			}
			EngineCore.outputText( 'you push yourself up, allowing your cocks to slide out of the cum thirsty cunts of the pregnant witches.  Spilt jizz plasters their legs and pussies, leaving them looking as if they\'ve just been fucked by several men instead of one.  Their sisters mew with disappointed eyes that it was not their pussies you chose to seed, but there\'s nothing for it.  Perhaps you\'ll return soon to tend to their breeding addictions once you\'ve handled more important business.' );
		}
		//{if cumVeryHigh through cumExtreme};
		else {
			EngineCore.outputText( '\n\nThe excessive quantities of cum allow you to easily slide your shafts out of the wanton holes.  A pool of your jizz surrounds your [feet] and the legs of the witches.  Several sensitive strokes of your cocks allow you to blast a few more loads across the two piles of tits that call themselves witches.  The splashes of cum thoroughly soak them, and the rest of the pregnant horny sand witches descend upon the two girls, licking and scrapping at the coatings of cum in the desperate hopes that they might be able to scoop some into their own secondary, empty wombs.  The horde of quad-breasted pregger witches proceeds to wrestle with each other in a pile of tits and cum.' );
		}
		CoC.getInstance().player.orgasm();
		EngineCore.dynStats( 'sen', -2 );
		EngineCore.doNext( EventParser.playerMenu );
	};
	//~ FUCK EM ALL;
	DungeonSandWitch.prototype.fuckAllThePregWitches = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'The witches crawl forwards with their bellies and double rows of milk filled tits impeding their movements. Despite their glistening tanned bodies and highly toned legs they still amount to little more than lewd piles of fleshy orbs, each one with double pairs of cunts including ones insatiably starving for cum to fill their empty second wombs. Each of their light brown and sweaty bodies looks equally appetizing, and as [eachCock] slowly engorges it becomes clear that if you\'re going to fuck any of them then you\'re going have to fuck all of them.  Anything less than knocking up all of the witches simply won\'t do.  By the time you\'re done with them, half of the next generation of sand witches will call you \'father\'.' );
		EngineCore.outputText( '\n\nAs [eachCock] starts rising in to the air, it isn\'t difficult to make your way behind the slow moving witches and encourage them to raise their dual pussies in to the air.  Each of their torsos are heavily weighted down to the ground, but this aids in their tilting their pelvises to ensure their dripping pussies are properly displayed between their toned thighs.  Two pairs of dark and swollen labia present themselves to you on each witch, and you can easily see how one pair of nether lips are gaping wide from the pressure built up in the womb it leads to.  The other pair is just as swollen but seems to be dripping pussy juices with greater desire as it thirsts to fill its empty womb with seed.  The rivers of pussy juice keep the thighs and undersides of the pregnant bellies on each of these whores incredibly wet and slick.' );
		var multi = false;
		//{if player has a single cock} ;
		if( CoC.getInstance().player.cockTotal() === 1 || CoC.getInstance().player.cockThatFits2( 50 ) < 0 ) {
			EngineCore.outputText( '\n\nWasting no time you move forwards to slide the shaft of your [cock] up and down the folds of the nearest witch\'s labia to lube it up.  She moans in frustrated pleasure, anxious to feel the length of your manhood pushing directly into those folds.  As you feel the crown of your cock head sliding along the lips of her cunt you decide not to tease her for the sake of your own pleasure.  With fingers from each hand you pull her nethers aside and press your cock directly into her entrance, feeling the tight orifice stretch around your man-flesh and swallow your cock as deeply as it can.' );
		}
		//else if player has two long cocks};
		else if( CoC.getInstance().player.cockThatFits2( 50 ) >= 0 && CoC.getInstance().player.cockTotal() < 3 ) {
			EngineCore.outputText( '\n\nAs you walk forwards you push two of the witches together, side by side, with their asses up in the air and their pairs of pussies facing you as your cocks press up against the nethers leading to their empty wombs.  Their dark cunts part and swallow up your shafts as you press forward, eliciting cries of pleasure from the whorish witches and forcing gobs of girl cum to drip down your cocks from their sexually charged holes.' );
			multi = true;
		}
		//{else if player has three long cocks} ;
		else {
			EngineCore.outputText( '\n\nYou gather three of the bent over witches together with their asses pressed tightly side by side, close enough for their sopping wet cunts to be in reach for three long cocks to fuck at once.  With your stiffening shafts growing harder with each passing moment you begin grabbing your pricks and angling them into the flush dark cunts.  As soon as you feel the entrances of each witch\'s pussy pressing against your cock heads you begin pressing forwards.  All three of them cry out as your shafts spear their cunts and fill their depths at the same time.  Their inner muscles contract and grip your cocks, almost as if they were trying to suck your bundle of shafts even deeper in to their whorish pregnant bodies.' );
			multi = true;
		}
		EngineCore.outputText( '\n\nWith your shaft' );
		if( multi ) {
			EngineCore.outputText( 's' );
		}
		EngineCore.outputText( ' thoroughly swallowed up by the juicy confines of the witch' );
		if( multi ) {
			EngineCore.outputText( 'es' );
		}
		EngineCore.outputText( ', you begin rocking your hips to and fro, sliding yourself in and out of ' );
		if( !multi ) {
			EngineCore.outputText( 'her' );
		} else {
			EngineCore.outputText( 'their' );
		}
		EngineCore.outputText( ' velvety wet depths.  ' );
		if( !multi ) {
			EngineCore.outputText( 'Her' );
		} else {
			EngineCore.outputText( 'Their' );
		}
		EngineCore.outputText( ' blissful cries of pleasure fill the room, joined with a chorus of slurping sounds as you thrust your sensitive shafts ever deeper and harder.  ' );
		if( !multi ) {
			EngineCore.outputText( 'Her' );
		} else {
			EngineCore.outputText( 'Their' );
		}
		EngineCore.outputText( ' quadruple breasts jiggle and bounce along the floor and ' );
		if( !multi ) {
			EngineCore.outputText( 'her' );
		} else {
			EngineCore.outputText( 'their' );
		}
		EngineCore.outputText( ' pregnant ' );
		if( !multi ) {
			EngineCore.outputText( 'belly sways' );
		} else {
			EngineCore.outputText( 'bellies sway' );
		}
		EngineCore.outputText( ' with each ramming motion of your cock' );
		if( multi ) {
			EngineCore.outputText( 's' );
		}
		EngineCore.outputText( '.  The muscles in ' );
		if( !multi ) {
			EngineCore.outputText( 'her' );
		} else {
			EngineCore.outputText( 'their' );
		}
		EngineCore.outputText( ' thighs and calves tense with pleasure as you push ' );
		if( !multi ) {
			EngineCore.outputText( 'her body' );
		} else {
			EngineCore.outputText( 'their bodies' );
		}
		EngineCore.outputText( ' to the limit.' );
		//{if player has non-huge tits};
		if( CoC.getInstance().player.biggestTitSize() > 3 && CoC.getInstance().player.biggestTitSize() < 10 ) {
			EngineCore.outputText( '  Your tits bounce as you enthusiastically grind away.' );
		}//{else if player has huge tits};
		else if( CoC.getInstance().player.biggestTitSize() >= 10 && CoC.getInstance().player.biggestTitSize() < 20 ) {
			EngineCore.outputText( '  The heavy weight of your huge tits causes them to sway with every thrust of your hips.' );
		}//{if player has really huge tits} ;
		else if( CoC.getInstance().player.biggestTitSize() >= 20 ) {
			EngineCore.outputText( '  The immense swells of your mammaries press down upon the ass of the girl in front of you.' );
		}
		//{if player has four non-huge tits} ;
		if( CoC.getInstance().player.bRows() >= 2 ) {
			if( CoC.getInstance().player.breastRows[ 1 ].breastRating >= 3 ) {
				EngineCore.outputText( '  Your second row of breasts slap against the ass cheeks of the girl in front of you.' );
			}
		}
		//{if player has six huge but not really huge tits} ;
		if( CoC.getInstance().player.bRows() >= 3 ) {
			if( CoC.getInstance().player.breastRows[ 2 ].breastRating >= 3 && CoC.getInstance().player.breastRows[ 2 ].breastRating < 20 ) {
				EngineCore.outputText( '  Your lowermost row of breasts become squashed against the witch' );
				if( multi ) {
					EngineCore.outputText( 's' );
				}
				EngineCore.outputText( '\'s muscular thighs.' );
			} else if( CoC.getInstance().player.breastRows[ 2 ].breastRating >= 20 ) {
				EngineCore.outputText( '  Your lowermost row of breasts come to rest on the floor as you lean forwards to fuck, and the witch' );
				if( multi ) {
					EngineCore.outputText( 'es' );
				}
				EngineCore.outputText( ' can almost support ' );
				if( multi ) {
					EngineCore.outputText( 'their' );
				} else {
					EngineCore.outputText( 'her' );
				}
				EngineCore.outputText( ' thighs against your obscene mammaries when they lean back against the constant ramming of your cock.' );
			}
		}
		//{if player lactates};
		if( CoC.getInstance().player.lactationQ() >= 200 ) {
			EngineCore.outputText( '  After only a short while of mindless rutting your tits begin leaking, and in short order your glistening nipples start spraying your milk over ' );
			if( !multi ) {
				EngineCore.outputText( 'the witch\'s tanned backside' );
			} else {
				EngineCore.outputText( 'the collective tanned bodies you\'re impaling' );
			}
			EngineCore.outputText( '.  A few other witches in the room eagerly step forth to suckle your [nipples] as they await their turn for impregnating.' );
		}
		EngineCore.outputText( '\n\nThe cum inside your loins starts to move, filling the base of your shaft' );
		if( multi ) {
			EngineCore.outputText( 's' );
		}
		EngineCore.outputText( ' as you feel your orgasm creep up inside you.  The sucking sensations of the ' );
		if( !multi ) {
			EngineCore.outputText( 'girl\'s cunt on your cock' );
		} else {
			EngineCore.outputText( 'the girls\' cunts on your cocks' );
		}
		EngineCore.outputText( ' starts to become overwhelming, and before you realize it you\'re on the verge of releasing your seed.  The ' );
		if( !multi ) {
			EngineCore.outputText( 'pussy' );
		} else {
			EngineCore.outputText( 'pussies' );
		}
		EngineCore.outputText( ' you\'re pounding seem' );
		if( !multi ) {
			EngineCore.outputText( 's' );
		}
		EngineCore.outputText( ' to sense the imminent release of the sperm ' );
		if( !multi ) {
			EngineCore.outputText( 'it craves' );
		} else {
			EngineCore.outputText( 'they crave' );
		}
		EngineCore.outputText( ' and strong contractions begin sucking on your shaft' );
		if( multi ) {
			EngineCore.outputText( 's' );
		}
		EngineCore.outputText( ' even more fervently.  You can\'t help but give ' );
		if( !multi ) {
			EngineCore.outputText( 'it the load of baby batter it craves' );
		} else {
			EngineCore.outputText( 'them the loads of baby batter they crave' );
		}
		EngineCore.outputText( '.' );
		EngineCore.outputText( '\n\nThe ' );
		if( !multi ) {
			EngineCore.outputText( 'underside of your shaft swells' );
		} else {
			EngineCore.outputText( 'undersides of your shafts swell' );
		}
		EngineCore.outputText( ' as your bounty of man-seed floods your full length and stretches the ' );
		if( !multi ) {
			EngineCore.outputText( 'witch\'s cunt' );
		} else {
			EngineCore.outputText( 'witches\' cunts' );
		}
		EngineCore.outputText( ' even wider.  Pressing as far forwards as possible you align the ' );
		if( !multi ) {
			EngineCore.outputText( 'tip of your tool against her abused cervix' );
		} else {
			EngineCore.outputText( 'tips of your tools against their weakened cervixes' );
		}
		EngineCore.outputText( ' just as your cum begins erupting out of you.' );
		//{if cumNormal-cumHigh};
		if( CoC.getInstance().player.cumQ() < 1000 ) {
			EngineCore.outputText( '\n\nYou plaster the insides of ' );
			if( !multi ) {
				EngineCore.outputText( 'her pussy' );
			} else {
				EngineCore.outputText( 'their pussies' );
			}
			EngineCore.outputText( ' with no small amount squirting directly in to ' );
			if( !multi ) {
				EngineCore.outputText( 'her womb' );
			} else {
				EngineCore.outputText( 'their wombs' );
			}
			EngineCore.outputText( '.  When you finally pull out ' );
			if( !multi ) {
				EngineCore.outputText( 'a stream' );
			} else {
				EngineCore.outputText( 'streams' );
			}
			EngineCore.outputText( ' of cum are left behind.' );
		}
		//{else if cumVeryHigh-cumExtreme]};
		else {
			EngineCore.outputText( '\n\nThe horny ' );
			if( !multi ) {
				EngineCore.outputText( 'witch isn\'t' );
			} else {
				EngineCore.outputText( 'witches aren\'t' );
			}
			EngineCore.outputText( ' prepared for the deluge that explodes from your genitals.  Liter after liter pours forth, filling up ' );
			if( !multi ) {
				EngineCore.outputText( 'her empty womb like a balloon' );
			} else {
				EngineCore.outputText( 'their empty wombs like a bunch of balloons' );
			}
			EngineCore.outputText( ' and causing your eyes to roll back in your head from the sheer pleasured sensation of emptying yourself.  When ' );
			if( !multi ) {
				EngineCore.outputText( 'her belly' );
			} else {
				EngineCore.outputText( 'their bellies' );
			}
			EngineCore.outputText( ' swell as large as the neighboring pregnancies and stretch marks start appearing up and down each side you finally pull out and allow your cock' );
			if( multi ) {
				EngineCore.outputText( 's' );
			}
			EngineCore.outputText( ' to finish spraying ' );
			if( !multi ) {
				EngineCore.outputText( 'its' );
			} else {
				EngineCore.outputText( 'their' );
			}
			EngineCore.outputText( ' final loads over the ' );
			if( !multi ) {
				EngineCore.outputText( 'whorish witch\'s back' );
			} else {
				EngineCore.outputText( 'collective grouping of the witches\' asses' );
			}
			EngineCore.outputText( '.' );
		}
		//{all};
		if( !multi ) {
			EngineCore.outputText( '\n\nShe falls' );
		} else {
			EngineCore.outputText( '\n\nThey fall' );
		}
		EngineCore.outputText( ' over.  Quickly, the rest of the witches in the room are eagerly raising their cunts in the air, begging for their turn at being impregnated.  Happily you oblige, shoving as much cock as you can into each wet hole that the hormonally overwrought sluts offer to you.  One pussy after another finds itself impaled on you, with you thrusting repeatedly until the massaging muscles within their cunts pull forth the rivers of baby gravy that their empty wombs are starving for.  One by one the witches find themselves filled and fall to the floor still reeling from the sensations, only for another new witch to take their place with a sopping cunt even more cum thirsty than the last.' );
		//{if player has two or more cocks} ;
		if( CoC.getInstance().player.cockThatFits2( 50 ) >= 0 ) {
			EngineCore.outputText( '\n\nFor the final witch you choose to shove two cocks inside her empty pussy.  Your double dicked thrusts force a joyous yelp from her with every thrust.  "<i>Ah! T-t-too much!</i>" she screams but her vaginal canal refuses to let you go regardless.  When you finally finish the torrent of sperm makes her feel as if she\'s on the verge of bursting.  The swelling of her womb causes her belly to bloat up enough to push her quad breasts upwards and siginificantly shift her center of gravity.  The orgasm that accompanies the feeling of your sperm flooding forcefully into her uterus and tubes is too much for her to bear and she slides off of your cocks like a well used cock sleeve, oozing gobs of cum from between her dark nether lips.' );
		}
		EngineCore.outputText( '\n\nFinally finished, you stand in a pool of your own jizz and stare down at the piles of tits and bellies that allegedly are women but for all intent and purpose have become nothing more than sacks of flesh filled with milk, babies, and cum.  Each of them is covered in a layer of sweat and splooge, and small mewing cries of satisfied delight emanate from somewhere underneath those heavy orbs.  You can\'t help but wonder how long it\'ll take for them to give birth so that you can once again knock them up with the broods of children that their bodies are so obviously intended to produce.' );
		CoC.getInstance().player.orgasm();
		EngineCore.dynStats( 'sen', -3 );
		EngineCore.doNext( EventParser.playerMenu );
	};
	//*Sand Witch Milk Bath -McGirt;
	DungeonSandWitch.prototype.milkBathsAhoy = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'Well, you can probably squeeze in a quick bath.  You\'ve already dealt with the bulk of their number, and this area seems devoid of any more of them.  Your [armor] easily slides into a pile alongside of rounded, stone tub while the dusky titty-CoC.getInstance().monster looks on with anticipation.  Once nude, you hop down inside and say, "<i>Bath Time.</i>"' );
		EngineCore.outputText( '\n\nWith trembling anticipation, the black-skinned milk-slave reaches down for her teat-like nipples.  Her huge, plate-sized areola bead with white perspiration in anticipation, and the woman\'s hands nearly disappear into her chest-globes as she struggles to grasp her engorged nipples.  You drop the plug into the drain and look up.  Cooing in delight, the huge-breasted girl finally manages to get her shivering fingertips around each of her aching milk-spouts.  She massages her nipple-flesh for a moment, her eyes lidded and heavy from pleasure, and she releases the first heavy torrent of white into the tub.  Surprisingly, the fluid is thin and watery, less milk-like than you\'d think.  Whether the witches or the woman\'s physiology is to blame you cannot tell.  Her eyes are too vacant to give any clues, and her mouth is too busy making sighs of relief to speak.' );
		EngineCore.outputText( '\n\nPearly fluid quickly fills the first few inches of the tub, spouting as it is in numerous forking streams from its mocha spouts.  Dark-skinned hands massage the soft female flesh with smooth, unbroken motions, squeezing each teat from base to tip before retreating back to the bottom.  The steady back-and-forth motions cause the streams to rise and fall to the tempo, but the flow stays thick and steady enough to splatter your [hips] with white. You relax against one of the benches and idly trace your hands through the water, enjoying the feeling of the milk on your ' + CoC.getInstance().player.skinFurScales() + ' as it rises higher and higher.  Your only companion, the chocolate-skinned woman, continues to knead her engorged breasts as you watch, and you have to admit, you feel a sexual thrill sliding down your spine as you watch her heavy breasts work to fill your tub.' );
		EngineCore.outputText( '\n\nYou close your eyes and massage the stuff into your skin, feeling oddly serene and clean in spite of the heating of your loins.  Even as the cream flows over your ' );
		if( CoC.getInstance().player.hasCock() ) {
			EngineCore.outputText( CoC.getInstance().player.multiCockDescriptLight() );
		} else if( CoC.getInstance().player.hasVagina() ) {
			EngineCore.outputText( '[vagina]' );
		} else {
			EngineCore.outputText( '[butt]' );
		}
		EngineCore.outputText( ', you resist the urge to touch yourself in a sexual way and focus on what you wanted to do - bathe.  The milk-slave lets out a satisfied groan, her breasts finally reduced enough for her to easily reach her tit-tips at last, fingers tugging and squeezing to feed the ecstatic release she must be feeling.  Still, the mammoth milkers are more than large enough to keep her pinned beside the tub.  At this rate she\'ll likely remain immobile, even after you\'re neck-deep in her delightful fluids.' );
		EngineCore.outputText( '\n\nParting slightly, the ebony woman\'s puffy lips let her tongue loll out to dangle obscenely.  She looks... pleased - almost orgasmically so.  Her hands, once steadily pumping, are now stroking her nipples with feverish intensity, stopping from time to time to caress the great mass of her chest and squeeze even more milk out.  She shivers and shudders, filling the tub for you, obedient even to the whims of a complete stranger.  Her blissful expression grows more and more pleased with every passing second, and then with a shudder (just as the milk reaches your [chest]), she squeals and moans in ecstatic, body-shaking bliss, her muscles writhing, sending a titanic tremor through her now-jiggling jugs.  A huge spray of milk is released at the same time.  It rocks you back against the tub\'s wall and soaks your hair.  By the time it\'s over, the tub is full, and the delirious girl is panting happily.' );
		EngineCore.outputText( '\n\nThe milk-slave pulls back, licking her puffy lips smelling strongly of female arousal but obviously satisfied.  She whimpers, "<i>I love bath time,</i>" before starting to shift her breasts\' bulk back towards her corner.' );
		EngineCore.outputText( '  You could probably masturbate in the tub if you wanted to, or maybe pull the dusky milk-maid in for company....  What do you do?' );
		//{If can masturbate [Drink & Masturbate] [Milk Girl] [Relax]};
		//{otherwise [next] to relaxing};
		EngineCore.fatigue( -10 );
		EngineCore.menu();
		EngineCore.addButton( 0, 'Next', this.finishMilkBath );
		if( CoC.getInstance().player.gender > 0 ) {
			EngineCore.addButton( 1, 'DrinkNFap', this.drinkNFap );
		}
		EngineCore.addButton( 2, 'Milk Girl', this.grabTheMilkGirl );
	};
	//[Next] (Relax);
	DungeonSandWitch.prototype.finishMilkBath = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'You sit in the tub for a while, letting the fragrant fluids soak into your ' + CoC.getInstance().player.skinFurScales() + '.  Yet, you have work to do, and eventually, you tire of relaxing in the sand witches\' endless white bounty.  You pull out the tub\'s plug and climb out, finding a towel on the wall.  Thankfully, the milk doesn\'t seem to leave behind any residue, and you feel clean and refreshed, if a bit horny.' );
		//(+Lust, -Fatigue);
		EngineCore.dynStats( 'lus', 10 );
		EngineCore.fatigue( -50 );
		EngineCore.doNext( EventParser.playerMenu );
	};
	//[Milk Girl];
	DungeonSandWitch.prototype.grabTheMilkGirl = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'You call out to the milk slave before she can slink away, and wade over to the side of the tub, leaving your face a few scant inches from her massive, milk-laden jugs. She cocks her head to the side, obviously unused to the attention, and quietly whispers, "<i>' + CoC.getInstance().player.mf( 'M-master?', 'M-mistress?' ) + '</i>"' );
		EngineCore.outputText( '\n\nYou flash her a mischievous grin before grabbing a handful of her giant tits and pulling, yanking her into the tub with you. The milk-maid lets out a sharp cry of surprise as she tumbles in, a huge splash of cream spraying over the rim of the tub, painting the walls white. Gasping, her head pops back over the surface of her own milk, long ebony hair dripping onto the tops of her seemingly-buoyant teats, which bob over the milky waves with a strangely serene, regal grace.  "<i>' + CoC.getInstance().player.mf( 'M-master?', 'M-mistress?' ) + '</i>" the slave girl repeats, her lower lip quivering with fright as she wades through her own lactation, slowly retreating to the edge of the tub. Smiling, you reach out and stroke her cheek, telling her it\'s all right, that you thought she might like a bath, too. She starts to reply in her broken dialect, but you cut her off with a playful stroke of her massive mounds, urging her over toward you. Though still nervous, she does as you ask, sliding up under your arm and onto your lap. Once seated, she looks ups to you with saucer-like brown eyes until you cup her cheek and give her a short, tender kiss, pressing your lips to her dusky mounds. To your delight, she seems to melt at your touch, relaxing in an instant as you hold her as close as you can, seperated only by her prodigious chest' );
		if( CoC.getInstance().player.biggestTitSize() >= 8 ) {
			EngineCore.outputText( ', pressing deep into your own huge rack, your nipples flicking across her own leaky tits' );
		}
		EngineCore.outputText( '.' );
		EngineCore.outputText( '\n\n"<i>O-oh,</i>" she moans, just on the edge of hearing, her cheeks flushing hotly in your hand. The cute little slave turns aside, moving her udders out of the way so that she can rest her head on your chest, obviously enjoying the simple act of your arm around her shoulders and the odd gentle touch. You let her enjoy it for a few long, pleasurable minutes, content in the silent company of the milky girl. From time to time you gently stroke her cow-like teats, or reach down to rub her thick, rich milk into your loins, enjoying the incredible texture of it on your ' );
		if( CoC.getInstance().player.gender === 1 ) {
			EngineCore.outputText( '[cock]' );
		} else if( CoC.getInstance().player.gender === 2 ) {
			EngineCore.outputText( '[vagina]' );
		} else if( CoC.getInstance().player.gender === 3 ) {
			EngineCore.outputText( '[cock] and [vagina]' );
		} else {
			EngineCore.outputText( 'sexless crotch, still burning hotly with your desires' );
		}
		EngineCore.outputText( '.  After a time, though, you give the girl a gentle little push, having her rest her arms and tits on the edge of the pool.  You shift around behind her, cupping up handfuls of her milk.  You start to pour it down her back and shoulders, getting her nice and soaked in her own sweet cream before you close in, starting to massage her back, rubbing it in nice and slow until she\'s shivering quietly.  She moans under her breath as your fingers sink into her soft, yielding flesh, gently kneading her shoulders and hips, giving special attention to her full, round ass, tentatively slipping a few fingers around her leg to caress along her slick vulva and the bud of her clit.' );
		EngineCore.outputText( '\n\nShe tenses when you brush against her, ' );
		if( CoC.getInstance().player.cor < 70 ) {
			EngineCore.outputText( 'and you\'re quick to pull back, not wanting to force her, but to your surprise and delight, she reaches back and takes your hand in hers, moving you back to finger her' );
		}
		// if Corrupt> 70:;
		else {
			EngineCore.outputText( 'and grinning with lusty fervor, you push harder, slipping your fingers into her with ease, her milk providing the perfect lubricant to penetrate her.  The slave girl trembles at your sexual advance, but either does not want to stop you out of well-trained fear, or just doesn\'t want you to stop' );
		}
		EngineCore.outputText( '.  Before you can get too far, though, the slave girl turns on a heel, her huge rack pushing you back through the milky pool and then against the rim.  You\'re dazed for only a brief second before her breasts press firmly into your back, pressed so hard that a new streak of milk pours from her teats, wetting your back much as you did hers.  You relax against the rim as the slave cups up handfuls of milk, rubbing it into your own hair and shoulders, deft fingers massaging every muscle in your back with the skill of the greatest masseuses, and you can feel the tension bleeding from your muscles. You yawn powerfully, resting your chin on your arms and letting the milky girl massage you, coating your ' + CoC.getInstance().player.skinFurScales() + ' in her rich, delicious milk.' );
		//{If PC has a dick: ;
		if( CoC.getInstance().player.hasCock() ) {
			EngineCore.outputText( '\n\nOne of the milk girl\'s hands brushes against your thigh, slipping around your [leg]; slender fingers wrap around your [cock], milky lubricant making her soft strokes all the more pleasurable.  You groan in lusty delight as her fingers slide up and down your quickly-hardening length' );
			if( CoC.getInstance().player.balls > 0 ) {
				EngineCore.outputText( ', her other hand cupping your [balls], rolling the ' + Utils.num2Text( CoC.getInstance().player.balls ) + ' orbs in her palm with surprising dexterity' );
			}
			EngineCore.outputText( '.  Leaning over the two titanic teats between you, she traces a line of kisses down your back, licking up stray drops of milk between affectionate caresses.' );
		}
		//{If PC has cooch:;
		if( CoC.getInstance().player.hasVagina() ) {
			EngineCore.outputText( '\n\nHer hands shift downwards, delicate fingertips slipping across the slit of your [vagina]. You gasp, shivering as her milk-slick fingers easily slip into your sodden box, her thumb swirling gently around your [clit].  Her other hand traces upwards, carressing your [hips] and [butt] before finally arriving at your [chest], which she massages with well-practiced skill.' );
			if( CoC.getInstance().player.biggestTitSize() >= 1 ) {
				EngineCore.outputText( '  She cups your breasts, having to reach so far around both your rack and hers that she\'s straining her arms to rub your [nipples], but she does so valiantly, stroking them with her incredibly deft fingers.' );
			}
			if( CoC.getInstance().player.lactationQ() >= 200 ) {
				EngineCore.outputText( '  A spurt of milk escapes your own full jugs, joining the pool-full of your new friend\'s.  She gasps with surprise and delight, quickly nuzzling herself into your back and going to work, milking you just as she would herself, letting the hefty flow of your motherly fluids pour into the pool, odd trickles smearing down your chest, staining your chest as white as her own.' );
			}
		}
		//[Fuck Her](PC must have gender; if cooch, also C+ cups) [Don't];
		EngineCore.menu();
		EngineCore.dynStats( 'lus', 33, 'resisted', false );
		if( CoC.getInstance().player.hasCock() ) {
			EngineCore.addButton( 0, 'Dick Fuck', this.fuckMilkbabeWithPenor );
		}
		if( CoC.getInstance().player.hasVagina() && CoC.getInstance().player.biggestTitSize() >= 3 ) {
			EngineCore.addButton( 1, 'Lady Fuck', this.ladyFucks );
		}
		EngineCore.addButton( 2, 'Don\'t Fuck', this.dontFuckMilkBathBabe );
	};
	//[Don't];
	DungeonSandWitch.prototype.dontFuckMilkBathBabe = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'You allow the girl to continue for a long, long while until your entire body feels deeply refreshed, her milk having soaked into your body and making you feel fresh and revitalized. You start to thank the milk girl for the pleasurable company, but when you open your mouth, she slips into your arms and presses her lips to yours.  Chuckling to yourself, you hold the girl as tight against yourself as her udders will allow, turning her to the side to let her nuzzle her cheek into your [chest], kissing the top of her head before the two of you climb from the pool.  You have to help her out, her massive extra weight nearly dragging her back in except for your quick reflexes.  You gather your [armor] and ruffle the milk slave\'s hair before turning back to the task at hand.' );
		//[+Lust, +HP, -Fatigue];
		EngineCore.HPChange( CoC.getInstance().player.maxHP() * 0.33, false );
		EngineCore.fatigue( -20 );
		EngineCore.doNext( EventParser.playerMenu );
	};
	//[Fuck Her] (PC has a Dick);
	DungeonSandWitch.prototype.fuckMilkbabeWithPenor = function() {
		EngineCore.clearOutput();
		var x = CoC.getInstance().player.cockThatFits( 50 );
		if( x < 0 ) {
			x = CoC.getInstance().player.smallestCockIndex();
		}
		EngineCore.outputText( 'You turn around and pull the milk-slut against you, her massive teats pressing hard against your [chest] until they spurt milk.  You stroke her cheeks, bringing her lips up to yours. Her hand finds your [cock] again, stroking you with mounting speed as your tongue finds its way into her mouth, your hands wandering down to grope her sizable ass and flared, breeder\'s hips.  Your milk maid sighs heavily, breath filled with lust as you push her up against the rim of the tub, her legs spreading wide for easy access to her milk-lubed cunt.  She locks her arms around your shoulder, moaning happily as you press into her, your ' + Descriptors.cockDescript( x ) + ' sliding easily into her sodden box.' );
		EngineCore.outputText( '\n\nSubmerged beneath a sea of creamy milk, it\'s so very, very easy to slide into the slave girl, ' );
		if( CoC.getInstance().player.cockArea( x ) < 30 ) {
			EngineCore.outputText( 'hilting her in one long stroke' );
		} else if( CoC.getInstance().player.cockArea( x ) < 50 ) {
			EngineCore.outputText( 'pushing your many inches into her until your hips join, her nice and loose cunt easily taking your length' );
		} else {
			EngineCore.outputText( 'your cock gaining as much entrance as your massive member can, the excess dickmeat embraced in cream between you' );
		}
		EngineCore.outputText( '.  With your prick buried in her, the milk slave hooks her legs around your [hips] and starts to rock her hips gently, letting you take the initiative. Smiling at the meek girl, you sink your fingers into milk-yielding titflesh and start to move your hips, thrusting into her with measured ease, letting milk flood into her channel and coat your dick to lubricate each and every motion.' );
		EngineCore.outputText( '\n\n"<i>S-so good, [Master],</i>" she moans, "<i>[Master] makes bath slut feel so great.  Oh!</i>"' );
		EngineCore.outputText( '\n\nYou pick up the pace, thrusting in harder and harder, sloshing waves of cream into the valley of her cleavage and right over the edge of the pool.  Your lover clings tightly to you, leaking milk and a clear trail of fem-lube from her cunt as you hammer into her.  Punctuating your thrusts, you lean in and press your lips to hers, silencing her ecstatic moaning with a drawn-out kiss.  When you break it, trails of spit and milk still connect her full, dusky lips to yours, her tongue slightly lolled from her mouth with sexual bliss.  Her entire body begins to shudder, massive chest heaving as she approaches the edge.  You let yourself go as she cums, and as her first orgasmic moans echo out, you roar with primal lust and join her, smearing her milk-slick cunt with a thick glob of semen, letting another and another join it, filling her womb with your potent seed.' );
		EngineCore.outputText( '\n\nYou allow the girl to continue for a long, long while, quivering with sexual release as you shudder out the last drops of your cum inside her. With a heavy sigh, you slump forward, burying your head into her prodigious bust to recover. You grin as the milk girl wraps her arms around you, holding you tight against herself.' );
		EngineCore.outputText( '\n\nYour entire body feels deeply refreshed, her milk having soaked into your body and making you feel fresh and revitalized, and every muscle seems to have relaxed thanks to your blissful coitus.  You start to thank the milk girl for the pleasurable company, but when you open your mouth, she presses her lips to yours for a long, tongue-filled kiss.  Chuckling to yourself, you hold the girl as tightly as her udders will allow, turning her to the side to let her nuzzle her cheek into your [chest], kissing the top of her head before the two of you climb from the pool.  You have to help her out, her massive extra weight nearly dragging her back in except for your quick reflexes.  You gather your [armor] and ruffle the milk slave\'s hair before turning back to the task at hand.' );
		//[+Lust, +HP, -Fatigue];
		CoC.getInstance().player.orgasm();
		EngineCore.fatigue( -15 );
		EngineCore.doNext( EventParser.playerMenu );
	};
	//[Fuck Her] (PC has Cooch & C+cups);
	DungeonSandWitch.prototype.ladyFucks = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'You turn around in the milky pool, pulling the cute little slave tight against you.  She gasps with surprise, but settles as soon as you press your lips to hers, your hands wandering across her huge teats and supple, milky body.  She nuzzles up against you, her head resting on your [chest] as you hold her against yourself, stroking her dark hair.  After a few moments of such a simple pleasure, the little slave girl shifts her cheek along your breast, wrapping her full, dusky lips around your [nipple].  You let out a long moan as she suckles gently' );
		if( CoC.getInstance().player.lactationQ() >= 200 ) {
			EngineCore.outputText( ', drawing out a trickle of milk from your motherly reserves.  She gulps deeply, smiling up at you as a trickle of your milk runs down her chin, dripping into the pool of her own' );
		}
		EngineCore.outputText( '.  Her hand slips up your body, brushing your vulva and [clit] before cupping your other breast, delicate fingers wrapping around your [nipple].  With deft, practiced motion, she works your teats between her fingers, working your breast like she might her own' );
		if( CoC.getInstance().player.lactationQ() >= 200 ) {
			EngineCore.outputText( ', milking you with skill beyond anything you\'ve ever experienced before; and why not, when her entire existence revolves around that self-same skill?' );
		} else {
			EngineCore.outputText( '.' );
		}

		EngineCore.outputText( '\n\nYou lean back against the rim, putting your arms up against the lip and letting the girl put her skills to use on you, your chest soon heaving and quivering to her every touch.  You barely notice as the girl\'s other hand vanishes beneath the milky waves, surely going to tend to herself as her tongue and fingers squeeze and caress your ' );
		if( CoC.getInstance().player.lactationQ() >= 200 ) {
			EngineCore.outputText( 'milky ' );
		}
		EngineCore.outputText( 'teats in the most incredible ways.  You moan and groan as she tweaks and massages, suckles and kisses your rock-hard peaks, sending electric shivers of pleasure through your chest until your entire body quivers.  Almost unconsciously you wrap your [legs] around the milky girl\'s waist, holding her tighter and tighter against your sodden body, forcing as much of your [nipple] into her so wonderfully skilled mouth as you can.' );
		EngineCore.outputText( '\n\nSoon, you can feel a strange pressure welling up through your tits.  It takes you a moment to recognize the boobgasm, but when it hits, you throw your head back in animalistic pleasure' );
		if( CoC.getInstance().player.lactationQ() >= 200 ) {
			EngineCore.outputText( ', spraying milk all over yourself and the milkmaid who caused your explosive pleasure' );
		}
		EngineCore.outputText( '.  You run your fingers through the girl\'s hair, urging her sexual skills on as your chest heaves and quavers, riding out the massive boobgasm as fem-cum spurts from your cunt and into the milky pool below.' );
		EngineCore.outputText( '\n\nYour entire body feels deeply refreshed, her milk having soaked into your body and making you feel fresh and revitalized, and every muscle seems to have relaxed thanks to your blissful coitus.  You start to thank the milk girl for the pleasurable company, but when you open your mouth, she presses her lips to yours for a long, tongue-filled kiss.  Chuckling to yourself, you hold the girl as tightly as her udders will allow, turning her to the side to let her nuzzle her cheek into your [chest], kissing the top of her head before the two of you climb from the pool.  You have to help her out, her massive extra weight nearly dragging her back in except for your quick reflexes.  You gather your [armor] and ruffle the milk slave\'s hair before turning back to the task at hand.' );
		//[+Lust, +HP, -Fatigue];
		CoC.getInstance().player.orgasm();
		EngineCore.fatigue( -15 );
		EngineCore.doNext( EventParser.playerMenu );
	};
	//[Drink & Masturbate];
	DungeonSandWitch.prototype.drinkNFap = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( '"<i>Wait,</i>" you call out to the ebony woman, letting the milk obscure your hands as you begin to masturbate, "<i>I want a drink.</i>"  Sheepishly, the milk slave obliging shifts to drag her tits back into place.' );
		EngineCore.outputText( '\n\nShe begs, "<i>Forgiveness please, [Master].  Bath slut would love to give you more milk.</i>"  She rolls her shoulders, sending an enticing jiggle through the milk-weighted fluid-factories on the edge of the tub, the sable flesh of her nipples blotted by fresh drops of white.  The milky morsels roll down the undercurve of the black slut\'s tits before dripping into the tub and sending tiny waves of cream through the tub.  Her well-used teat looks almost over-engorged by this point, puffy, swollen, and a little red, even through her coal-dark skin.  Thick streams of her alabaster nectar start to run from each of her nipple-tips as you lean closer, the anticipation already too much for the ever-full milk-machine of a woman.' );
		EngineCore.outputText( '\n\nTaking her nipple in, you give it an experimental lick.  It\'s sweet from the pearly fluid, but her skin tastes faintly of her body\'s salts as well, not unpleasantly.  You look down at the boob before you and realize that even with the milk-spout in your mouth, you\'ve only devoured a small portion of her teat.  The majority of her areola spreads out before you, nearly the size of a dinner plate but far more exciting.  After taking a few swallows of her body\'s watery treat, you reach down to your ' );
		if( CoC.getInstance().player.hasVagina() ) {
			EngineCore.outputText( '[vagina] and idly stroke your puffy, lust-engorged vulva' );
		} else {
			EngineCore.outputText( '[cock] and idly stroke the turgid mass' );
		}
		EngineCore.outputText( ', inadvertently drawing a lewd moan from yourself.  The fat nipple stuffed in your mouth does an adequate job of muffling your pleasurable vocalizations' );
		if( CoC.getInstance().player.hasCock() ) {
			EngineCore.outputText( ', but it does little to hide the swelling of [eachCock] - you have the milk for that' );
		}
		EngineCore.outputText( '.' );
		EngineCore.outputText( '\n\nAn excited moan worms out of the inky slave-girl\'s puffy lips, a testament to the raw sensitivity of her milk-bloated jugs.  As your tongue swirls over the leaky nozzle\'s pebbly skin, she releases another breathy pant of delight.  The vocal tremors seem to coo all the way down to your loins, joining with your fingers\' caresses to stir you to aching, trembling arousal.' );
		//{Fork, no new PG};
		//(DA HERMS) ;
		if( CoC.getInstance().player.gender === 3 ) {
			EngineCore.outputText( '  Your [cock] throbs painfully in your hand, so hot and hard that you\'re sure you must have begun to leak precum, but any fluid is swiftly washed away by the ever-present milk.' );
			if( CoC.getInstance().player.cockTotal() > 1 ) {
				EngineCore.outputText( '  You make sure to fondle each of your members equally, caressing, squeezing, and stroking to the tempo of your swelling passion.' );
			}
			EngineCore.outputText( '  With your off-hand, you rub your cream-lubricated fingers through your sodden gash, the flesh parting easily to allow a few of your questing fingers inside.  Delicious bliss unfolds from your [clit] as it pushes free of its hood, fully engorging, faintly throbbing from aching need.  You brush the button a few times before going back to fingering your box, yet you make sure to strum your thumb across your clit every few moments to keep yourself as close to peak as possible.  Truly, being a hermaphrodite is bliss.' );
		}
		//(DA SCHLICKS);
		else if( CoC.getInstance().player.gender === 2 ) {
			EngineCore.outputText( '  Your pussy juices mix freely with the tub\'s white-colored \'waters\', allowing your cream-lubed fingers to plunge into your [vagina] with ease.  You stroke your lips and caress the interior of your birth canal with the intimate familiarity of a skilled lover, playing with your body until you feel your control slipping, so wound up with lust that you feel like an over-tightened guitar string vibrating out of control.' );
		}
		//(DA DUDES);
		else {
			EngineCore.outputText( '  Your [cock] throbs painfully in your hand, so hot and hard that you\'re sure you must have begun to leak precum, but any fluid is swiftly washed away by the ever-present milk.  ' );
			if( CoC.getInstance().player.cockTotal() > 1 ) {
				EngineCore.outputText( 'You make sure to fondle each of your members equally, caressing, squeezing, and stroking to the tempo of your swelling passion.' );
			} else {
				EngineCore.outputText( '  With your offhand, you cradle your [sack], hefting your [balls] as you feel your desire churning to new levels.' );
			}
		}
		//(TOGETHER);
		EngineCore.outputText( '\n\nA spray of warmth impacts off your shoulders, and you turn into it, delighted to see the captive woman\'s other teat unloading yet another potent blast of silky goodness.  With a little regret, you pull off, earning a hair-drenching facial, and switch to the fountaining tit-tip in a heartbeat.  You work your throat to keep up with the flow, cheeks bulging from the pressure.  Ultimately, between your limited ingurgitating ability and the spiraling waves of pleasure rolling out from your groin, you fail to get all the milk down, and it sprays from the corners of your mouth while runnels of fluid leak down to your chin.' );
		EngineCore.outputText( '\n\nThe tub is dangerously full by this point, milk lapping at the edges like the tide coming in, and as you climax, you briefly wonder if perhaps, it has.  White-hot heat rockets through your middle, lazily climbing your spine to make an assault on your brain.  Your jaw locks, inadvertently biting down on the chocolate-toned nipple to momentarily staunch its flow.  Pistoning seemingly of their own volition, your [hips] sway back and forth, stirring up creamy waves that splash about the room, soaking the floor and your gear with milk.' );
		if( CoC.getInstance().player.hasCock() ) {
			EngineCore.outputText( '  [EachCock] releases its own gooey load, sputtering and spurting to add to the pearly deluge.' );
			if( CoC.getInstance().player.cumQ() >= 500 ) {
				EngineCore.outputText( '  With every torrent of seed you release, you can see it lift partway out of the tub, propelled by your incredible virility towards the nearest female specimen.' );
			}
			if( CoC.getInstance().player.cumQ() >= 3000 ) {
				EngineCore.outputText( '  Soon, the tub\'s fluid contents break out of their confines to stain your companion\'s dusky flesh white, an alabaster glaze that would entice you to further feats of debauchery were it not for the pleased contentment your maleness now radiates.' );
			}
		}
		if( CoC.getInstance().player.hasVagina() ) {
			EngineCore.outputText( '  Meanwhile, your juiced-up cunny feels like it\'s doing backflips inside you, contorting and squeezing as it gushes with fluid, feminine joy.  One brush on your [clit] knocks your [legs] out from underneath you, but thankfully, you float out the rest of your orgasm.' );
		}
		EngineCore.outputText( '\n\nA drawn out, low coo of contentment emanates from the other girl as you separate from her, and she bashfully whispers, "<i>Thank you,</i>" as she drags her gigantic tits over the puddly, milk-slicked floor.  Smirking and sexually sated, you pop the drain in the tub and stand there while the sex-scented lactic bathwater runs out the drain.  A quick toweling off later, and you\'re ready to go, feeling slightly refreshed and fairly sated.  It does take you a little longer to get your [armor] equally dry and back in place, but you manage.' );
		EngineCore.fatigue( -15 );
		CoC.getInstance().player.orgasm();
		EngineCore.dynStats( 'sen', -3 );
		EngineCore.doNext( EventParser.playerMenu );
	};
	/*336 === bigger belly
	 280 === prolly pregger
	 216 === unmistakable bulge
	 180 === obvious pregnancy
	 120 === impossible to conceal
	 72 === painfully distended
	 48 === bulges with unclean spawn..blahblahblah*/
	DungeonSandWitch.prototype.sandPregUpdate = function() {
		//1: ;
		if( CoC.getInstance().player.pregnancyIncubation === 336 ) {
			EngineCore.outputText( '\nYour breasts have felt unusually heavy recently, and a strange pulsing sensation occasionally emanates from them.  Your appetite is a little off; you could really go for some milk...\n' );
			return true;
		}
		//2:;
		if( CoC.getInstance().player.pregnancyIncubation === 280 ) {
			EngineCore.outputText( '\nYou\'ve been having strange dreams recently, about seeds growing before your eyes into beautiful flowers; what\'s really weird is the sense of pride and maternal contentment that seeing them bloom makes you feel.  Your breasts are definitely heavier than normal, and sometimes you wake up to find them damp; are you ' );
			if( CoC.getInstance().player.biggestLactation() < 1 ) {
				EngineCore.outputText( 'starting to lactate' );
			} else {
				EngineCore.outputText( 'lactating more' );
			}
			EngineCore.outputText( '?  Your belly is even bulging a little bit more than food can explain.\n' );
			_.forEach( _.filter( CoC.getInstance().player.breastRows, function( breastRow ) {
				return breastRow.breastRating < 1;
			} ), function( breastRow ) {
				breastRow.breastRating = 1;
			} );
			while( CoC.getInstance().player.biggestLactation() < 1.5 ) {
				CoC.getInstance().player.boostLactation( 0.5 );
			}
			return true;
		}
		//3:;
		if( CoC.getInstance().player.pregnancyIncubation === 216 ) {
			EngineCore.outputText( '\nYour breasts have definitely grown bigger, and they occasionally trickle milk.  More importantly than that, your stomach is bulging out in a small but unquestionable pot belly.  You\'re definitely pregnant.\n' );
			_.forEach( CoC.getInstance().player.breastRows, function( breastRow ) {
				if( breastRow.breastRating < 20 ) {
					breastRow.breastRating++;
				} else {
					breastRow.breastRating += 0.5;
				}
			} );
			while( CoC.getInstance().player.biggestLactation() < 1.5 ) {
				CoC.getInstance().player.boostLactation( 0.5 );
			}
			return true;
		}
		//4:;
		if( CoC.getInstance().player.pregnancyIncubation === 180 ) {
			EngineCore.outputText( '\nYour belly continues to grow, the hormones triggering your milk\'s production to kick it up a notch.  Your breasts are so heavy and sensitive, aching to be used to feed life-giving milk to something.\n' );
			while( CoC.getInstance().player.biggestLactation() < 2 ) {
				CoC.getInstance().player.boostLactation( 0.5 );
			}
			return true;
		}
		//5:;
		if( CoC.getInstance().player.pregnancyIncubation === 120 ) {
			EngineCore.outputText( '\nYou sometimes catch yourself humming to your unborn child, stroking your belly like a contented mother.  At other times, you catch yourself proudly stroking your swollen breasts, admiring the way it makes the milk spurt and flow.' );
			while( CoC.getInstance().player.biggestLactation() < 3 ) {
				CoC.getInstance().player.boostLactation( 0.5 );
			}
			return true;
		}
		//6:;
		if( CoC.getInstance().player.pregnancyIncubation === 72 ) {
			EngineCore.outputText( '\nMilk dribbles constantly out of your nipples now, in many ways being harder to deal with than the ever-increasing swell of your midriff.  The scent of milk hangs in the air around you constantly, giving you a craving to suckle almost as bad as your breasts\' need to be suckled from.\n' );
			while( CoC.getInstance().player.biggestLactation() < 4.5 ) {
				CoC.getInstance().player.boostLactation( 0.5 );
			}
			return true;
		}
		//7:;
		if( CoC.getInstance().player.pregnancyIncubation === 48 ) {
			EngineCore.outputText( '\nYour stomach hangs out, heavy and round as any full-term mother\'s back in Ingnam, your breasts feeling almost as taut and swollen, as if jealous of the life nearly grown inside your womb.  At morning, you find yourself milking your breasts until the cascading fluid ends up glazing your engorged stomach in a beautiful liquid white sheen, not that it seems to make much difference to your production.  You can only hope whatever\'s growing inside you will be hungry enough to keep up with all the food you\'ll have for it...' );
			while( CoC.getInstance().player.biggestLactation() < 5.5 ) {
				CoC.getInstance().player.boostLactation( 0.5 );
			}
			return true;
		}
		return false;
	};
	//*Witch Birth Scene:;
	DungeonSandWitch.prototype.birthAWitch = function() {
		EngineCore.outputText( '\n<b><u>Something amazing happens...</u></b>\n' );
		if( CoC.getInstance().player.vaginas.length === 0 ) {
			EngineCore.outputText( 'You feel a terrible pressure in your groin... then an incredible discomfort accompanied by the rending of flesh.  You look down and behold a vagina.  ', false );
			CoC.getInstance().player.createVagina();
			CoC.getInstance().player.genderCheck();
		}
		EngineCore.outputText( 'You moan in pain as a sudden sharp spike ripples through your distended midriff.  You clumsily haul yourself upright and waddle out into camp, collapsing as you hear your water break, soaking the dry earth of the wasteland below you.  Placing yourself in the most comfortable position you can manage, you grit your teeth and start to push...' );
		EngineCore.outputText( '\n\nYour world fades away to the demands of your body; the cycle of painful pushing and exhausted relaxation.  Time ceases to exist, but, finally, inevitably, your body thrusts its squalling intruder into the outside world.  You collapse, heaving in lungfuls of air, as the pain in your body fades away to a dull throbbing ache.  When you feel like you can move without breaking, you pick yourself up and investigate your howling, healthy offspring.' );
		EngineCore.outputText( '\n\nLying on the dusty ground, still slick with the fluids of the womb, is a healthy, beautiful baby girl, with sandy blonde fuzz on her head and olive-colored skin.  The twin sets of tiny little nipples on her chest and the two pussies are the only signs that she isn\'t strictly human.' );
		//Cum Witch: Lying on the dusty ground, still slick with the fluids of the womb, is a dark-skinned, healthy, beautiful-looking baby, human in virtually every detail.  At first, you wonder if you've given birth to a son, but looking closer reveals the pussy under her little cock and balls.);
		EngineCore.outputText( '\n\nSmiling with a sudden sense of maternal pride, you scoop the baby witch up and hold her to your breast.  She fusses and wriggles some, but soon calms down, cooing as she snuggles against your [chest].   Milk begins to leak from your [nipples], and like iron to a magnet your baby\'s lips are drawn to the sweet, creamy fluid.  Sparks of pleasure tingle through your breasts as your child nurses, and you can\'t resist a smile.  Gently you hold her, rocking her back and forth as she noisily suckles from you.' );
		EngineCore.outputText( '\n\nWhen she\'s finally done, you\'re surprised to see she hasn\'t grown at all - unless you count the big, round belly she contentedly strokes, a result of the sheer amount of milk the greedy little girl drank.  She starts to squirm and fuss as her greediness catches up to her, and you sling her over your shoulder and gently burp her, the sound echoing out over the wasteland.  As the baby settles in your arms and starts to fall asleep, you carefully gather some scrap cloth, to form a blanket for her, gather your things, and head off to the desert.' );
		EngineCore.outputText( '\n\nYou soon find your way to the hidden caves of the Sand Witches, where you present your new daughter to the nursery.  The sand witches there aren\'t too happy about the idea of looking after her themselves, insisting you should stay here with them and rear her yourself, but you are insistent that you cannot stay here and it\'s not safe to keep your daughter with you.  Finally, they give in and start fussing over your daughter, giving you the opportunity to quietly slip out and head back home.\n' );
		EngineCore.fatigue( 40 );
	};
	CoC.getInstance().registerScene( 'dungeonSandWitch', new DungeonSandWitch() );
} );