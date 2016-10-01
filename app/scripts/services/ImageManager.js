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
		'akbal-deepwoods-forcedfemaleoral_1.png',
		'akbal-deepwoods-losslust-analed_1.png',
		'akbal-deepwoods-male-jojosex_1.jpg',
		'akbal-deepwoods-sumbitanal_1.jpg',
		'akbal-deepwoods-sumbitanal_2.png',
		'amily-forest-fuckpreg_1.png',
		'amily-forest-kissingfuck_1.jpg',
		'amily-forest-kissingfuck_2.jpg',
		'amily-forest-plainfuck_1.jpg',
		'amily-forest-plainfuck_1.png',
		'amily-forest-reverse-cowgirl_1.jpg',
		'amily-forest-takecharge_1.jpg',
		'amily-forest-takecharge_2.png',
		'amily-forest-takecharge_3.jpg',
		'amily-forest-takecharge_4.png',
		'anemone-bj_1.png',
		'anemone-doggy_1.jpg',
		'anemone-doggy_2.jpeg',
		'anemone-egg_1.jpeg',
		'anemone-kid-female-masti_1.png',
		'anemone-kid-male-bj_1.jpg',
		'anemone-kid-male-bj_2.jpeg',
		'anemone-kid-male-masti_1.png',
		'anemone-kid-male-vagfuck_1.jpg',
		'anemone-kid-male-vagfuck_2.jpg',
		'anemone-kid-male-vagfuck_3.jpeg',
		'anemone-kid-male-vagfuck_4.jpg',
		'anemone-male-fuck_1.jpg',
		'anita-sex-eaglefuck_1.png',
		'anita-sex-eaglefuck_2.jpg',
		'anita-sex-sixtynine_1.jpg',
		'anita-sex-vaginalfuck_1.png',
		'anita-song_1.jpg',
		'arianfemale-camp-dreamingArian_1.jpg',
		'arianfemale-camp-dreamingArian_2.jpg',
		'arianfemale-home-doublepenetrate_1.png',
		'arianfemale-home-doublepenetrate_2.png',
		'arianfemale-home-doublepenetrate_3.jpg',
		'arianfemale-home-doublepenetrate_4.jpg',
		'arianfemale-home-getbj_1.png',
		'arianfemale-home-getbj_2.jpg',
		'arianfemale-home-giveArianAnal_1.jpg',
		'arianfemale-home-giveArianAnal_2.jpg',
		'arianfemale-home-giveArianAnal_3.jpg',
		'arianfemale-home-mutualmasturbation_1.jpg',
		'arianfemale-home-mutualmasturbation_2.jpg',
		'arianfemale-home-mutualmasturbation_3.jpg',
		'arianfemale-home-penetrate_1.jpg',
		'arianfemale-home-penetrate_2.png',
		'arianfemale-home-penetrate_3.jpeg',
		'arianfemale-home-suckariandick_1.jpg',
		'arianfemale-tent_1.jpg',
		'arianfemale-tent_2.png',
		'arianfemale-tent_3.jpg',
		'arianfemale-tent_4.jpg',
		'arianfemale-tent_5.jpg',
		'arianmale-camp-dreamingArian_1.jpg',
		'arianmale-home-getbj_1.jpg',
		'arianmale-home-giveArianAnal_1.jpg',
		'arianmale-home-giveArianAnal_2.jpg',
		'arianmale-home-giveArianAnal_3.jpg',
		'arianmale-home-giveArianAnal_4.jpg',
		'arianmale-home-mutualmasturbation_1.png',
		'arianmale-home-mutualmasturbation_2.png',
		'arianmale-home-mutualmasturbation_3.jpg',
		'arianmale-home-suckariandick_1.png',
		'arianmale-home-suckariandick_2.jpg',
		'arianmale-tent_1.png',
		'arianmale-tent_2.png',
		'arian-park_1.jpg',
		'behemoth-blowjob_1.jpg',
		'behemoth-blowjob_2.png',
		'behemoth-blowjob_3.jpg',
		'behemoth-blowjob_4.jpg',
		'behemoth-talk_1.png',
		'behemoth-talk_2.png',
		'behemoth-talk_3.png',
		'behemoth-talk_4.jpg',
		'brooke-first-meeting_1.png',
		'brooke-first-meeting_2.jpg',
		'brooke-first-meeting_3.png',
		'brooke-first-meeting_4.jpg',
		'brooke-grope-her_1.jpg',
		'brooke-grope-her_2.jpg',
		'brooke-grope-her_3.png',
		'brooke-grope-her_4.jpg',
		'brooke-grope-her_5.png',
		'brooke-gym-female-tribadism_1.png',
		'brooke-gym-goDown_1.jpg',
		'brooke-gym-goDown_2.jpg',
		'brooke-gym-heckelbrooke3some_1.png',
		'brooke-gym-heckelbrooke3some_2.jpg',
		'brooke-gym-heckelbrooke3some_3.jpg',
		'brooke-gym-heckelbrooke3some_4.jpg',
		'brooke-gym-heckelbrookedominance_1.jpg',
		'brooke-gym-male-doubledicked_1.jpg',
		'brooke-gym-male-doubledicked_2.png',
		'brooke-gym-male-getLaid_1.png',
		'brooke-gym-male-getLaid_2.jpg',
		'brooke-gym-male-getLaid_3.jpg',
		'brooke-gym-male-getLaid_4.png',
		'brooke-gym-male-getLaid_5.png',
		'brooke-gym-male-getLaid_6.jpg',
		'brooke-gym-male-penetratebrooke_1.jpg',
		'brooke-gym-male-penetratebrooke_2.jpg',
		'brooke-gym-male-penetratebrooke_3.png',
		'brooke-gym-male-penetratebrooke_4.jpg',
		'callu-intro_1.jpg',
		'callu-intro_2.jpg',
		'callu-intro_3.jpg',
		'callu-intro_4.jpg',
		'callu-intro_5.jpg',
		'callu-intro_6.jpg',
		'callu-sex-facesit_1.jpg',
		'callu-sex-facesit_2.jpg',
		'callu-sex-fuck_1.jpg',
		'camping_1.jpg',
		'coc-logo_1.jpg',
		'coc-logo_2.png',
		'coc-logo_3.png',
		'coc-logo_4.png',
		'cotton-greeting_1.png',
		'cotton-greeting_2.jpg',
		'cotton-shower-fuck-repeat_1.png',
		'cotton-shower-fucks-you-repeat_1.png',
		'dominika-first-meeting-at-bar_1.png',
		'dominika-first-meeting-at-bar_2.jpg',
		'dominika-gives-you-blowjob_1.png',
		'dominika-gives-you-blowjob_2.jpg',
		'dominika-oral-sex_1.png',
		'dungeon-entrance-deepcave_1.jpg',
		'dungeon-entrance-deepcave_2.jpg',
		'dungeon-entrance-desertcave_1.jpg',
		'dungeon-entrance-factory_1.jpg',
		'dungeon-entrance-phoenixtower_1.png',
		'dungeon-entrance-stronghold_1.jpg',
		'dungeon-entrance-stronghold_2.jpg',
		'dungeon-entrance-stronghold_3.jpg',
		'edryn-bar-chat_1.png',
		'edryn-bar-chat_2.jpg',
		'edryn-eat-her-out_1.png',
		'edryn-eat-her-out_2.jpg',
		'edryn-eat-her-out_3.jpeg',
		'edryn-fuck-as-non-taur_1.jpg',
		'edryn-fuck-as-non-taur_2.jpg',
		'edryn-fuck-as-non-taur_3.jpg',
		'edryn-fuck-as-non-taur_4.jpg',
		'edryn-fuck-as-non-taur_5.jpg',
		'edryn-fuck-as-taur_1.jpg',
		'edryn-preggo-fuck_1.jpg',
		'edryn-preggo-fuck_2.jpg',
		'goblinelder-win-male-corruptedbj_1.jpg',
		'goblin-win-drider-egged_1.png',
		'goblin-win-female-rapedfem_1.jpg',
		'goblin-win-male-buttsex_1.jpg',
		'goblin-win-male-buttsex_2.jpg',
		'goblin-win-male-buttsex_3.png',
		'goblin-win-male-buttsex_4.png',
		'goblin-win-male-corruptedbj_1.jpg',
		'goblin-win-male-corruptedbj_2.jpg',
		'goblin-win-male-corruptedbj_3.jpg',
		'goblin-win-male-corruptedbj_4.jpg',
		'goblin-win-male-corruptedbj_5.jpg',
		'goblin-win-male-corruptedbj_6.png',
		'goblin-win-male-corruptedbj_7.png',
		'goblin-win-male-corruptedfuck_1.jpg',
		'goblin-win-male-corruptedfuck_2.png',
		'goblin-win-male-goblinboners_1.jpg',
		'goblin-win-male-goblinboners_2.png',
		'goblin-win-male-goblinboners_3.png',
		'harry-sex-getfucked_1.jpg',
		'harry-sex-getfucked_2.jpg',
		'helia-buttfuck_1.jpg',
		'helia-buttfuck_2.jpg',
		'helia-doublepenetration_1.jpg',
		'helia-doublepenetration_2.jpg',
		'helia-follower-boxing_1.png',
		'helia-follower-intro_1.jpeg',
		'helia-follower-muddylizardfeet_1.png',
		'helia-follower-poker_1.png',
		'helia-follower-threesome-kiha_1.jpg',
		'helia-fox-foursome-male_1.jpg',
		'helia-getblown_1.jpg',
		'helia-getblown_2.jpeg',
		'helia-getblown_3.jpeg',
		'helia-interview_1.png',
		'helia-interview_2.jpg',
		'helia-interview_3.jpg',
		'helia-interview_4.jpg',
		'helia-isabella-fight_1.jpg',
		'helia-isabella-milkoffer_1.jpg',
		'helia-mount_1.jpg',
		'helia-swim_1.jpg',
		'helia-threesome-minotaur_1.jpeg',
		'helia-vagfuck_1.jpg',
		'helia-vagfuck_2.jpg',
		'implord-win-male-fuck_1.jpeg',
		'imp-loss-female-fuck_1.jpg',
		'imp-loss-female-fuck_2.jpg',
		'jojo-appearance_1.jpg',
		'jojo-appearance_2.jpg',
		'joy-appearance_1.jpg',
		'katherine-examine-her-appearance_1.jpg',
		'katherine-examine-her-appearance_2.jpg',
		'katherine-examine-her-appearance_3.jpg',
		'katherine-fuck-and-suck_1.jpg',
		'katherine-fuck-and-suck_2.jpg',
		'katherine-fuck-her-bungholio_1.png',
		'katherine-fuck-her-bungholio_2.jpg',
		'katherine-fuck-her-bungholio_3.png',
		'katherine-fuck-her-bungholio_4.png',
		'katherine-fuck-her-bungholio_5.jpg',
		'katherine-fuck-her-bungholio_6.png',
		'katherine-fuck-her-bungholio_7.jpg',
		'katherine-fuck-her-bungholio_8.png',
		'katherine-fuck-her-bungholio_9.jpg',
		'katherine-fuck-her-vagoo_1.jpg',
		'katherine-fuck-her-vagoo_2.png',
		'katherine-fuck-her-vagoo_3.png',
		'katherine-fuck-her-vagoo_4.jpg',
		'katherine-fuck-her-vagoo_5.png',
		'katherine-fuck-her-vagoo_6.jpg',
		'katherine-give-her-blowjobs_1.jpg',
		'katherine-suck-and-fucks-you_1.png',
		'katherine-suckles-you_1.png',
		'katherine-suckles-you_2.jpg',
		'katherine-suckles-you_3.jpg',
		'katherine-suckles-you_4.png',
		'katherine-suckles-you_5.jpg',
		'katherine-visit-alley_1.jpg',
		'katherine-visit-alley_2.png',
		'katherine-visit-alley_3.jpg',
		'katherine-visit-alley_4.jpg',
		'katherine-visit-alley_5.png',
		'katherine-visit-alley_6.png',
		'kelt-farm-female-inheat_1.jpg',
		'kelt-farm-female-inheat_2.jpg',
		'kelt-farm-female-inheat_3.png',
		'kelt-farm-naga-subkelt_1.jpg',
		'kelt-farm-smallbarn_1.jpg',
		'kelt-farm-subkelt_1.png',
		'kelt-farm-subkelt_2.jpg',
		'kelt-farm-subkelt_3.jpg',
		'kelt-farm-subkelt_4.jpg',
		'kelt-farm-subkelt_5.png',
		'kelt-farm-subkelt_6.jpg',
		'kiha-buttfuck_1.jpg',
		'kiha-buttfuck_2.png',
		'kiha-dom-loss_1.jpg',
		'kiha-dom-win_1.png',
		'kiha-dom-win_2.jpeg',
		'kiha-follower-hangout-stargazing_1.jpg',
		'kiha-follower-sex-buttfuck_1.jpg',
		'kiha-follower-sex-buttfuck_2.png',
		'kiha-follower-sex-sixtynine_1.jpg',
		'kiha-follower-sex-vagfuck_1.jpg',
		'kiha-follower-sex-vagfuck_2.jpg',
		'kiha-forced-talk_1.jpeg',
		'kiha-forced-talk_2.png',
		'kiha-forced-talk_3.jpg',
		'kiha-intro_1.jpeg',
		'kiha-loss-herm_1.jpg',
		'kiha-loss-male_1.jpg',
		'kiha-mutualmasturbation_1.jpg',
		'kiha-vagfuck_1.jpeg',
		'location-bazaar_1.jpg',
		'location-ingnam_1.jpg',
		'location-owca_1.jpg',
		'location-owca_2.jpg',
		'location-owca_3.jpg',
		'location-teladre_1.jpg',
		'location-teladre-thewetbitch_1.jpg',
		'location-teladre-thewetbitch_2.png',
		'loppe-orgazm-denial_1.png',
		'loppe-rides-your-cock_1.jpg',
		'loppe-rides-your-cock_2.jpg',
		'loppe-rides-your-cock_3.png',
		'loppe-rides-your-cock_4.png',
		'loppe-rides-your-cocks_1.jpg',
		'loppe-show-at-bar_1.png',
		'loppe-teaze-and-leave_1.jpg',
		'loppe-teaze-and-leave_2.jpg',
		'loppe-worships-your-cock_1.jpg',
		'loppe-worships-your-cock_2.jpg',
		'loppe-worships-your-cock_3.jpg',
		'loppe-worships-your-cock_4.jpeg',
		'loppe-worships-your-cock_5.png',
		'lottie-encounter_1.jpg',
		'lottie-encounter_2.jpg',
		'lottie-encounter_3.png',
		'lottie-examine-appearance_1.png',
		'lottie-examine-appearance_2.jpg',
		'lottie-fuck-her-in-teh-butzor_1.jpg',
		'lottie-fuck-her-in-teh-butzor_2.jpg',
		'lottie-gives-you-a-blowjob_1.png',
		'minerva-appearance_1.jpg',
		'minerva-appearance_2.png',
		'minerva-appearance-pure_1.jpg',
		'minerva-appearance-pure_2.jpg',
		'minerva-bathtime_1.png',
		'minerva-sex-blowjob_1.jpg',
		'minerva-talk-spring_1.jpg',
		'monster-akbal_1.png',
		'monster-akbal_2.jpg',
		'monster-akbal_3.jpg',
		'monster-akbal_4.jpg',
		'monster-akbal_5.jpg',
		'monster-akbal_6.jpg',
		'monster-akbal_7.png',
		'monster-amily_1.jpg',
		'monster-amily_2.jpg',
		'monster-amily_3.jpg',
		'monster-amily_4.jpg',
		'monster-amily_5.png',
		'monster-amily_6.png',
		'monster-anemone_1.jpg',
		'monster-anemone_2.jpg',
		'monster-basilisk_1.jpg',
		'monster-basilisk_2.jpg',
		'monster-beegirl_1.png',
		'monster-beegirl_2.jpg',
		'monster-beegirl_3.jpeg',
		'monster-beegirl_4.jpg',
		'monster-beegirl_5.png',
		'monster-beegirl_6.jpg',
		'monster-beegirl_7.jpg',
		'monster-beegirl_8.jpeg',
		'monster-beegirl_9.jpg',
		'monster-behemoth_1.png',
		'monster-behemoth_2.jpg',
		'monster-behemoth_3.jpg',
		'monster-brigid_1.jpg',
		'monster-ceraph.png',
		'monster-chameleongirl.jpg',
		'monster-chameleongirl_1.jpg',
		'monster-chameleongirl_2.jpg',
		'monster-chameleongirl_3.png',
		'monster-corrupteddrider_1.jpg',
		'monster-corrupteddrider_2.jpg',
		'monster-corrupteddrider_3.jpg',
		'monster-corrupteddrider_4.jpg',
		'monster-corrupteddrider_5.jpg',
		'monster-corrupteddrider_6.png',
		'monster-corrupteddrider_7.jpg',
		'monster-corrupteddrider_8.jpg',
		'monster-cumwitch_1.jpg',
		'monster-femalespidermorph_1.jpg',
		'monster-fetishcultist.png',
		'monster-fetishzealot_1.png',
		'monster-fetishzealot_2.png',
		'monster-gnoll_1.png',
		'monster-gnoll_2.png',
		'monster-gnollspearthrower_1.png',
		'monster-gnollspearthrower_2.png',
		'monster-gnollspearthrower_3.png',
		'monster-gnollspearthrower_4.jpg',
		'monster-goblin_1.png',
		'monster-goblin_2.jpg',
		'monster-goblin_3.png',
		'monster-goblin_4.jpg',
		'monster-goblin_5.jpg',
		'monster-goblin_6.jpg',
		'monster-goblin_7.png',
		'monster-goblinassassin_1.jpg',
		'monster-goblinelder_1.jpg',
		'monster-goblinshaman_1.jpg',
		'monster-goblinshaman_2.jpg',
		'monster-goblinwarrior_1.jpg',
		'monster-goblinwarrior_2.jpg',
		'monster-goblinwarrior_3.jpg',
		'monster-goblinwarrior_4.jpg',
		'monster-goblinwarrior_5.jpg',
		'monster-goblinwarrior_6.png',
		'monster-gooarmor.jpg',
		'monster-googirl.png',
		'monster-googirl_1.png',
		'monster-googirl_10.jpeg',
		'monster-googirl_11.jpg',
		'monster-googirl_12.png',
		'monster-googirl_13.jpg',
		'monster-googirl_14.jpeg',
		'monster-googirl_15.jpeg',
		'monster-googirl_16.jpg',
		'monster-googirl_2.jpg',
		'monster-googirl_3.jpg',
		'monster-googirl_4.jpg',
		'monster-googirl_5.jpg',
		'monster-googirl_6.jpg',
		'monster-googirl_7.jpg',
		'monster-googirl_8.jpg',
		'monster-googirl_9.jpeg',
		'monster-greenslime_1.png',
		'monster-greenslime_2.png',
		'monster-harpy.jpg',
		'monster-harpy_1.jpg',
		'monster-harpy_10.jpg',
		'monster-harpy_11.jpg',
		'monster-harpy_12.jpg',
		'monster-harpy_13.jpg',
		'monster-harpy_14.jpg',
		'monster-harpy_2.jpg',
		'monster-harpy_3.jpg',
		'monster-harpy_4.jpg',
		'monster-harpy_5.jpg',
		'monster-harpy_6.jpg',
		'monster-harpy_7.jpg',
		'monster-harpy_8.jpg',
		'monster-harpy_9.jpg',
		'monster-harpyqueen_1.jpg',
		'monster-harpyqueen_2.jpg',
		'monster-harpyqueen_3.jpg',
		'monster-harpyqueen_4.png',
		'monster-harpyqueen_5.jpg',
		'monster-harpyqueen_6.png',
		'monster-hel.png',
		'monster-hel_1.jpg',
		'monster-hel_2.jpg',
		'monster-hel_3.jpg',
		'monster-hel_4.png',
		'monster-hellhound_1.jpg',
		'monster-hellhound_2.png',
		'monster-holli_1.jpg',
		'monster-imp_1.png',
		'monster-imp_2.jpg',
		'monster-imp_3.jpg',
		'monster-imp_4.jpg',
		'monster-implord.png',
		'monster-impmob.png',
		'monster-incubusmechanic.png',
		'monster-incubusmechanic_1.jpg',
		'monster-incubusmechanic_2.jpg',
		'monster-incubusmechanic_3.png',
		'monster-incubusmechanic_4.jpg',
		'monster-incubusmechanic_5.png',
		'monster-isabella_1.png',
		'monster-isabella_2.jpg',
		'monster-isabella_3.png',
		'monster-isabella_4.jpg',
		'monster-isabella_5.png',
		'monster-isabella_6.jpg',
		'monster-izma_1.png',
		'monster-izma_2.jpg',
		'monster-izma_3.jpg',
		'monster-izma_4.jpg',
		'monster-izma_5.jpg',
		'monster-izma_6.png',
		'monster-izma_7.png',
		'monster-izumi_1.png',
		'monster-izumi_2.jpg',
		'monster-izumi_3.jpg',
		'monster-jeanclaude_1.jpg',
		'monster-jojo.jpg',
		'monster-jojo_1.jpg',
		'monster-jojo_2.jpg',
		'monster-kelt_1.jpg',
		'monster-kelt_2.png',
		'monster-kiha_1.png',
		'monster-kiha_2.jpg',
		'monster-kiha_3.jpg',
		'monster-kiha_4.jpg',
		'monster-kiha_5.jpg',
		'monster-kiha_6.jpg',
		'monster-kiha_7.png',
		'monster-kiha_8.jpg',
		'monster-kitsune.png',
		'monster-kitsune_1.jpg',
		'monster-kitsune_2.jpg',
		'monster-kitsune_3.jpg',
		'monster-kitsune_4.png',
		'monster-kitsune_5.jpg',
		'monster-kitsune_6.png',
		'monster-kitsune_7.png',
		'monster-kitsune_8.jpg',
		'monster-lizanrogue_1.png',
		'monster-lizanrogue_2.jpg',
		'monster-malespidermorph_1.png',
		'monster-marble_1.png',
		'monster-marble_10.png',
		'monster-marble_2.jpg',
		'monster-marble_3.jpg',
		'monster-marble_4.jpg',
		'monster-marble_5.jpg',
		'monster-marble_6.png',
		'monster-marble_7.png',
		'monster-marble_8.jpg',
		'monster-marble_9.jpg',
		'monster-minerva_1.png',
		'monster-minerva_2.png',
		'monster-minervacorrupt_1.jpg',
		'monster-minotaur_1.jpg',
		'monster-minotaur_2.jpg',
		'monster-minotaur_3.jpg',
		'monster-minotaur_4.png',
		'monster-minotaurlord_1.jpg',
		'monster-minotaurlord_2.jpg',
		'monster-naga.jpg',
		'monster-naga_1.jpg',
		'monster-naga_10.png',
		'monster-naga_11.jpg',
		'monster-naga_12.jpg',
		'monster-naga_13.jpg',
		'monster-naga_2.jpg',
		'monster-naga_3.png',
		'monster-naga_4.jpg',
		'monster-naga_5.jpg',
		'monster-naga_6.jpg',
		'monster-naga_7.png',
		'monster-naga_8.jpg',
		'monster-naga_9.jpg',
		'monster-omnibusoverseer_1.jpg',
		'monster-omnibusoverseer_2.png',
		'monster-omnibusoverseer_3.png',
		'monster-phoenix_1.jpg',
		'monster-phoenix_2.jpg',
		'monster-phoenix_3.jpg',
		'monster-salamander.png',
		'monster-sandtrap_1.png',
		'monster-sandtrap_2.jpg',
		'monster-sandwidch.png',
		'monster-sandwitch_1.png',
		'monster-sandwitch_2.jpg',
		'monster-sandwitch_3.jpg',
		'monster-sandwitch_4.jpg',
		'monster-sandwitch_5.jpg',
		'monster-satyr_1.png',
		'monster-satyr_2.jpg',
		'monster-satyr_3.jpg',
		'monster-satyr_4.jpg',
		'monster-secretarialsuccubus_1.png',
		'monster-secretarialsuccubus_2.jpg',
		'monster-secretarialsuccubus_4.jpg',
		'monster-secretarialsuccubus_5.jpg',
		'monster-secretarialsuccubus_6.jpg',
		'monster-sharkgirl_1.png',
		'monster-sharkgirl_2.jpg',
		'monster-sharkgirl_3.jpg',
		'monster-sharkgirl_4.jpg',
		'monster-sharkgirl_5.jpg',
		'monster-sharkgirl_6.jpg',
		'monster-sheila.png',
		'monster-sheila_1.png',
		'monster-sheila_2.png',
		'monster-shouldra_1.jpg',
		'monster-shouldra_2.jpg',
		'monster-shouldra_3.jpg',
		'monster-shouldra_4.jpg',
		'monster-shouldra_5.png',
		'monster-sophie_1.png',
		'monster-sophie_2.jpg',
		'monster-sophie_3.png',
		'monster-succubusgardener_1.jpg',
		'monster-tamani.jpg',
		'monster-tamani_1.png',
		'monster-tamani_2.png',
		'monster-tamani_3.png',
		'monster-tamani_4.png',
		'monster-tentaclebeast_1.jpg',
		'monster-tentaclebeast_2.jpg',
		'monster-vala_1.png',
		'monster-vala_2.png',
		'monster-valkyrie_1.jpg',
		'monster-valkyrie_2.jpg',
		'monster-valkyrie_3.jpg',
		'monster-valkyrie_4.jpg',
		'monster-yeti_1.png',
		'monster-zetaz_1.png',
		'monster-zetaz_2.jpg',
		'monster-zetaz_3.png',
		'niamh-approach-in-bar_1.jpg',
		'niamh-approach-in-bar_2.png',
		'niamh-approach-in-bar_3.jpg',
		'niamh-approach-in-bar_4.jpg',
		'niamh-approach-in-bar_5.png',
		'niamh-approach-in-bar_6.jpg',
		'niamh-get-beer_1.jpg',
		'niamh-get-beer_2.jpg',
		'niamh-get-beer_3.jpg',
		'niamh-get-beer_4.jpg',
		'niamh-get-beer_5.jpg',
		'niamh-get-beer_6.jpg',
		'rubi-at-cafe_1.png',
		'rubi-at-cafe_2.png',
		'rubi-tease-buttjob_1.png',
		'scylla-feed-bar-intro_1.jpg',
		'scylla-feed-jizz-solo-one_1.jpg',
		'scylla-first-meeting_1.jpg',
		'scylla-first-meeting_2.jpg',
		'urta-bar_1.jpg',
		'urta-bar_2.jpg',
		'urta-bar_3.png',
		'urta-bar_4.png',
		'urta-bar-bj_1.jpg',
		'urta-bar-bj_2.png',
		'urta-bar-bj_3.png',
		'urta-bar-bj_4.jpg',
		'urta-bar-drunk_1.png',
		'urta-bar-drunk_2.jpg',
		'urta-bar-drunk_3.jpg',
		'urta-bar-drunk_4.png',
		'urta-bar-male-spank_1.png',
		'urta-bar-male-spank_2.png',
		'urta-bar-male-spank_3.jpg',
		'urta-bar-male-spank_4.png',
		'urta-bar-male-spank_5.png',
		'urta-bar-vag.png',
		'urta-bar-vag_1.jpg',
		'urta-behindbar-female-fuckurta.png',
		'urta-behindbar-fuck.png',
		'urta-behindbar-fuck_1.jpg',
		'urta-behindbar-male-fuckurta.png',
		'urta-behindbar-male-fuckurta_1.jpg',
		'urta-behindbar-male-fuckurta_2.jpg',
		'urta-behindbar-male-fuckurta_3.png',
		'urta-behindbar-masti.jpg',
		'urta-behindbar-masti_1.jpg',
		'urta-behindbar-masti_2.png',
		'urta-behindbar-masti-dual_1.png',
		'urta-behindbar-masti-solo_1.jpg',
		'urta-behindbar-masti-solo_2.jpg',
		'urta-fills-her-condom.png',
		'urta-home-69_1.jpg',
		'urta-home-anal.jpg',
		'urta-home-female-fucked_1.png',
		'urta-home-female-ride_1.jpg',
		'urta-home-image.jpg',
		'urta-home-image_1.png',
		'urta-home-image_10.jpg',
		'urta-home-image_2.png',
		'urta-home-image_3.png',
		'urta-home-image_4.jpg',
		'urta-home-image_5.jpg',
		'urta-home-image_6.jpg',
		'urta-home-image_7.jpg',
		'urta-home-image_8.jpg',
		'urta-home-image_9.png',
		'urta-home-male-fuck_1.png',
		'urta-home-male-fuck_2.jpg',
		'urta-home-male-fuck_3.jpg',
		'urta-home-male-fuck_4.jpg',
		'urta-home-male-fuck_5.png',
		'urta-home-male-fuck_6.jpg',
		'urta-home-pegurta_1.png',
		'urta-home-pegurta_2.jpg',
		'urta-home-petplay-doggy_1.jpg',
		'urta-home-petplay-reward_1.jpg',
		'urta-home-selfbj_1.jpg',
		'urta-naga-fuck_1.png',
		'urta-public-facial_1.png',
		'urta-public-facial_2.png',
		'urta-public-facial_3.jpg',
		'urta-public-facial_4.jpg',
		'valeria-take_1.png'
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