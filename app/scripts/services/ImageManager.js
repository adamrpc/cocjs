'use strict';

angular.module( 'cocjs' ).factory( 'ImageManager', function( $log ) {
	/**
	 * Possible images are the following :
	 * akbal-deepwoods-bigbuttanaled
	 * akbal-deepwoods-female-bindakbal
	 * akbal-deepwoods-female-highspeed
	 * akbal-deepwoods-female-highstrength
	 * akbal-deepwoods-female-naga-rapeakbal
	 * akbal-deepwoods-female-rapeakbal
	 * akbal-deepwoods-female-taur-bindakbal
	 * akbal-deepwoods-female-taur-rapeakbal
	 * akbal-deepwoods-forcedfemaleoral
	 * akbal-deepwoods-losslust-analed
	 * akbal-deepwoods-losslust-taur-analed
	 * akbal-deepwoods-male-akbalonback
	 * akbal-deepwoods-male-akbalonback2
	 * akbal-deepwoods-male-buttfuck
	 * akbal-deepwoods-male-buttfuck2
	 * akbal-deepwoods-male-highspeed
	 * akbal-deepwoods-male-highstrength
	 * akbal-deepwoods-male-hightoughness
	 * akbal-deepwoods-male-jojosex
	 * akbal-deepwoods-male-naga-rapeakbal
	 * akbal-deepwoods-male-rapeakbal
	 * akbal-deepwoods-male-taur-rapeakbal
	 * akbal-deepwoods-naga-forcedfemaleoral
	 * akbal-deepwoods-naga-sumbitanal
	 * akbal-deepwoods-sumbitanal
	 * akbal-deepwoods-taur-forcedfemaleoral
	 * akbal-deepwoods-taur-sumbitanal
	 * amily-forest-fuckpreg
	 * amily-forest-kissingfuck
	 * amily-forest-plainfuck
	 * amily-forest-reverse-cowgirl
	 * amily-forest-takecharge
	 * anemone-bj
	 * anemone-doggy
	 * anemone-egg
	 * anemone-female-fuck
	 * anemone-getanal
	 * anemone-kid-female-masti
	 * anemone-kid-female-sex
	 * anemone-kid-male-bj
	 * anemone-kid-male-masti
	 * anemone-kid-male-vagfuck
	 * anemone-male-fuck
	 * ants-desert-female-firstencounter
	 * ants-desert-male-firstencounter
	 * arianfemale-camp-dreamingArian
	 * arianfemale-home-docking
	 * arianfemale-home-doublepenetrate
	 * arianfemale-home-getArianAnal
	 * arianfemale-home-getbj
	 * arianfemale-home-getpenetrated
	 * arianfemale-home-giveArianAnal
	 * arianfemale-home-mutualmasturbation
	 * arianfemale-home-penetrate
	 * arianfemale-home-suckariandick
	 * arianmale-camp-dreamingArian
	 * arianmale-home-docking
	 * arianmale-home-getArianAnal
	 * arianmale-home-getbj
	 * arianmale-home-getpenetrated
	 * arianmale-home-giveArianAnal
	 * arianmale-home-mutualmasturbation
	 * arianmale-home-suckariandick
	 * brooke-first-meeting
	 * brooke-grope-her
	 * brooke-gym-female-getLaid
	 * brooke-gym-female-specialscene
	 * brooke-gym-female-tribadism
	 * brooke-gym-goDown
	 * brooke-gym-heckelbrooke3some
	 * brooke-gym-heckelbrookedominance
	 * brooke-gym-male-analbrooke
	 * brooke-gym-male-doubledicked
	 * brooke-gym-male-getLaid
	 * brooke-gym-male-penetratebrooke
	 * brooke-gym-male-specialscene
	 * camping
	 * cotton-first-fuck
	 * cotton-first-time-give-her-blowjob
	 * cotton-fucks-you
	 * cotton-giving-birth
	 * cotton-greeting
	 * cotton-shower-fuck-repeat
	 * cotton-shower-fucks-you-repeat
	 * cotton-tantric-sex
	 * cotton-visits-you-at-camp-drinks-all-your-milk-the-asshole
	 * cotton-yoga
	 * cotton-you-got-her-preggo
	 * dominika-first-meeting-at-bar
	 * dominika-gives-you-blowjob
	 * dominika-oral-sex
	 * edryn-bar-chat
	 * edryn-eat-her-out
	 * edryn-fuck-as-non-taur
	 * edryn-fuck-as-taur
	 * edryn-hel-threesome
	 * edryn-preggo-fuck
	 * ember-drink-her-milk
	 * ember-eat-out-her-vagoo
	 * ember-eats-your-vagoo-out
	 * ember-examine-appearance
	 * ember-fuck-her-in-her-buttz
	 * ember-fuck-her-in-the-vagoo-with-your-penor
	 * ember-fucks-your-ass
	 * ember-give-her-a-blowjob
	 * ember-gives-you-a-blowjob
	 * ember-sticks-her-penor-in-your-vagoo
	 * ember-visit-at-camp
	 * goblin-loss-female-bimbodildo
	 * goblin-loss-female-raped
	 * goblin-loss-male-raped
	 * goblin-win-drider-egged
	 * goblin-win-female-naga-rapedfem
	 * goblin-win-female-rapedfem
	 * goblin-win-female-taur-rapedfem
	 * goblin-win-male-buttsex
	 * goblin-win-male-corruptedbj
	 * goblin-win-male-corruptedfuck
	 * goblin-win-male-getridden
	 * goblin-win-male-goblinboners
	 * goblin-win-male-goblincondomed
	 * hel-chat-at-bar
	 * imp-egg
	 * imp-loss-female-fuck
	 * imp-loss-male-fuck
	 * imp-win-female-fuck
	 * imp-win-male-fuck
	 * implord-loss-female
	 * implord-loss-male
	 * implord-win-female-breastfeed
	 * implord-win-female-fuck
	 * implord-win-male-bj
	 * implord-win-male-fuck
	 * katherine-double-helix-fuck
	 * katherine-eats-out-your-vagoo
	 * katherine-examine-her-appearance
	 * katherine-fuck-and-suck
	 * katherine-fuck-her-bungholio
	 * katherine-fuck-her-vagoo
	 * katherine-fucks-you-knottily-in-all-the-holes
	 * katherine-fucks-you-knottily-in-the-bungholio
	 * katherine-fucks-you-knottily-in-the-vagoo
	 * katherine-give-her-blowjobs
	 * katherine-suck-and-fucks-you
	 * katherine-suckles-you
	 * katherine-visit-alley
	 * kelt-farm-eagerbj
	 * kelt-farm-female-inheat
	 * kelt-farm-naga-subkelt
	 * kelt-farm-reluctantbj
	 * kelt-farm-shamefulbj
	 * kelt-farm-smallbarn
	 * kelt-farm-subkelt
	 * loppe-comes-after-moar-orgasm-denial
	 * loppe-comes-after-orgasm-denial
	 * loppe-give-her-a-titty-fuck
	 * loppe-orgazm-denial
	 * loppe-rides-your-cock
	 * loppe-rides-your-cocks
	 * loppe-show-at-bar
	 * loppe-sticks-it-in-your-butt
	 * loppe-sticks-it-in-your-butt-you-centaur
	 * loppe-sticks-it-in-your-vagoo
	 * loppe-teaze-and-leave
	 * loppe-worships-your-cock
	 * lottie-encounter
	 * lottie-examine-appearance
	 * lottie-fuck-her-cowgirl-repeat
	 * lottie-fuck-her-doggie-style-repeat
	 * lottie-fuck-her-in-public-repeat
	 * lottie-fuck-her-in-teh-butzor
	 * lottie-fuck-her-threesome-repeat
	 * lottie-fuck-her-with-tentacle-dick
	 * lottie-gives-you-a-blowjob
	 * lottie-ifris-threesome
	 * marae-bad-end
	 * marae-first-encounter
	 * marae-second-encounter
	 * marae-second-encounter-pt-two
	 * monster-akbal
	 * monster-amily
	 * monster-anemone
	 * monster-basilisk
	 * monster-beegirl
	 * monster-brigid
	 * monster-ceraph
	 * monster-chameleongirl
	 * monster-corrupteddrider
	 * monster-cumwitch
	 * monster-demonmob
	 * monster-ember
	 * monster-farmers
	 * monster-femalespidermorph
	 * monster-fetishcultist
	 * monster-fetishzealot
	 * monster-gnoll
	 * monster-gnollspearthrower
	 * monster-goblin
	 * monster-goblinassassin
	 * monster-gooarmor
	 * monster-googirl
	 * monster-greenslime
	 * monster-harpy
	 * monster-harpymob
	 * monster-harpyqueen
	 * monster-hel
	 * monster-hellhound
	 * monster-holli
	 * monster-hollispawn
	 * monster-imageName
	 * monster-imp
	 * monster-implord
	 * monster-impmob
	 * monster-incubusmechanic
	 * monster-infestedhellhound
	 * monster-isabella
	 * monster-izma
	 * monster-izumi
	 * monster-jojo
	 * monster-kelt
	 * monster-kiha
	 * monster-kitsune
	 * monster-malespidermorph
	 * monster-marble
	 * monster-milkysuccubus
	 * monster-minerva
	 * monster-minotaur
	 * monster-minotaurlord
	 * monster-minotaurmob
	 * monster-naga
	 * monster-omnibusoverseer
	 * monster-phoenixmob
	 * monster-pod
	 * monster-sandmother
	 * monster-sandtrap
	 * monster-sandwidch
	 * monster-sandwitch
	 * monster-sandwitchmob
	 * monster-satyr
	 * monster-secretarialsuccubus
	 * monster-sharkgirl
	 * monster-sheila
	 * monster-shouldra
	 * monster-sirius
	 * monster-sophie
	 * monster-spidermorphmob
	 * monster-tamani
	 * monster-tamanisdaughters
	 * monster-tentaclebeast
	 * monster-vala
	 * monster-worms
	 * monster-zetaz
	 * niamh-approach-in-bar
	 * niamh-get-beer
	 * rubi-at-cafe
	 * rubi-at-house
	 * rubi-dildo-fuck
	 * rubi-fuck
	 * rubi-fucks-you
	 * rubi-get-massage
	 * rubi-get-ntr-ed
	 * rubi-gro-plus-penis
	 * rubi-gro-plus-tits
	 * rubi-hotdogged
	 * rubi-inspect-appearance
	 * rubi-orgasm-denial-release
	 * rubi-pop-buttjob
	 * rubi-tease
	 * rubi-tease-buttjob
	 * scylla-feed-bar-intro
	 * scylla-feed-jizz-solo-one
	 * scylla-feed-jizz-solo-three
	 * scylla-feed-jizz-solo-two
	 * scylla-first-help
	 * scylla-first-meeting
	 * scylla-help-round-five-firt-time
	 * scylla-help-round-five-firt-time-pt-two
	 * scylla-help-round-five-jizz-pt-five
	 * scylla-help-round-five-jizz-pt-four
	 * scylla-help-round-five-jizz-pt-one
	 * scylla-help-round-five-jizz-pt-three
	 * scylla-help-round-five-jizz-pt-two
	 * scylla-help-round-five-multi-cock-four
	 * scylla-help-round-five-multi-cock-one
	 * scylla-help-round-five-multi-cock-three
	 * scylla-help-round-five-multi-cock-two
	 * scylla-help-round-five-sex-pt-four
	 * scylla-help-round-five-sex-pt-one
	 * scylla-help-round-five-sex-pt-three
	 * scylla-help-round-five-sex-pt-two
	 * scylla-help-round-five-share
	 * scylla-help-round-five-take-advantage
	 * scylla-help-round-five-take-advantage-with-exgartuan-four
	 * scylla-help-round-five-take-advantage-with-exgartuan-one
	 * scylla-help-round-five-take-advantage-with-exgartuan-three
	 * scylla-help-round-five-take-advantage-with-exgartuan-two
	 * scylla-help-round-five-with-milk-five
	 * scylla-help-round-five-with-milk-four
	 * scylla-help-round-five-with-milk-one
	 * scylla-help-round-five-with-milk-three
	 * scylla-help-round-five-with-milk-two
	 * scylla-help-round-four
	 * scylla-help-round-four-pt-three
	 * scylla-help-round-four-pt-two
	 * scylla-help-round-three
	 * scylla-help-round-two
	 * scylla-help-round-two-jizz
	 * scylla-help-round-two-part-three
	 * scylla-help-round-two-part-two
	 * scylla-share-tentacle-addiction-one
	 * scylla-share-tentacle-addiction-three
	 * scylla-share-tentacle-addiction-two
	 * urta-bar
	 * urta-bar-bj
	 * urta-bar-drunk
	 * urta-bar-male-spank
	 * urta-bar-vag
	 * urta-behindbar-female-fuckurta
	 * urta-behindbar-fuck
	 * urta-behindbar-male-fuckurta
	 * urta-behindbar-masti
	 * urta-behindbar-masti-dual
	 * urta-behindbar-masti-solo
	 * urta-bukkake
	 * urta-egg-repeat
	 * urta-fills-her-condom
	 * urta-goo-fuck
	 * urta-home-69
	 * urta-home-anal
	 * urta-home-anal-urta
	 * urta-home-bj
	 * urta-home-female-fuck
	 * urta-home-female-fucked
	 * urta-home-female-ride
	 * urta-home-image
	 * urta-home-male-fuck
	 * urta-home-pegurta
	 * urta-home-petplay-doggy
	 * urta-home-petplay-reward
	 * urta-home-petplay-walkies
	 * urta-home-selfbj
	 * urta-naga-fuck
	 * urta-public-facial
	 * urta-public-fuck
	 * urta-raphael-3some
	 * urta-scylla-lapfuck
	 * urta-scylla-masti
	 * urta-syclla-3some
	 */
	var images = [
		'monster-akbal.png',
		'monster-beegirl.png',
		'monster-ceraph.png',
		'monster-chameleongirl.jpg',
		'monster-fetishcultist.png',
		'monster-fetishzealot.png',
		'monster-gooarmor.jpg',
		'monster-googirl.png',
		'monster-harpy.jpg',
		'monster-hel.png',
		'monster-imp.png',
		'monster-implord.png',
		'monster-impmob.png',
		'monster-incubusmechanic.png',
		'monster-isabella.png',
		'monster-izma.png',
		'monster-jojo.jpg',
		'monster-kelt.png',
		'monster-kiha.png',
		'monster-kitsune.png',
		'monster-naga.jpg',
		'monster-salamander.png',
		'monster-sandwidch.png',
		'monster-sandwitch.png',
		'monster-secretarialsuccubus.png',
		'monster-sheila.png',
		'monster-shouldra.jpg',
		'monster-sophie.png',
		'monster-tamani.jpg',
		'monster-vala.png',
		'urta-bar.jpg',
		'urta-bar-bj.jpg',
		'urta-bar-drunk.png',
		'urta-bar-male-spank.png',
		'urta-bar-vag.png',
		'urta-behindbar-female-fuckurta.png',
		'urta-behindbar-fuck.png',
		'urta-behindbar-male-fuckurta.png',
		'urta-behindbar-masti.jpg',
		'urta-behindbar-masti-solo.jpg',
		'urta-fills-her-condom.png',
		'urta-home-anal.jpg',
		'urta-home-image.jpg'
	];
	var ImageManager = {};
	ImageManager.getLoadedImageCount = function() {
		return images.length;
	};
	ImageManager.showImage = function( imageID, align ) {
		if( align === undefined ) {
			align = 'left';
		}
		$log.debug( 'showing imageID - ', imageID );
		var regex = new RegExp('^' + imageID + '(-[0-9]+)?\\.[^\\.]+$');
		var image = _.sample(_.filter(images, function(img) {
			return img.match(regex);
		}));
		if( image ) {
			return '<img src="images/contenst/' + image.url + '" class="' + align + '">';
		}
		return '';
	};
	return ImageManager;
} );