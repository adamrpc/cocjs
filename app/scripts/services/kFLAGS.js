'use strict';

angular.module('cocjs').factory('kFLAGS', function () {
	return {
		UNKNOWN_FLAG_NUMBER_00000                   :    0,
		MARBLE_PREGNANCY_INCUBATION                 :    1, // Marble Pregnancy Incubation
		MARBLE_PREGNANCY_TYPE                       :    2, // Marble Pregnancy Type" Description="1 = cowgirl
		MARBLE_LUST                                 :    3, // Marble Lust
		MARBLE_DICK_TYPE                            :    4, // Marble Dick Type
		MARBLE_DICK_LENGTH                          :    5, // Marble Dick Length
		MARBLE_DICK_THICKNESS                       :    6, // Marble Dick Thickness
		MARBLE_UNUSED_DOOTY                         :    7, // Marble Dooty. Haha doody.  (DUTY) Seems unused
		MARBLE_KIDS                                 :    8, // 
		MARBLE_NURSERY_CONSTRUCTION                 :    9, // Marble's Bitch-Bin (0 = not start, less than 100 = in progress.  100 = Finished
		PLAYER_PREGGO_WITH_WORMS                    :   10, // (I think)// HAS WORM CUM DISPLAYED YET? 
		TIMES_FUCKED_URTA                           :   11, // URTA - times fucked
		URTA_COMFORTABLE_WITH_OWN_BODY              :   12, // URTA - horsecock comfort level (-1 = hates self, no luvs)
		URTA_TIME_SINCE_LAST_CAME                   :   13, // URTA - hours until can be horny again
		PC_SEEN_URTA_SEX_TOYS                       :   14, // URTA - seen Urta's toyz?
		PLAYER_RESISTED_AKBAL                       :   15, // Akbal resisted?  - 1 means the PC has resisted at least once
		AKBAL_SUBMISSION_COUNTER                    :   16, // Akbal submission counter
		AKBAL_SUBMISSION_STATE                      :   17, // Akbal submission state. -1=Lost to him, 1=Beaten him, 2=Akbal is your bitch
		MINOTAUR_CUM_ADDICTION_TRACKER              :   18, // Minotaur cum Addiction Tracker
		TIME_SINCE_LAST_CONSUMED_MINOTAUR_CUM       :   19, // Time Since Last Minocum fix
		MINOTAUR_CUM_ADDICTION_STATE                :   20, // Current Addict State (0 = normal, 1= addicted, 1 = needy, 2= withdrawal)
		MINOTAUR_CUM_REALLY_ADDICTED_STATE          :   21, // lust status affect timer
		IN_COMBAT_USE_PLAYER_WAITED_FLAG            :   22, // Did PC Wait in combat?
		PC_FETISH                                   :   23, // Fetish Level 1 - exhibitionism, 2 - bondage, 3 - pacifism
		PC_MET_CERAPH                               :   24, // Met Ceraph
		INCREASED_HAIR_GROWTH_TIME_REMAINING        :   25, // Increased Hair-growth Days Left
		INCREASED_HAIR_GROWTH_SERUM_TIMES_APPLIED   :   26, // Increased Hair-growth stack
		CHEAT_ENTERING_COUNTER                      :   27, // Cheat Input Counter
		TIMES_CHEATED_COUNTER                       :   28, // Cheat Break Counter
		URTA_PC_AFFECTION_COUNTER                   :   29, // Urta love counter
		URTA_PC_LOVE_COUNTER                        :   30, // Urta Love Level
		URTA_ANGRY_AT_PC_COUNTDOWN                  :   31, // Urta pissed countdown
		URTA_KNOWS_PC_HAS_MARBLE_FOLLOWER           :   32, // Marble Cockblock happened = 0 - no, 1 = yes
		PC_SEEN_URTA_BADASS_FIGHT                   :   33, // Seen Urta be a badass?
		PC_ENCOUNTERED_CHRISTMAS_ELF_BEFORE         :   34, // Last year xmas elf encountered
		AMILY_MET                                   :   35, //   (0 = not met, 1 = met)Amily Met.  0=Not Met, 1=Met
		AMILY_VILLAGE_ENCOUNTERS_DISABLED           :   36, //  1=true,44=village buttonAmily Village Encounters Disabled.  1=True, 44=Village Button?
		AMILY_GROSSED_OUT_BY_WORMS                  :   37, //  1=freaked out-Amily encounters disabled due to worms 0=False, 1= True
		AMILY_AFFECTION                             :   38, //   (< 15 = low.  In between = medium. 40+= high affect)Amily Affection. 15 = Low.  In Between = Medium. 40+= High Affect
		AMILY_OFFER_ACCEPTED                        :   39, //   (1 = true, 0 = not yet)Amily Offer Accepted. 0=False, 1=True
		AMILY_BIRTH_TOTAL                           :   40, // Amily Birth Total.
		AMILY_INCUBATION                            :   41, //    0 = not pregnant, otherwise hours till birth 168Amily Incubation. 0=Not Pregnant, Otherwise Hours Till Birth Starting From 168
		AMILY_FUCK_COUNTER                          :   42, // Amily Fuck Counter.
		AMILY_FOLLOWER                              :   43, // Amily Follower. 0=Not Follower, 1=Follower 2=Corrupted Follower?
		AMILY_VILLAGE_ACCESSIBLE                    :   44, // Amily Village Accessible. Related To 36]
		AMILY_WANG_LENGTH                           :   45, // Amily's Wang Length" Description="Starts 4x1, maxes @ 13x2
		AMILY_WANG_GIRTH                            :   46, // Amily Penis Gith.	Default=0
		AMILY_CUP_SIZE                              :   47, //  5-JanAmily's Cup Size (1 to 5)
		AMILY_NIPPLE_LENGTH                         :   48, //  0.3-4Nipple Length from .3 to 4"
		AMILY_HIP_RATING                            :   49, //  girly-womanlyAmily Hip Rating - girly to womanly - Default=12
		AMILY_ASS_SIZE                              :   50, // Can increase ass from "unremarkable ass" to "delightfully jiggly" - Default=12
		AMILY_LACTATION_RATE                        :   51, // Amily Lactation Rate. Default=0
		AMILY_CLOTHING                              :   52, // Amily Clothing. Default="sexy rags"
		LUMI_MET                                    :   53, // Lumi Met
		NUMBER_OF_TIMES_MET_SCYLLA                  :   54, // Met Scylla:   -1 = decline.  0 = not met.  1 = sucked once, 2 = sucked twice, etc
		TIMES_ENCOUNTED_TAMANIS_DAUGHTERS           :   55, // Times encountered Tamani's Daughters
		TAMANI_TIMES_HYPNOTISED                     :   56, // Tamani Hypno Level" Description="increases by 1 for each hypno event.  1-3 slight lust raises, 4-9 medium lust raises, 10-19 super high lust raises, 20+ high chance of autorape with special scene.
		TAMANI_DAUGHTER_PREGGO_COUNTDOWN            :   57, // Daughter Pregnancy Counter" Description="they will not return until this countdown timer is 0.  Same length as Tamani's incubation &#x2014, approx 1 week.
		UNKNOWN_FLAG_NUMBER_00058                   :   58, // Times In Goblin Daughter 'CHAIR'
		TIMES_FUCKED_TAMANIS_DAUGHTERS              :   59, // TimeSleptWithDaughters
		UNABLE_TO_MASTURBATE_BECAUSE_CENTAUR        :   60, // Fail Masturbation As Centaur?
		CERULEAN_POTION_BAD_END_FUTA_COUNTER        :   61, // Cerulean Potion Bad-End Futa Count
		CERULEAN_POTION_NEUTER_ATTEMPTED            :   62, // Cerulean Potion Neuter Attempted
		TEMP_STORAGE_SAVE_DELETION                  :   63, // Used as temp storage for deleting save slots
		MARBLE_GROSSED_OUT_BECAUSE_WORM_INFESTATION :   64, // Marble not sleeping with you due to worms
		FORCE_BEE_TO_PRODUCE_HONEY                  :   65, // Force Bee Honey Drop - Found Bee Honey.	1=Found
		HAIR_GROWTH_STOPPED_BECAUSE_LIZARD          :   66, // Hair no longer grows due to lizard
		TIMES_AUTOFELLATIO_DUE_TO_CAT_FLEXABILITY   :   67, // CAT: Autofellated
		EDRYN_PREGNANCY_INCUBATION                  :   68, // 
		EDRYN_NUMBER_OF_KIDS                        :   69, // EDRYN: Kids
		EDRYN_NEVER_SEE_AGAIN                       :   70, // EDRYN: NEVER SEE AGAIN
		EDRYN_PREGNANT_AND_NOT_TOLD_PC_YET          :   71, // EDRYN: Pregnancy Panic happen?
		EDRYN_NEEDS_TO_TALK_ABOUT_KID               :   72, // EDRYN: Gotta talk about kid
		EDRYN_GIFT_COUNTER                          :   73, // EDRYN: GOOD HAND OUTS
		AMILY_MET_PURE_JOJO                         :   74, // AMILY: Met pure jojo
		AMILY_SPAR_WITH_PURE_JOJO                   :   75, // AMILY: Spar with Jojo
		AMILY_PISSED_PC_CORRUPED_JOJO               :   76, // AMILY: Knew pure Jojo and is pissed that you 'broke' him.
		AMILY_WAIT_FOR_PC_FIX_JOJO                  :   77, // AMILY: PC agreed to 'fix' jojo.  No sex until this is reset to 0.
		AMILY_BLOCK_COUNTDOWN_BECAUSE_CORRUPTED_JOJO:   78, // AMILY: Jojo fixing countdown - no encounters with amily till it reaches 0.
		JOJO_FIXED_STATUS                           :   79, // JOJO: 'FIXED' = 1, 'FIXED + NOTE READ = 2
		JOJO_DEAD_OR_GONE                           :   80, // JOJO DEAD OR GONE = 1
		AMILY_DISCOVERED_TENTATLE_JOJO              :   81, // AMILY: Discovered tentacle Jojo happened
		AMILY_MET_RATHAZUL                          :   82, // AMILY: Met Rathazul
		RATHAZUL_CORRUPT_JOJO_FREAKOUT              :   83, // RATHAZUL: Corrupt Jojo freakout!
		JOJO_RATHAZUL_INTERACTION_COUNTER           :   84, // RATHAZUL: NON CORRUPT JOJO STUFF
		MARBLE_OR_AMILY_FIRST_FOR_FREAKOUT          :   85, // Which came first?  Marble(1) or Amily(2) - Freakout at Camp if both Marble and Amily present.	1=true, 2=No freakout
		AMILY_NOT_FREAKED_OUT                       :   86, // Amily Freakout Session
		RATHAZUL_CAMP_INTERACTION_COUNTDOWN         :   87, // Rathazul inter-follower countdown timer
		DISCOVERED_HIGH_MOUNTAIN                    :   88, // DISCOVER HIGH MOUNTAIN (Rangers, what a terrible TV show)
		COMBAT_BONUS_XP_VALUE                       :   89, // Sekrit Bonus XP Pass
		MET_SOPHIE_COUNTER                          :   90, // Met Sophie?
		FUCKED_SOPHIE_COUNTER                       :   91, // Times Had Sex With Sophie
		BREASTFEAD_SOPHIE_COUNTER                   :   92, // Times Breastfed Sophie
		SOPHIE_PREGNANCY_TYPE                       :   93, // Was previously SOPHIE_WILD_EGG_COUNTDOWN_TIMER
		SOPHIE_EGGS_LAID                            :   94, // Sophie eggs laid
		PC_CURRENTLY_LUSTSTICK_AFFECTED             :   95, // N
		SOPHIE_ANGRY_AT_PC_COUNTER                  :   96, // Sophie Pissed Off Counter
		TIMES_PISSED_OFF_SOPHIE_COUNTER             :   97, // Times Pissed Off Sophie
		TIMES_FUCKED_SOPHIE_LESBIAN                 :   98, // Times Lesbo-Sexed
		EASY_MODE_ENABLE_FLAG                       :   99, // Invincibility On - Easy Mode.	0=false, 1=true
		CORRUPT_MARAE_FOLLOWUP_ENCOUNTER_STATE      :  100, // Corrupt Marae Followups
		FOUND_WIZARD_STAFF                          :  101, // Found Wizard Staff
		UNKNOWN_FLAG_NUMBER_00102                   :  102, // Has extra jojo time been cleared? - Jojo Debug Flag
		TIMES_AUTOFELLATIOED_EXGARTUAN              :  103, // Times Autofellated Exgartuan
		WHITNEY_GEMS_PAID_THIS_WEEK                 :  104, // Whitney Gems Paid Out That Week
		TIMES_MET_SCYLLA_IN_ADDICTION_GROUP         :  105, // SCYLLA:  Times met Addiction Group
		TIMES_SCYLLA_ADDICT_GROUP_EXPLOITED         :  106, // SCYLLA: Times addict group taken advantage of
		SCYLLA_TIMES_SHARED_IN_ADDICT_GROUP         :  107, // SCYLLA: Times given the option to 'share' something
		SCYLLA_MILK_THERAPY_TIMES                   :  108, // SCYLLA: Milk therapy times
		SCYLLA_CUM_THERAPY_TIMES                    :  109, // SCYLLA: Cum therapy times
		SCYLLA_SEX_THERAPY_TIMES                    :  110, // SCYLLA: Sex therapy times
		UNKNOWN_FLAG_NUMBER_00111                   :  111, // Cerulean Succubus: Herm times used
		USED_MILKER_TODAY                           :  112, // Used milkers today?
		DISCOVERED_DUNGEON_2_ZETAZ                  :  113, // Discovered Dungeon 2 (Zetaz's Lair)
		DEFEATED_ZETAZ                              :  114, // Zetaz Defeated
		ZETAZ_DOOR_UNLOCKED                         :  115, // Zetaz' Door unlocked
		ZETAZ_IMP_HORDE_DEFEATED                    :  116, // Imp Horde Defooted
		ZETAZ_FUNGUS_ROOM_DEFEATED                  :  117, // Fungus Room Defeated (1 = yes)
		UNKNOWN_FLAG_NUMBER_00118                   :  118, // PONIES?!?!?!
		FREED_VALA                                  :  119, // Vala Released?
		WEEKLY_FAIRY_ORGY_COUNTDOWN                 :  120, // Weekly Faerie Orgy Countdown
		ENCOUNTERED_VALA_AT_BAR                     :  121, // Vala Met At Bar?
		FUCKED_VALA_AT_BAR_TODAY                    :  122, // Fucked Vala Today @ Bar?
		TIMES_FUCKED_VALA_IN_DUNGEON                :  123, // Times Vala Used IN Dungeon
		INVESTIGATED_VALA_AFTER_ZETAZ_DEFEATED      :  124, // Investigated Vala Since Zetaz downed?
		TIME_SINCE_VALA_ATTEMPTED_RAPE_PC           :  125, // rape attempt
		TIMES_PC_DEFEATED_VALA                      :  126, // Times beaten Vala into the dirt
		TIMES_PC_DEFEATED_VALA_AND_RAEPED           :  127, // Times beat AND raped vala
		ZETAZ_DEFEATED_AND_KILLED                   :  128, // Zetaz Killed
		ZETAZ_LAIR_TOOK_BONDAGE_STRAPS              :  129, // Bondage Straps Taken
		ZETAZ_LAIR_DEMON_VENDOR_PRESENT             :  130, // Sean Demon Vendor Here
		TIMES_EXPLORED_PLAINS                       :  131, // Times Explored Plains
		MET_BUNBUN                                  :  132, // Met Bunbun
		RAPHEAL_COUNTDOWN_TIMER                     :  133, // Raphael Countdown (Time till Quiksilver Fawkes.  Set to -1 betrayed, set to -2 if covered for.
		RAPHAEL_MET                                 :  134, // Raphael Met? (1 = Y)
		RAPHAEL_DRESS_TIMER                         :  135, // Dress TImer (Set when dress acquired, will proc event when dress is worn to bed or when counter is up (quiksilver fawkes!))
		REJECTED_RAPHAEL                            :  136, // Raphael Reject?
		RAPHAEL_RAPIER_TRANING                      :  137, // Raphael Rapier Training - OR? - Weapon strength post-newgame.
		RAPHAEL_INTELLIGENCE_TRAINING               :  138, // Raphael Intelligence Training
		RAPHAEL_DISGUSTED_BY_PC_APPEARANCE          :  139, // Raphael Disgusted by PC appearance
		RAPHAEL_SECOND_DATE                         :  140, // Raphael 2nd Date Happen?
		UNKNOWN_FLAG_NUMBER_00141                   : 141, // Hellhound Progression
		UNKNOWN_FLAG_NUMBER_00142                   : 142, // Can buy minotaur cum from goblins?
		UNKNOWN_FLAG_NUMBER_00143                   : 143, // How Many Times Have You Caught Urta + Scylla?
		UNKNOWN_FLAG_NUMBER_00144                   : 144, // Multitake Scylla meeting take advantage ever done?
		UNKNOWN_FLAG_NUMBER_00145                   : 145, // Urta confrontation about Scylla ever done?
		UNKNOWN_FLAG_NUMBER_00146                   : 146, // Urta drink toggle = 0 is same, 1 is more, -1 is less.
		UNKNOWN_FLAG_NUMBER_00147                   : 147, // Is Urta banned from Scylla?  1 = yes.
		UNKNOWN_FLAG_NUMBER_00148                   : 148, // Has Urta paid out Raphael's Bounty? (1 = yes)
		UNKNOWN_FLAG_NUMBER_00149                   : 149, // Did you bone Raphael?
		UNKNOWN_FLAG_NUMBER_00150                   : 150, // Dominika Stage - 0=unknown, 1=met, 2=received, -1=blocked
		UNKNOWN_FLAG_NUMBER_00151                   : 151, // Times Dominika Sucked off Smaller dicks
		UNKNOWN_FLAG_NUMBER_00152                   : 152, // Times Dominika sucked off bigger dicks
		UNKNOWN_FLAG_NUMBER_00153                   : 153, // Times received vaginal oral from fellatrix
		UNKNOWN_FLAG_NUMBER_00154                   : 154, // Has fellatrix been embarassed about your magic knowledge yet?
		UNKNOWN_FLAG_NUMBER_00155                   : 155, // Dominika learning cooldown
		UNKNOWN_FLAG_NUMBER_00156                   : 156, // Fellatrix - times sucked dogcock
		UNKNOWN_FLAG_NUMBER_00157                   : 157, // Fellatrix - Special followup happen? (1 = agree, 2 = eh, 3 disagree, add 3 for post-dream)
		AMILY_MET_AS                                :  158, // Amily remembers PC's gender at first meeting. Amily_Met_As:Int=158,
		AMILY_CONFESSED_LESBIAN                     :  159, //  1=yes,2=and accepted1=Yes,2=And Accepted
		AMILY_TIMES_FUCKED_FEMPC                    :  160, // 
		AMILY_HERM_TIMES_FUCKED_BY_FEMPC            :  161, // 
		PC_TIMES_BIRTHED_AMILYKIDS                  :  162, // Times PC has birthed Amily's brood - Pc_Times_Birthed_Amilykids:Int=162,
		PC_PENDING_PREGGERS                         :  163, //  1=yes,2=finished1=Yes,2=Finished
		AMILY_PC_GENDER                             :  164, // 
		AMILY_HERM_QUEST                            :  165, //  1=amily flipped out, 2=accepted as amily's dad1=Amily Flipped Out, 2=Accepted As Amily'S Dad
		AMILY_ALLOWS_FERTILITY                      :  166, // 
		LIFETIME_GYM_MEMBER                         :  167, // Permanent Gym Membership? (1 = yes)
		AMILY_CORRUPT_FLIPOUT                       :  168, // Amily flip out about corruption yet?
		UNKNOWN_FLAG_NUMBER_00169                   :  169, // Times cooked Amily's Drug
		UNKNOWN_FLAG_NUMBER_00170                   :  170, // Amily's Corruption Value
		AMILY_HAS_BALLS_AND_SIZE                    :  171, // Amily's Balls: 1 = yes, higher numbers = bigger balls.
		AMILY_VAGINAL_WETNESS                       :  172, // Amily's Wetness
		UNKNOWN_FLAG_NUMBER_00173                   :  173, // In camp amily warns you!  DUN DUN DUN! - Amily Freaked out about your corruption.	0=Not freaked out, 1=Freaked out
		UNKNOWN_FLAG_NUMBER_00174                   :  174, // Times Dominika Sucked off horsecocks
		UNKNOWN_FLAG_NUMBER_00175                   :  175, // Dominidrama - 1 = yes, 2 = no
		TIMES_HAD_YOGA                              :  176, // Cotton - TIMES HAD YOGA
		COTTON_MET_FUCKED                           :  177, // FUCKED - 0 = never met.  1 = met but not fucked. 2 = fucked
		UNKNOWN_FLAG_NUMBER_00178                   :  178, // Gym paid fees today?
		UNKNOWN_FLAG_NUMBER_00179                   :  179, // Met Jasun
		UNKNOWN_FLAG_NUMBER_00180                   :  180, // Times fucked Jasun
		UNKNOWN_FLAG_NUMBER_00181                   :  181, // Jasun name learned
		UNKNOWN_FLAG_NUMBER_00182                   :  182, // Gym Sex Machine Status (0 - not encountered, 1 = encountered, 2 = used.
		TIMES_USED_SEX_MACHINE_AS_MALE              :  183, //  Times Used Sex Machine As Male
		TIMES_USED_SEX_MACHINE_AS_FEMALE            :  184, //  Times Used Sex Machine As Female
		TIMES_USED_SEX_MACHINE_AS_EUNUCH            :  185, //  Times Used Sex Machine As Genderless
		TIMES_USED_SEX_MACHINE_AS_HERM              :  186, //  Times Used Sex Machine As Herm
		NEW_GAME_PLUS_BONUS_STORED_XP               :  187, //  New Game Plus - Stored XP
		NEW_GAME_PLUS_BONUS_STORED_ITEMS            :  188, //  New Game Plus - Stored Gems
		NEW_GAME_PLUS_BONUS_WEAPON_NAME             :  189, //  NG+ Weapon name
		NEW_GAME_PLUS_BONUS_WEAPON_VALUE            :  190, //  NG+ Weapon Value
		NEW_GAME_PLUS_BONUS_WEAPON_PERK             :  191, //  NG+ Weapon Perk
		NEW_GAME_PLUS_BONUS_WEAPON_VERB             :  192, //  NG+ Weapon Verb
		NEW_GAME_PLUS_BONUS_WEAPON_ATTACK           :  193, //  NG+ Weapon Attack
		NEW_GAME_PLUS_BONUS_ARMOR_NAME              :  194, //  NG+ Armor Name
		NEW_GAME_PLUS_BONUS_ARMOR_PERK              :  195, //  NG+ Armor Perk
		NEW_GAME_PLUS_BONUS_ARMOR_DEFENSE           :  196, //  NG+ ArmorDef
		NEW_GAME_PLUS_BONUS_ARMOR_VALUE             :  197, //  NG + Armor Value
		TEMP_STORAGE_PASTRY_NAME                    :  198, //  Holding pattern for pastry name
		TEMP_STORAGE_PASTRY_PRICE                   :  199, //  Holding pattern for price
		MINOTAUR_CUM_ECLAIR_UNLOCKED                :  200, //  Unlocked mino cum eclair
		TIMES_VISITED_BAKERY                        :  201, //  Times visited bakery
		TIMES_FUCKED_HECKEL_BLOWJOB                 :  202, //  Times Heckel BJ
		TIMES_FUCKED_HECKEL_ANAL                    :  203, //  Times Heckel Anal
		MET_HECKEL                                  :  204, //  Met Heckel
		MET_IFRIS                                   :  205, //  Met Ifris
		TIMES_FUCKED_IFRIS_BLOWJOB                  :  206, //  Ifris sucked?
		TIMES_FUCKED_IFRIS_LICKED                   :  207, //  Ifris licked?
		IFRIS_SHOWED_OFF                            :  208, //  Shown off for ifris
		HAVE_ENCOUNTERED_GNOLL_PLAINS               :  209, //  New gnoll met?
		BAZAAR_SLIPPERY_SQUEEZE_VISITED             :  210, //  Visited the Slippery Squeeze?
		BAZAAR_ENTERED                              :  211, //  Entered the bizarre bazaar?
		BAZAAR_ENCOUNTERED                          :  212, //  Found the bazaar previously?
		CINNABAR_HOUSE_VISITED                      :  213, //  -Been to Cinnabar's House?
		CINNABAR_NUMBER_ENCOUNTERS                  :  214, //  -CINNABAR Introduced?
		CINNABAR_NUMBER_TIMES_FUCKED                :  215, //  -CINNABAR Times Fucked
		CINNABAR_FUCKED_CORRUPT_PREVIOUSLY          :  216, //  -CINNABARWas last fuck corrupt fuck? - Cinnabar Hard Fucked.	0=No, 1=Yes
		UNKNOWN_FLAG_NUMBER_00217                   :  217, // Ceraph's genital stealing choice is stored here between functions
		UNKNOWN_FLAG_NUMBER_00218                   :  218, // Number of Dicks Ceraph owns
		UNKNOWN_FLAG_NUMBER_00219                   :  219, // Number of Pussies Ceraph owns
		UNKNOWN_FLAG_NUMBER_00220                   :  220, // Number of Tit's Ceraph owns
		UNKNOWN_FLAG_NUMBER_00221                   :  221, // -Met her?
		UNKNOWN_FLAG_NUMBER_00222                   :  222, // -Times Won Contest
		UNKNOWN_FLAG_NUMBER_00223                   :  223, // -Times Lost Contest
		UNKNOWN_FLAG_NUMBER_00224                   :  224, // -Who won contest last? (1 = pc, 2 = strahza)
		UNKNOWN_FLAG_NUMBER_00225                   :  225, // -How long has Strahza gone without sex?
		UNKNOWN_FLAG_NUMBER_00226                   :  226, // -Is PC losing the Roxanne's drinking contest intentionally?
		UNKNOWN_FLAG_NUMBER_00227                   :  227, // -Drinking Contest Bonus Score
		UNKNOWN_FLAG_NUMBER_00228                   :  228, // Diapause fluid store
		UNKNOWN_FLAG_NUMBER_00229                   :  229, // Diapause gain need displayed?
		UNKNOWN_FLAG_NUMBER_00230                   :  230, // Sharkgirls met? (Izma counter)
		IZMA_TIMES_FOUGHT_AND_WON                   :  231, // Izma fight
		UNKNOWN_FLAG_NUMBER_00232                   :  232, // Times Talked At shark pussy
		UNKNOWN_FLAG_NUMBER_00233                   :  233, // Izma worm scare (1 = Izma has been scared off by worms)
		BONUS_ITEM_AFTER_COMBAT_ID                  :  234, // Izma loot storage - Izma saved loot status
		UNKNOWN_FLAG_NUMBER_00235                   :  235, // Taken Izma gloves
		UNKNOWN_FLAG_NUMBER_00236                   :  236, // Izma + Amily Freakout Status = (-1 = done, 0 = nothing yet, 1 = queued for camp prog)
		UNKNOWN_FLAG_NUMBER_00237                   :  237, // Izma + Marble Freakout Status = (Above)
		UNKNOWN_FLAG_NUMBER_00238                   :  238, // Izma Follower Toggle (-1 = stay at lake, 0 = neutral, 1 = live in camp)
		UNKNOWN_FLAG_NUMBER_00239                   :  239, // Izma Talk level
		UNKNOWN_FLAG_NUMBER_00240                   :  240, // Mino Chef First Meeting Happen?
		UNKNOWN_FLAG_NUMBER_00241                   :  241, // mino explained what he needs yet?
		UNKNOWN_FLAG_NUMBER_00242                   :  242, // , 3 =stayed, 4 = epilogue'ed
		UNKNOWN_FLAG_NUMBER_00243                   :  243, // Counter for minotaur chef baker procs - Maddie present at bakery.	Mod%8=0, present
		COTTON_UNUSUAL_YOGA_BOOK_TRACKER            :  244, // Cotton Unusual Yoga Guidebook tracker
		COTTON_BREAKFAST_CLUB                       :  245, // Cotton Breakfast Club
		UNKNOWN_FLAG_NUMBER_00246                   :  246, // Tiger Tooth Countdown
		UNKNOWN_FLAG_NUMBER_00247                   :  247, // Genderless centaur madness
		UNKNOWN_FLAG_NUMBER_00248                   :  248, // Izma Preggers Discussion
		UNKNOWN_FLAG_NUMBER_00249                   :  249, // Pregnancy Enabled (1 = yes)
		IZMA_INCUBATION                             :  250, // Izma's Incubation timer
		IZMA_CHILDREN_SHARKGIRLS                    :  251, // Izma sharkgirls
		IZMA_CHILDREN_TIGERSHARKS                   :  252, // Izma tigersharks
		IZMA_TIME_TILL_NEW_BOOK_AVAILABLE           :  253, // Izma Nu Book Countdown
		UNKNOWN_FLAG_NUMBER_00254                   :  254, // Weapon Rack owned? (1 = yes)
		UNKNOWN_FLAG_NUMBER_00255                   :  255, // Armor Rack owned? (2 = yes) (Should this be 1=yes?)
		UNKNOWN_FLAG_NUMBER_00256                   :  256, // PC decided to approach Isabella's camp yet? 1
		UNKNOWN_FLAG_NUMBER_00257                   :  257, // Met Isabella?
		UNKNOWN_FLAG_NUMBER_00258                   :  258, // Is Isabella okay with tall folks?
		UNKNOWN_FLAG_NUMBER_00259                   :  259, // Has Isabella ever met the PC while PC is short?
		UNKNOWN_FLAG_NUMBER_00260                   :  260, // Isabella angry counter
		UNKNOWN_FLAG_NUMBER_00261                   :  261, // Isabella Sleep rape counter
		UNKNOWN_FLAG_NUMBER_00262                   :  262, // TImes talked with Isabella
		UNKNOWN_FLAG_NUMBER_00263                   :  263, // Met nancy
		UNKNOWN_FLAG_NUMBER_00264                   :  264, // Nancy relationship level
		UNKNOWN_FLAG_NUMBER_00265                   :  265, // Talk Nancy
		UNKNOWN_FLAG_NUMBER_00266                   :  266, // Times boned
		UNKNOWN_FLAG_NUMBER_00267                   :  267, // Lilium Timed Boned
		PLAYER_DISARMED_WEAPON_ID                   :  268, // weapon storage
		PLAYER_DISARMED_WEAPON_ATTACK               :  269, // weapon damage
		UNKNOWN_FLAG_NUMBER_00270                   :  270, // Times encountered spiderbitches
		FEMALE_SPIDERMORPH_PREGNANCY_INCUBATION     :  271, // Spider Preggo Timer
		UNKNOWN_FLAG_NUMBER_00272                   :  272, // Times Explored Swamp
		SHOW_SPRITES_FLAG                           :  273, // Sprites off? toggle
		RATHAZUL_SILK_ARMOR_COUNTDOWN               :  274, // Rathazul silk armor queue - 1 = armor done!
		UNKNOWN_FLAG_NUMBER_00275                   :  275, // Rathazul armor type selector - 1=armor, 2=robes
		UNKNOWN_FLAG_NUMBER_00276                   :  276, // Times Encountered Basilisk
		UNKNOWN_FLAG_NUMBER_00277                   :  277, // Times Encountered Drider
		UNKNOWN_FLAG_NUMBER_00278                   :  278, // LOTTIE DISABLED (1+ = YUS)
		UNKNOWN_FLAG_NUMBER_00279                   :  279, // LOTTIE FIGURE (HIGHER = SLIMMER)
		UNKNOWN_FLAG_NUMBER_00280                   :  280, // LOTTIE CONFIDENCE (HIGHER = AWESOMER)
		UNKNOWN_FLAG_NUMBER_00281                   :  281, // TIMES ENCOUNTERED LOTTIE
		UNKNOWN_FLAG_NUMBER_00282                   :  282, // Sophie Bimbo Follower?
		UNKNOWN_FLAG_NUMBER_00283                   :  283, // Sophie Disabled Forever
		TIMES_SOPHIE_HAS_DRUNK_OVI_ELIXIR           :  284, // Has Ovi Event Procced?
		UNKNOWN_FLAG_NUMBER_00285                   :  285, // Luststick Resistance builder - decrements by 1 every day, incremented by 1 for every 2 hours of luststick
		UNKNOWN_FLAG_NUMBER_00286                   :  286, // Have Ceraph's belly-button piercing
		UNKNOWN_FLAG_NUMBER_00287                   :  287, // Carrying Careph's token?
		CERAPH_HIDING_DICK                          :  288, // Ceraph Cock Hidden (1 = yes, 0 = cock floppin') - Ceraph's Demon Dong status 0=Visible, 1=Not visible
		UNKNOWN_FLAG_NUMBER_00289                   :  289, // Times Ceraph Licked You Out
		UNKNOWN_FLAG_NUMBER_00290                   :  290, // Punished Ceraph?
		UNKNOWN_FLAG_NUMBER_00291                   :  291, // Times Beaten Ceraph And Raped Her Without Losing
		UNKNOWN_FLAG_NUMBER_00292                   :  292, // Times listened in on demons
		UNKNOWN_FLAG_NUMBER_00293                   :  293, // Disabled Ceraph Faux Corruption - Ceraph Corruption Scene
		UNKNOWN_FLAG_NUMBER_00294                   :  294, // Times Done 'SWEETIE NO!' Ceraph Marble RP
		UNKNOWN_FLAG_NUMBER_00295                   :  295, // In Ceraph's SWEETIE NO!, is Utter Moo disabled?
		UNKNOWN_FLAG_NUMBER_00296                   :  296, // Ceraph Udder on or off? - Ceraph Has Udders.	0=No, 1=Yes
		UNKNOWN_FLAG_NUMBER_00297                   :  297, // Lottie love her bodY? (1 = yes)
		UNKNOWN_FLAG_NUMBER_00298                   :  298, // Lottie porked count? (1+ = yes)
		UNKNOWN_FLAG_NUMBER_00299                   :  299, // Lotties Trainer? (1 = yes)
		UNKNOWN_FLAG_NUMBER_00300                   :  300, // LOTTIE: Last encouragement state
		UNKNOWN_FLAG_NUMBER_00301                   :  301, // LOTTIE: encouragement go from 31-&gt,30 yet? (1 = yes)
		UNKNOWN_FLAG_NUMBER_00302                   :  302, // LOTTIE: Encouragement moved from 30 to 31 yet? (1 = yes)
		UNKNOWN_FLAG_NUMBER_00303                   :  303, // LOTTIE: Encouragement moved from 80 to 79 yet? (1 = yes)
		UNKNOWN_FLAG_NUMBER_00304                   :  304, // LOTTIE: Encouragement moved from 79 to 80 yet? (1=yes)
		SILLY_MODE_ENABLE_FLAG                      :  305, // SILLY MODE ON?
		UNKNOWN_FLAG_NUMBER_00306                   :  306, // LOTTIE: Need to talk about Oral?
		UNKNOWN_FLAG_NUMBER_00307                   :  307, // LOTTIE: Need to talk about Anal?
		UNKNOWN_FLAG_NUMBER_00308                   :  308, // LOTTIE: WEIGHT AT CONCLUSION OF LAST TALK EVENT
		UNKNOWN_FLAG_NUMBER_00309                   :  309, // LOTTIE: FATASS LOW SELF-ESTEEM SPECIAL EVENT TRIGGER YET? (1 = yes)
		UNKNOWN_FLAG_NUMBER_00310                   :  310, // LOTTIE: DOGGYSTYLE UNLOCKED? (1 = yes)
		UNKNOWN_FLAG_NUMBER_00311                   :  311, // LOTTIE: WALKIES UNLOCKED? (1 = yes)
		UNKNOWN_FLAG_NUMBER_00312                   :  312, // LOTTIE: LOVING FAT BITCH 1TIME EVENT TRIGGER? (1 = yes)
		UNKNOWN_FLAG_NUMBER_00313                   :  313, // LOTTIE: COWGIRL UNLOCKED? (1 = yes)
		UNKNOWN_FLAG_NUMBER_00314                   :  314, // LOTTIE: QUICKIE UNLOCKED (1 = yes)
		UNKNOWN_FLAG_NUMBER_00315                   :  315, // LOTTIE: CHARLOTTES WEB 1TIME HAPPEN (1 = yes)
		UNKNOWN_FLAG_NUMBER_00316                   :  316, // LOTTIE: THREESOME UNLOCKED (1 = yes)
		UNKNOWN_FLAG_NUMBER_00317                   :  317, // LOTTIE: ELLE NTR UNLOCKED (1 = yes)
		UNKNOWN_FLAG_NUMBER_00318                   :  318, // LOTTIE: MAX GOALS AND MAX LOVE REACHED (1 = yes)
		UNKNOWN_FLAG_NUMBER_00319                   :  319, // LOTTIE: FEMDOM UNLOCKED (1 = yes)
		UNKNOWN_FLAG_NUMBER_00320                   :  320, // LOTTIE: REVERSE COWGIRL UNLOCKED (1 = yes)
		UNKNOWN_FLAG_NUMBER_00321                   :  321, // LOTTIE: TImes given item
		UNKNOWN_FLAG_NUMBER_00322                   :  322, // LOTTIE: LA BOVA COUNTDOWN - counts down to 1 before she'll use it again.  Also used to track if LaBova has ever been used
		UNKNOWN_FLAG_NUMBER_00323                   :  323, // LOTTIE: HAS SHE USED REDUCTO?
		UNKNOWN_FLAG_NUMBER_00324                   :  324, // LOTTIE: HAM SAMMICH
		UNKNOWN_FLAG_NUMBER_00325                   :  325, // Times met minotaur mob
		UNKNOWN_FLAG_NUMBER_00326                   :  326, // Number of grown up minotaur offspring - TRIBE SIZE
		UNKNOWN_FLAG_NUMBER_00327                   :  327, // Number of minotaur sons pending growing up
		UNKNOWN_FLAG_NUMBER_00328                   :  328, // Grow up countdown
		UNKNOWN_FLAG_NUMBER_00329                   :  329, // Minos wasting a turn? (1 = yes)
		UNKNOWN_FLAG_NUMBER_00330                   :  330, // Cooldown on minotaur cum repeat messages
		UNKNOWN_FLAG_NUMBER_00331                   :  331, // Times Jojo Milked
		JOJO_COCK_MILKING_COOLDOWN                  :  332, // Jojo milk cooldown 4 hours
		UNKNOWN_FLAG_NUMBER_00333                   :  333, // Times PC been cock milked
		FAP_ARENA_SESSIONS                          :  334, // Times fap arena'ed
		FAP_ARENA_VICTORIES                         :  335, // Fap Arena victories
		AMILY_OFFERED_DEFURRY                       :  336, //  1 = Offered to defurry Amily
		AMILY_NOT_FURRY                             :  337, //  1 = Amily is no longer a flea-ridden furry who stinks up your carpet.
		AMILY_IS_BATMAN                             :  338, //  1 = You turned Amily into a human and then pissed all over her happy thoughts.  She now stalks you from rooftops while buying graphite helmets, utility belts, and a sweet, jetpowered car in the theme of a rat.
		FAP_ARENA_RULES_EXPLAINED                   :  339, // Fap Arena - rules been explaned?
		UNKNOWN_FLAG_NUMBER_00340                   :  340, // came in with minotaur cum
		KIHA_TOLL                                   :  341, // 
		KIHA_TOLL_DURATION                          :  342, // 
		TIMES_MET_KIHA                              :  343, // 
		KIHA_TALK_STAGE                             :  344, // 
		PC_WIN_LAST_KIHA_FIGHT                      :  345, // 
		AMILY_VISITING_URTA                         :  346, // AMILY_VISITING_URTA (1 = amily is gone, 2 = they fucked), (3 = DICK MODE) (4 = THREESOME MODE)
		AMILY_NEED_TO_FREAK_ABOUT_URTA              :  347, // AMILY_NEED_TO_FREAK_ABOUT_URTA (1= yes)
		UNKNOWN_FLAG_NUMBER_00348                   :  348, // Joey Big balls counter
		UNKNOWN_FLAG_NUMBER_00349                   :  349, // Times told joey to masturbate his big balls.
		UNKNOWN_FLAG_NUMBER_00350                   :  350, // Urta x Amily Urta followup needed?  (1 = cue Urta angst, 2 = done)
		TIMES_MET_SHOULDRA                          :  351, // 
		TIMES_BEATEN_SHOULDRA                       :  352, // 
		TIMES_POSSESSED_BY_SHOULDRA                 :  353, // 
		TIMED_SHARKGINAS                            :  354, // 
		TIMES_SHARKPENISED                          :  355, // 
		SHOULDRA_SLIME_PENOR_TIMES                  :  356, // 
		SHOULDRA_GENDERLESS_FUCK_COUNT              :  357, // 
		SHOULDRA_PENIS_DEFEAT_TIMES                 :  358, // 
		SHOULDRA_WORM_SCENE_COUNTER                 :  359, // 
		SHOULDRA_EXGARTUAN_SPIRIT_SEX_COUNT         :  360, // 
		SHOULDRA_VAGINAL_POSSESSIONS                :  361, // 
		SHOULDRA_HERMSEX_COUNT                      :  362, // 
		SHOULDRA_USES_YOUR_GIANT_COCK_COUNT         :  363, // 
		TIMES_MET_OOZE                              :  364, // 
		UNKNOWN_FLAG_NUMBER_00365                   :  365, // COUNTDOWN TILL MAIDEN FOLLOWUP
		UNKNOWN_FLAG_NUMBER_00366                   :  366, // TIMES MET GHOSTGIRL MAIDEN
		ISABELLA_TIMES_OFFERED_FOLLOWER             :  367, // 
		ISABELLA_AFFECTION                          :  368, // 
		ISABELLA_FOLLOWER_ACCEPTED                  :  369, // 
		ISABELLA_PLAINS_DISABLED                    :  370, // 
		ISABELLA_CAMP_DISABLED                      :  371, // 
		ISABELLA_ACCENT_TRAINING_PERCENT            :  372, // 
		ISABELLA_ACCENT_TRAINING_COOLDOWN           :  373, // 
		ISABELLA_ACCENT_FORCED_ON                   :  374, // 
		ISABELLA_MILKED_YET                         :  375, // 
		ISABELLA_BLOWJOBS_DISABLED                  :  376, // 
		ISABELLA_MORNING_FELLATIO_COUNT             :  377, // 
		ISABELLA_TIME_SINCE_LAST_HOTDOGGING         :  378, // 
		ISABELLA_TIMES_HOTDOGGED                    :  379, // 
		ISABELLA_MILK_COOLDOWN                      :  380, // 
		ISABELLA_MURBLE_BLEH                        :  381, // 
		ISABELLA_SPARRING_INTRO                     :  382, // 
		ISABELLA_PROBOVA_BURP_COUNT                 :  383, // 
		GOOGIRL_BIRTHS                              :  384, // 
		GOOGIRL_CONSECUTIVE_LOSSES                  :  385, // 
		DOMINIKA_TIMES_MULTICOCK_SLOBBERED          :  386, // 
		DOMINIKA_TIMES_HYPNO_BJ                     :  387, // 
		DOMINIKA_LAST_HYPNO_SUCK_COUNT              :  388, // 
		CERAPH_ROLEPLAY_AS_DOMINIKA_COUNT           :  389, // 
		HEL_TALKED_ABOUT_BERSERKING                 :  390, // 
		HEL_TALKED_ABOUT_HER                        :  391, // 
		HEL_TALKED_ABOUT_ATTACKING_YOU              :  392, // 
		HEL_FUCKBUDDY                               :  393, // 
		HEL_FUCK_COUNTER                            :  394, // 
		HEL_AFFECTION                               :  395, // 
		HEL_TIMES_ENCOUNTERED                       :  396, // 
		HEL_ISABELLA_THREESOME_ENABLED              :  397, // 
		KATHERINE_UNLOCKED                          :  398, // 
		KATHERINE_DICK_COUNT                        :  399, //
		KATHERINE_DICK_LENGTH                       :  400, //
		KATHERINE_KNOT_THICKNESS                    :  401, //
		KATHERINE_BALL_SIZE                         :  402, //
		KATHERINE_TIMES_SEXED                       :  403, //
		EDRYN_TIMES_HEL_THREESOMED                  :  404, // 
		HEL_EDRYN_OFFER                             :  405, // 
		ZETSUKO_MET                                 :  406, // 
		ROGAR_PHASE                                 :  407, // 
		ROGAR_DIRT                                  :  408, // 
		ROGAR_WARNING                               :  409, // 
		ROGAR_DISABLED                              :  410, // 
		ROGAR_FUCKED_TODAY                          :  411, // 
		UNKNOWN_FLAG_NUMBER_00412                   :  412, // IZMA_KIDS_IN_THE_WILD
		EXGARTUAN_TIGHTPANTS_MASTURBATE_COUNT       :  413, // 
		BOOBGARTUAN_SURPRISE_COUNT                  :  414, // 
		GOTTEN_INQUISITOR_ARMOR                     :  415, // 
		DOMINIKAS_SWORD_GIVEN                       :  416, // 
		HEL_FOXY_FOURSOME_WARNED                    :  417, // 
		HISTORY_PERK_SELECTED                       :  418, // HISTORY PERK SET - tail, fur, or scales.	0=Nothing
		AMILY_TIMES_BUTTFUCKED_PC                   :  419, // 
		TIMES_FUCKED_AMILYBUTT                      :  420, // 
		KIHA_AFFECTION_LEVEL                        :  421, // 
		KIHA_AFFECTION                              :  422, // 
		KIHA_CORRUPTION_BITCH                       :  423, // 
		KIHA_NEED_SPIDER_TEXT                       :  424, // 
		KIHA_AND_HEL_WHOOPIE                        :  425, // 
		KIHA_ADMITTED_WARM_FEELINZ                  :  426, // KIHA_CERVIXGINITY_TAKEN
		KIHA_MOVE_IN_OFFER                          :  427, // 
		KIHA_FOLLOWER                               :  428, // 
		KIHA_NEEDS_TO_REACT_TO_HORSECOCKING         :  429, // 
		KIHA_CERVIXGINITY_TAKEN                     :  430, // 
		KIHA_HORSECOCK_FUCKED                       :  431, // 
		KIHA_CHOKED_OUT_PC                          :  432, // 
		VALA_CUMBATH_TIMES                          :  433, // 
		TIMES_AMILY_AND_JOJO_PLAYED_TIMES           :  434, // 
		AMILY_X_JOJO_COOLDOWN                       :  435, // 
		AMILY_INCEST_COUNTDOWN_TIMER                :  436, // 1 = timer started, 30 days = RIPE FOR INCEST
		YVONNE_FUCK_COUNTER                         :  437, // 
		TIMES_CERAPH_PORTAL_FUCKED                  :  438, // 
		IZMA_NO_COCK                                :  439, // 
		ASKED_IZMA_ABOUT_WANG_REMOVAL               :  440, // 
		SALON_PAID                                  :  441, // 
		URTA_FAMILY_TALK_ATTEMPTS                   :  442, // 
		URTA_OPEN_ABOUT_EDRYN                       :  443, // 
		PC_DISLIKES_URTA_AND_EDRYN_TOGETHER         :  444, // 
		DISCUSSED_URTA_ALCOHOLISM                   :  445, // 
		MET_NIAMH                                   :  446, // 
		GOT_NIAMH_BEER                              :  447, // 
		TALKED_NIAMH                                :  448, // 
		NIAMH_MOVED_OUT_COUNTER                     :  449, // 
		NIAMH_STATUS                                :  450, // 
		NIAMH_SEAN_BREW_BIMBO_LIQUEUR_COUNTER       :  451, // NIAMH_SEAN_BREW_BIMBO_LIQUEUR_COUNTER" Description="1 = ready!
		TIMES_NIAMH_BAZAAR_MET                      :  452, // 
		TIMES_MET_ANEMONE                           :  453, // 
		ANEMONE_KID                                 :  454, // 
		KID_ITEM_FIND_HOURS                         :  455, // 
		ANEMONE_WATCH                               :  456, // 
		ANEMONE_WEAPON_ID                           :  457, //
		MURBLE_FARM_TALK_LEVELS                     :  458, // 
		BROKE_UP_WITH_MARBLE                        :  459, // 
		MARBLE_PLAYED_WITH_KIDS_TODAY               :  460, // 
		MARBLE_CAMPTALK_LEVEL                       :  461, // 
		MARBLE_TELADRE_STORY                        :  462, // 
		MARBLE_WARNING                              :  463, // 
		FARM_DISABLED                               :  464, // 
		MARBLE_BOVA_LEVEL                           :  465, // 
		JOEY_OFFERED_MILKER                         :  466, // 
		ANTS_PC_FAILED_PHYLLA                       :  467, // 
		ANT_COLONY_KEPT_HIDDEN                      :  468, // 
		PC_READY_FOR_ANT_COLONY_CHALLENGE           :  469, // 
		PHYLLA_SAVED                                :  470, // 
		MET_ANT_ARENA                               :  471, // 
		ANT_ARENA_WINS                              :  472, // 
		ANT_ARENA_LOSSES                            :  473, // 
		ANTS_PC_BEAT_GNOLL                          :  474, // 
		ANTS_PC_LOST_TO_GNOLL                       :  475, // 
		MET_ANT_ARENA_GNOLL                         :  476, // 
		FOX_BAD_END_WARNING                         :  477, // 
		HEL_AFFECTION_FOLLOWER                      :  478, // 
		HEL_FOLLOWER_LEVEL                          :  479, // 
		TOOK_GOO_ARMOR                              :  480, // 
		LOST_GOO_ARMOR_FIGHT                        :  481, // 
		WON_GOO_ARMOR_FIGHT                         :  482, // 
		HEL_REDUCED_ENCOUNTER_RATE                  :  483, // 
		MET_VALERIA                                 :  484, // 
		HEL_HARPIES_DEFEATED                        :  485, // 
		HEL_DUNGEON_MEAD_LOOTED                     :  486, // 
		HEL_BRIGID_DEFEATED                         :  487, // 
		HEL_PC_TALKED_WITH_HAKON                    :  488, // 
		HEL_DUNGEON_TAKEN_WHIP                      :  489, // 
		HEL_DUNGEON_TAKEN_STRAPS                    :  490, // 
		HEL_DUNGEON_TAKEN_DAGGER                    :  491, // 
		HEL_PHOENIXES_DEFEATED                      :  492, // 
		HEL_HARPY_QUEEN_DEFEATED                    :  493, // 
		HARPY_QUEEN_EXECUTED                        :  494, // HARPY_QUEEN_EXECUTED" Description="-1 = RELEASED, 1 = KILLED
		HEL_KNOWS_ABOUT_HAKON                       :  495, // 
		FOUGHT_WITH_HEL_IN_DUNGEON                  :  496, // 
		TOOK_QUEEN_STAFF                            :  497, // 
		VALARIA_AT_CAMP                             :  498, // 
		VELARIA_FUTA                                :  499, // 
		DECLINED_TO_VISIT_REBECCS_VILLAGE           :  500, // 
		TIMES_IN_DEMON_PIT                          :  501, // 
		TIMES_REFUSED_REBECCS_OFFER                 :  502, // 
		OWCAS_ATTITUDE                              :  503, // 
		VAPULA_SUBMISSIVENESS                       :  504, // 
		DAYS_SINCE_LAST_DEMON_DEALINGS              :  505, // 
		OWCA_UNLOCKED                               :  506, // 
		REBECCS_LAST_PLEA                           :  507, // 
		OWCA_ANGER_DISABLED                         :  508, // 
		SLIMEGINAED                                 :  509, // 
		GHOST_GIRL_SLIME_X_SHOULDRA_COUNTER         :  510, // 
		GENDERLESS_MASTURBATION_WITH_GHOST_COUNT    :  511, // 
		SHOULDRA_TONGUE_LICKS_TIMES                 :  512, // 
		SHOULDRA_FOLLOWER_STATE                     :  513, // 
		SHOULDRA_PLOT_LEVEL                         :  514, // 
		SHOULDRA_TALK_NEEDED                        :  515, // 
		SHOULDRA_PLOT_COUNTDOWN                     :  516, // 
		SHOULDRA_SLEEP_TIMER                        :  517, // 
		SHOULDRA_MAGIC_COOLDOWN                     :  518, // 
		SHOULDRA_TIMES_NIGHT_RAPED_PC               :  519, // 
		SHOULDRA_EXGARTUDRAMA                       :  520, // 
		SHOULDRA_BAKERY_TIMES                       :  521, // 
		PUMPKIN_FUCK_YEAR_DONE                      :  522, // 
		EMBER_AFFECTION                             :  523, // : Pretty obvious
		EMBER_HATCHED                               :  524, // : is ember hatched? 1 = true
		EMBER_GENDER                                :  525, //  1 for male, 2 for female, 3 for herm. This also controls the egg's shell color.
		EMBER_TYPE                                  :  526, // numerical value: Ember is supposed to have many forms, this will control which one is born. (This is important for when Ember has hybrid forms.)
		EMBER_COR                                   :  527, // dragon-girl Ember uses this. (Default starting value = 50)
		EMBER_HAIR                                  :  528, // 0 for no hair, 1 for hair, 2 for mane.
		EMBER_MILK                                  :  529, // 0 for no lactation, 1 for lactating.
		EMBER_OVIPOSITION                           :  530, // 0 for no egg laying, 1 for egg laying.
		EMBER_ROUNDFACE                             :  531, // 0 for anthro Ember, 1 for dragon-girl Ember. (You might want to control this with the Type flag since only default Embers use this variable.)
		EMBER_EGG_FLUID_COUNT                       :  532, // This controls when it's time to hatch. Every item use and every time you use the egg as a masturbation aid, this will be incremented. Threshold for birthing is 5, but the birthing process can only be triggered when using as a masturbatory aid. This is done to allow players the chance to modify Ember before actually hatching.
		EMBER_STAT                                  :  533, // All Embers have a hidden stat, Corrupt has Ego, Pure has Confidence, Tainted has Affection, and hybrids vary. There is a need to track this, but only 1 special stat for every Ember.
		EMBER_INTERNAL_DICK                         :  534, // Dragon-girl Ember can have either a internal sheath to keep " + emberMF("his","her") + " dick in or have it be more human-like. 0 = internal, 1 = external.
		TIMES_EQUIPPED_EMBER_SHIELD                 :  535, // 
		TOOK_EMBER_EGG                              :  536, // PC Take ember's egg home?
		EGG_BROKEN                                  :  537, // PC Smash!? ember's egg?
		TIMES_FOUND_EMBERS_EGG                      :  538, // Times stumbled into ze egg.
		EMBER_JACKED_ON                             :  539, // Has the PC masturbated on the egg yet?  Needed to hatcH!
		EMBER_OVI_BITCHED_YET                       :  540, // Used to trigger emberBitchesAboutPCBeingFullOfEggs()
		EMBER_LUST_BITCHING_COUNTER                 :  541, // 
		EMBER_CURRENTLY_FREAKING_ABOUT_MINOCUM      :  542, //  Used to trigger minotaurJizzFreakout()
		DRANK_EMBER_BLOOD_TODAY                     :  543, // Cooldown for ember TFs
		EMBER_PUSSY_FUCK_COUNT                      :  544, // 
		TIMES_BUTTFUCKED_EMBER                      :  545, // 
		VAPULA_HAREM_FUCK                           :  546, // 
		VAPULA_THREESOMES                           :  547, // 
		OWCA_SACRIFICE_DISABLED                     :  548, // 
		VAPULA_FOLLOWER                             :  549, // 
		JOJO_MOVE_IN_DISABLED                       :  550, // 
		VAPULA_DAYS_SINCE_FED                       :  551, // 
		VAPULA_TEASE_COUNT                          :  552, // 
		EMBER_INCUBATION                            :  553, // 
		EMBER_CHILDREN_MALES                        :  554, // 
		EMBER_CHILDREN_FEMALES                      :  555, // 
		EMBER_CHILDREN_HERMS                        :  556, // 
		EMBER_EGGS                                  :  557, // 
		EMBER_BITCHES_ABOUT_PREGNANT_PC             :  558, // 
		EMBER_TALKS_TO_PC_ABOUT_PC_MOTHERING_DRAGONS:  559, // 
		EMBER_PREGNANT_TALK                         :  560, // 
		TIMES_MET_CHAMELEON                         :  561, // 
		TIMES_IN_BENOITS                            :  562, // 
		BENOIT_AFFECTION                            :  563, // 
		BENOIT_EXPLAINED_SHOP                       :  564, // 
		BENOIT_SUGGEST_UNLOCKED                     :  565, // 
		TURKEY_FUCK_YEAR_DONE                       :  566, // 
		BENOIT_1                                    :  567, // 
		BENOIT_2                                    :  568, // 
		BENOIT_3                                    :  569, // 
		BENOIT_TALKED_TODAY                         :  570, // 
		BENOIT_TALKED_TO_PROPERLY                   :  571, // 
		BENOIT_EGGS                                 :  572, // 
		BENOIT_TIMES_SEXED_FEMPCS                   :  573, // 
		BENOIT_BIRTH_DELAY                          :  574, // 
		BENOIT_WOMB_TALK_UNLOCKED                   :  575, // 
		BENOIT_POST_FIRSTFUCK_TALK                  :  576, // 
		BENOIT_TESTED_BASILISK_WOMB                 :  577, // 
		TIMES_ENCOUNTERED_SAND_TRAPS                :  578, // 
		SANDTRAP_NAGA_3SOME                         :  579, // 
		TAMANI_TIME_OUT                             :  580, // 
		TIMES_OVIPOSITED_TAMANI                     :  581, // 
		URTA_EGGS                                   :  582, // 
		URTA_FERTILE_EGGS                           :  583, // 
		URTA_EGG_FORCE_EVENT                        :  584, // 
		URTA_TIMES_EGG_PREGGED                      :  585, // 
		URTA_PREGNANCY_TYPE                         :  586, //Previously URTA_EGG_INCUBATION
		URTA_FLATBELLY_NOTICE                       :  587, // 
		EGG_WITCH_COUNTER                           :  588, // 
		EGG_WITCH_TYPE                              :  589, // 
		TIMES_EGGED_JOJO                            :  590, // 
		JOJO_EGGCUBATE_COUNT                        :  591, // 
		DICK_EGG_INCUBATION                         :  592, // 
		TIMES_EGGED_IN_COCK                         :  593, // 
		TIMES_FUCKED_FLOWER                         :  594, // 
		TIMES_RIDDEN_FLOWER                         :  595, // 
		FUCK_FLOWER_LEVEL                           :  596, // 
		FUCK_FLOWER_GROWTH_COUNTER                  :  597, // 
		FUCK_FLOWER_KILLED                          :  598, // 
		AMILY_TREE_FLIPOUT                          :  599, // 
		HOLLI_FRUIT                                 :  600, // 
		HOLLI_FRUIT_EXPLAINED                       :  601, // 
		HOLLI_DEFENSE_ON                            :  602, // 
		SATYR_KIDS                                  :  603, // 
		RUBI_AFFECTION                              :  604, // 
		RUBI_DISABLED                               :  605, // 
		RUBI_ADMITTED_GENDER                        :  606, // 
		RUBI_INTRODUCED                             :  607, // 
		RUBI_BLU_BALLS                              :  608, // 
		RUBI_ORGASM_DENIAL                          :  609, // 
		RUBI_BIMBO                                  :  610, // 
		RUBI_INCUBUS_PROGRESS                       :  611, // 
		RUBI_SUITCLOTHES                            :  612, // 
		RUBI_FETISH_CLOTHES                         :  613, // 
		RUBI_GREEN_ADVENTURER                       :  614, // 
		RUBI_TUBE_TOP                               :  615, // 
		RUBI_BODYSUIT                               :  616, // 
		RUBI_LONGDRESS                              :  617, // 
		RUBI_TIGHT_PANTS                            :  618, // 
		RUBI_NURSE_CLOTHES                          :  619, // 
		RUBI_SWIMWEAR                               :  620, // 
		RUBI_PROSTITUTION                           :  621, // -1 dont see others, -2 = broke up, 1 = NTR okay, 2 = prostitute
		RUBIS_HOUSE_FIRST_TIME                      :  622, // 
		RUBI_GOT_BIMBO_SKIRT                        :  623, // 
		RUBI_PROFIT                                 :  624, // 
		RUBI_BIMBO_MINIDRESS                        :  625, // 
		MANSION_VISITED                             :  626, // 
		redheadIsFuta                               :  627, // 
		MET_KITSUNES                                :  628, // 
		AMILY_OVIPOSITED_COUNT                      :  629, // 
		AMILY_OVIPOSITED_COUNTDOWN                  :  630, // 
		AMILY_OVIPOSITION_UNLOCKED                  :  631, // 
		BENOIT_GENERIC_EGGS                         :  632, // 
		URTA_SCYLLA_BIG_DICK_TIMES_DONE             :  633, // 
		VAPULA_EARNED_A_SPANK                       :  634, // 
		AMILY_TIMES_SWIMFUCKED                      :  635, // 
		AMILY_OWNS_BIKINI                           :  636, // 
		CANDY_CANE_YEAR_MET                         :  637, // 
		GATS_ANGEL_GOOD_ENDED                       :  638, // 
		GATS_ANGEL_DISABLED                         :  639, // 
		GATS_ANGEL_QUEST_BEGAN                      :  640, // 
		GATS_ANGEL_TIME_TO_FIND_KEY                 :  641, // 
		XMAS_CHICKEN_YEAR                           :  642, // 
		KAMI_ENCOUNTER                              :  643, // 
		POLAR_PETE_YEAR_MET                         :  644, // 
		JACK_FROST_YEAR                             :  645, // 
		JACK_FROST_PROGRESS                         :  646, // 
		NIEVE_STAGE                                 :  647, // 
		NIEVE_GENDER                                :  648, // 
		NIEVE_MOUTH                                 :  649, // 
		TIMES_LOST_HECKEL_DOM_CHALLENGE             :  650, // 
		TIMES_DOMMED_HECKEL                         :  651, // 
		TIMES_MET_CHICKEN_HARPY                     :  652, // 
		EGGS_BOUGHT                                 :  653, // 
		GOO_TFED_MEAN                               :  654, // 
		GOO_TFED_NICE                               :  655, // 
		GOO_NAME                                    :  656, // 
		GOO_SLAVE_RECRUITED                         :  657, // 
		GOO_EYES                                    :  658, // 
		GOO_TOSSED_AFTER_NAMING                     :  659, // 
		TIMES_FUCKED_NORMAL_GOOS                    :  660, // 
		PC_KNOWS_ABOUT_BLACK_EGGS                   :  661, // 
		GOO_HAPPINESS                               :  662, // 
		GOO_OBEDIENCE                               :  663, // 
		GOO_FLUID_AMOUNT                            :  664, // 
		GOO_PREFERRED_TIT_SIZE                      :  665, // 
		GOO_NIPPLE_TYPE                             :  666, // 
		GOO_DICK_LENGTH                             :  667, // 
		GOO_DICK_TYPE                               :  668, // 
		TIMES_THOUGHT_ABOUT_GOO_RECRUITMENT         :  669, // 
		GOO_INDIRECT_FED                            :  670, // 
		TIMES_FED_LATEXY_MINO_CUM                   :  671, // 
		LATEX_GOO_TIMES_FEMDOMMED_BY_PC             :  672, // 
		COTTON_PREGNANCY_INCUBATION                 :  673, // 
		COTTON_PREGNANCY_TYPE                       :  674, // 
		COTTON_KID_COUNT                            :  675, // 
		COTTON_OLDEST_KID_AGE                       :  676, // 
		PC_IS_A_DEADBEAT_COTTON_DAD                 :  677, // 
		PC_IS_A_GOOD_COTTON_DAD                     :  678, // 
		COTTON_HERBS_OFF                            :  679, // 
		COTTON_CONTRACEPTION_TALK                   :  680, // 
		COTTON_KNOCKED_UP_PC_AND_TALK_HAPPENED      :  681, // 
		HOLLI_SUBMISSIVE                            :  682, // 
		TIMES_ORPHANAGED_WITH_RAPHAEL               :  683, // 
		LOPPE_FURRY                                 :  684, // 
		LOPPE_FERTILE                               :  685, // 
		LOPPE_KIDS                                  :  686, // 
		LOPPE_TRAINING                              :  687, // 
		LOPPE_KIDS_LIMIT                            :  688, // 
		LOPPE_URTA_CHATS                            :  689, // 
		LOPPE_PC_MET_UMA                            :  690, // 
		LOPPE_TIMES_SEXED                           :  691, // 
		LOPPE_DENIAL_COUNTER                        :  692, // 
		LOPPE_DISABLED                              :  693, // 
		TIMES_ASKED_LOPPE_ABOUT_LOPPE               :  694, // 
		LOPPE_MET                                   :  695, // 
		HELIA_FOLLOWER_DISABLED                     :  696, // 
		HEL_INTROS_LEVEL                            :  697, // 
		MINO_SONS_HAVE_SOPHIE                       :  698, // 
		KEEP_HELIA_AND_SOPHIE                       :  699, // 
		FOLLOWER_HEL_TALKS                          :  700, //  FOLLOWER_HEL_TALKS
		SLEEP_WITH                                  :  701, //  related to who you sleep with in camp
		COTTON_OLDEST_KID_GENDER                    :  702, // 
		HEL_CAN_SWIM                                :  703, // 
		HEL_GUARDING                                :  704, // 
		PC_PROMISED_HEL_MONOGAMY_FUCKS              :  705, // 
		HEL_RAPED_TODAY                             :  706, // 
		FOUND_ISABELLA_AT_FARM_TODAY                :  707, // 
		KITSUNE_SHRINE_VISIT                        :  708, // 
		TOOK_KITSUNE_STATUE                         :  709, // 
		URTA_MET_HEL                                :  710, // 
		URTA_QUEST_STATUS                           :  711, // 
		URTA_FUCKED_HEL                             :  712, // 
		SUCCUBI_MILKED_GNOLL_PRINCESS               :  713, // 
		URTA_TAKEN_BY_GNOLLS                        :  714, // 
		URTA_BECOMES_SNAKE_SLAVE                    :  715, // 
		URTA_GOBLIN_SLAVE                           :  716, // 
		URTA_TENTACLE_RAPED                         :  717, // 
		URTA_TENTACLE_GAPED                         :  718, // 
		URTA_IS_VULQUINE_MENACE                     :  719, // 
		URTA_RAPED_MINO_LORD                        :  720, // 
		URTA_MINO_AND_SUCCUBI_SLAVE                 :  721, // 
		EDRYN_PREGNANCY_TYPE                        :  722, //In previous versions was EDRYN_BIRF_COUNTDOWN - Corrected in Saves.unFuckSave()
		URTA_FERTILE                                :  723, // 
		URTA_PREG_EVERYBODY                         :  724, // 
		KELT_BREAK_LEVEL                            :  725, // 
		KELLY_CUNT_TYPE                             :  726, // 
		NEVER_RESIST_KELT                           :  727, // 
		WHITNEY_FLIPPED_OUT_OVER_KELLY              :  728, // 
		TIMES_PUNISHED_KELLY                        :  729, // 
		TIMES_RIM_JOBBED_BY_KELLY                   :  730, // 
		TIMES_RIDDEN_KELLY_FOR_PUNISHMENT           :  731, // 
		KELLY_BONUS_TIT_ROWS                        :  732, // 
		KELLY_LACTATING                             :  733, // 
		KELLY_DISOBEYING_COUNTER                    :  734, // 
		KELLY_VAGINALLY_FUCKED_COUNT                :  735, // 
		VALENTINES_EVENT_YEAR                       :  736, // 
		SOPHIE_HEAT_COUNTER                         :  737, // 
		SOPHIE_INCUBATION                           :  738, // 
		SOPHIE_BROACHED_SLEEP_WITH                  :  739, // 
		SOPHIE_ADULT_KID_COUNT                      :  740, // 
		SOPHIE_DAUGHTER_MATURITY_COUNTER            :  741, // 
		SOPHIE_CAMP_EGG_COUNTDOWN                   :  742, // 
		SOPHIE_FAMILY_INCEST                        :  743, // 
		RATHAZUL_DEBIMBO_OFFERED                    :  744, // 
		SOPHIE_DEBIMBOED                            :  745, // 
		SOPHIES_DAUGHTERS_DEBIMBOED                 :  746, // 
		SOPHIE_RECRUITED_PURE                       :  747, // 
		SOPHIE_FOLLOWER_IRRITATION                  :  748, // 
		TIMES_MORNING_SOPHIE_FEMDOMMED              :  749, // 
		DAUGHTER_ONE_BIMBO                          :  750, // 
		DAUGHTER_TWO_BIMBO                          :  751, // 
		DAUGHTER_THREE_BIMBO                        :  752, // 
		DAUGHTER_FOUR_BIMBO                         :  753, // 
		NO_PURE_SOPHIE_RECRUITMENT                  :  754, // 
		SOPHIE_FOLLOWER_PROGRESS                    :  755, // 
		KID_A_XP                                    :  756, // 
		KID_SITTER                                  :  757, // 0 = no sitter, 1 = possible, 2 = doing dat shit
		HAD_KID_A_DREAM                             :  758, // 
		CUSTOM_PC_ENABLED                           :  759, //No longer in use
		SHEILA_CORRUPTION                           :  760, // 
		SHEILA_XP                                   :  761, // 
		SHEILA_PREGNANCY_INCUBATION                 :  762, //Previously SHEILA_PREG
		SHEILA_JOEYS                                :  763, // 
		SHEILA_DEMON                                :  764, // 
		SHEILA_CITE                                 :  765, // 
		SHOULDRA_MET_VALA                           :  766, // 
		TIMES_VALA_CONSENSUAL_BIG                   :  767, // 
		TIMES_VAPULA_AND_GIANT_VALA                 :  768, // 
		BIKINI_ARMOR_BONUS                          :  769, // 
		OWN_MAIDEN_BIKINI                           :  770, // 
		AMILY_X_IZMA_POTION_3SOME                   :  771, // 
		MET_ESSY                                    :  772, // 
		TURNED_DOWN_ESSY_FIRST_MEETING              :  773, // 
		ACCEPTED_ESSY_FIRST_MEETING                 :  774, // 
		GIVEN_AMILY_NURSE_OUTFIT                    :  775, // 
		TIMES_EATEN_EDRYN_PUSSY_RUT                 :  776, // 
		MET_OTTERGIRL                               :  777, // 
		TIMES_SOLO_FED_NUN                          :  778, // 
		FED_SCYLLA_TODAY                            :  779, // 
		TIMES_SOPHIE_AND_IZMA_FUCKED                :  780, // 
		TOLD_SOPHIE_TO_IZMA                         :  781, // 
		URTA_CUM_NO_CUM_DAYS                        :  782, // 
		URTA_X_RAPHAEL_HAPPENED                     :  783, // 
		IZMA_X_LATEXY_DISABLED                      :  784, // 
		TIMES_IZMA_DOMMED_LATEXY                    :  785, // 
		TIMES_HELIA_DOUBLE_DONGED                   :  786, // 
		EVER_INFESTED                               :  787, // 
		CAME_WORMS_AFTER_COMBAT                     :  788, // 
		URTA_INCUBATION                             :  789, // 
		URTA_TIMES_BIRTHED                          :  790, // 
		URTA_TIMES_PC_BIRTHED                       :  791, // 
		URTA_KIDS_MALES                             :  792, // 
		URTA_KIDS_FEMALES                           :  793, // 
		URTA_KIDS_HERMS                             :  794, // 
		URTA_FIRSTBORN_GENDER                       :  795, // 
		URTA_FIRSTBORN_COCKTYPE                     :  796, // 
		URTA_LATESTBORN_GENDER                      :  797, // 
		URTA_LATESTBORN_COCKTYPE                    :  798, // 
		NEED_URTA_LETTER                            :  799, // 
		EVENT_PARSER_ESCAPE                         :  800, // 
		URTA_INCUBATION_CELEBRATION                 :  801, // 
		URTA_PREGNANT_DELIVERY_SCENE                :  802, // 
		TIMES_MASSAGED_URTA_BELLY                   :  803, // 
		TIMES_URTA_BOOB_WORSHIPPED                  :  804, // 
		TIMES_NURSED_FROM_URTA                      :  805, // 
		URTA_LUNCH_PLAY                             :  806, // 
		LIANNA_HAVESTED_MALES                       :  807, // 
		LIANNA_HAVESTED_LADIES                      :  808, // 
		FIRST_TIME_AT_URTA_HOUSE                    :  809, // 
		NEW_BABY_ANNOUNCED                          :  810, // 
		DISCUSSED_LUBE_SPRAY                        :  811, // 
		SANDTRAP_LOSS_REPEATS                       :  812, // 
		MINERVA_LOVE                                :  813, // 
		MINERVA_BACKSTORY                           :  814, // 
		MINERVA_BACKSTORY_LEARNED                   :  815, // 
		TIMES_MINERVA_SEXED                         :  816, // 
		TIMES_BUTTFUCKED_MINERVA                    :  817, // 
		TIMES_MINERVA_COWGIRLED                     :  818, // 
		TIMES_MINERVA_LAPSEXED                      :  819, // 
		MINERVA_LEZZES_OUT                          :  820, // 
		MET_MINERVA                                 :  821, // 
		MET_OLIVIA                                  :  822, // 
		LAST_EASTER_YEAR                            :  823, // 
		TIMES_EMBER_LUSTY_FUCKED                    :  824, // 
		GAR_NAME                                    :  825, // 
		GAR_CONFIDENCE                              :  826, // 
		RITUAL_INTRO                                :  827, // 
		KINKY_RITUALS_SPOKEN                        :  828, // 
		GAR_HISTORY                                 :  829, // 
		GAR_CATHEDRAL                               :  830, // 
		GAR_NAME_TALKS                              :  831, // 
		TIMES_RUBI_MASSAGED                         :  832, // 
		SANURA_DISABLED                             :  833, // 
		MET_SANURA                                  :  834, // 
		BEATEN_SANURA_COUNT                         :  835, // 
		SANDWITCH_MOB_DEFEATED                      :  836, // 
		SANDWITCH_THRONE_UNLOCKED                   :  837, // 
		SAND_WITCHES_FRIENDLY                       :  838, // 
		CUM_WITCH_DEFEATED                          :  839, // 
		ENTERED_SANDWITCH_DUNGEON                   :  840, // 
		PAWJOBS                                     :  841, // 
		RIDDLE_ONE                                  :  842, // 
		RIDDLE_TWO                                  :  843, // 
		RIDDLE_THREE                                :  844, // 
		TIMES_SUBMITTED_TO_SANURA                   :  845, // 
		TIMES_WINFUCKED_SANURA                      :  846, // 
		SAND_MOTHER_DEFEATED                        :  847, // 
		TIMES_TENTACLED_SAND_MOTHER                 :  848, // 
		SAND_WITCHES_COWED                          :  849, // 
		SAND_WITCH_LOOT_TAKEN                       :  850, // 
		TIMES_FRIENDLY_FUCKED_SAND_MOTHER           :  851, // 
		MORE_CUM_WITCHES                            :  852, // 
		CUM_WITCHES_FIGHTABLE                       :  853, // 
		SAND_WITCH_LEAVE_ME_ALONE                   :  854, // 
		BEEN_BLESSED_BY_CUM_WITCH                   :  855, // 
		DISCOVERED_WITCH_DUNGEON                    :  856, // 
		URTA_PETPLAY_DONE                           :  857, // 
		SHEILA_CLOCK                                :  858, // 
		SHEILA_IMPS                                 :  859, // 
		TIMES_VISITED_MALI                          :  860, // 
		TIMES_BEEN_TO_LIBRARY                       :  861, // 
		MALI_TAKEN_BLADE                            :  862, // 
		ESSRAYLE_ESCAPED_DUNGEON                    :  863, // 
		TOLD_MOTHER_TO_RELEASE_ESSY                 :  864, // 
		ESSY_DUNGEON_FUCKED                         :  865, // 
		ESSY_MET_IN_DUNGEON                         :  866, // 
		DOUBLE_ATTACK_STYLE                         :  867, // DOUBLE_ATTACK_STYLE" Description="0 = always, 1 = dynamic, 2 = single
		SPELLS_CAST                                 :  868, // 
		MILK_NAME                                   :  869, // 
		MILK_SIZE                                   :  870, // 
		MET_MILK_SLAVE                              :  871, // 
		COUNTDOWN_TO_NIGHT_RAPE                     :  872, // 
		PHYLLA_CAPACITY                             :  873, // 
		ANT_KIDS                                    :  874, // 
		ANT_WAIFU                                   :  875, // 
		PHYLLA_STAY_HOME                            :  876, // 
		PHYLLA_CAMP_VISITS                          :  877, // 
		DAYS_PHYLLA_IN_CAMP                         :  878, // 
		PHYLLA_EGG_LAYING                           :  879, // PHYLLLA_EGG_LAYING
		PHYLLA_BLOWJOBS                             :  880, // 
		TALKED_WITH_PHYLLA_ABOUT_HISTORY            :  881, // 
		TIMES_LINKED_BJ_SUCK                        :  882, // 
		PHYLLA_FUCKS                                :  883, // 
		TIMES_CORRUPT_MALE_ANT_ORGY                 :  884, // 
		TIMES_CORRUPT_FEMALE_ANT_ORGY               :  885, // 
		PHYLLA_TIMES_DRIDER_EGG_LAYED               :  886, // 
		DAYS_PHYLLA_HAS_SPENT_BIRTHING              :  887, // 
		ANTS_BIRTHED_FROM_LICKING                   :  888, // 
		PHYLLA_COOLDOWN                             :  889, // 
		TIMES_EGG_IMPREGNATING_PHYLLA               :  890, // 
		PHYLLA_DRIDER_INCUBATION                    :  891, // 
		HAS_SEEN_MINO_AND_COWGIRL                   :  892, // 
		PHYLLA_GEMS_HUNTED_TODAY                    :  893, // 
		PHYLLA_DRIDER_BABIES_COUNT                  :  894, // 
		SOCK_COUNTER                                :  895, // 
		SOCK_HOLDING                                :  896, // 
		FOUND_SOCKS                                 :  897, // 
		SOCKS_BOUGHT                                :  898, // 
		GILDED_JERKED                               :  899, // 
		PHYLLA_INHERITED_KNOWLEDGE                  :  900, // 
		PHYLLA_IZMA_TALK                            :  901, // 
		AKBAL_TIMES_BITCHED                         :  902, // 
		AKBAL_BITCH_Q                               :  903, // 
		KELLY_BONUS_BOOB_ROWS                       :  904, // 
		KELLY_INCUBATION                            :  905, // 
		KELLY_TIMES_PEPPERED                        :  906, // 
		KELLY_HEAT_TIME                             :  907, // 
		KELLY_KIDS                                  :  908, //
		KELLY_FIRST_KID_GENDER                      :  909, // 
		KAIJU_MEETINGS                              :  910, // 
		KAIJU_DISABLED                              :  911, // 
		KAIJU_TALK_CYCLE                            :  912, // 
		KAIJU_COCK                                  :  913, // 
		KAIJU_BAD_END_COUNTER                       :  914, // 
		BROOKE_AFFECTION                            :  915, // 
		BROOKE_SHOWERED_WITH                        :  916, // 
		BROOKE_AND_HELIA_3SOME                      :  917, // 
		TIMES_IN_BROOKES_BUTT                       :  918, // 
		BROOKE_MEDIUM_SCENE                         :  919, // BROOKE_MEDIUM_SCENE" Description="Brooke fucked ya.
		BROOKE_MET                                  :  920, // 
		BROOKE_MET_TODAY                            :  921, // 
		BROOKE_GRUMPS_ABOUT_TA                      :  922, // 
		FOUGHT_HOLLI                                :  923, // 
		THREATENED_HOLLI                            :  924, // 
		DIDNT_FUCK_PHYLLA_ON_RECRUITMENT            :  925, // 
		HELIA_ANAL_TRAINING_OFFERED                 :  926, // 
		HELIA_ANAL_TRAINING                         :  927, // 
		HELIA_BIRTHDAY_OFFERED                      :  928, // 
		HELIA_BDAY_DRINKS                           :  929, // 
		HELIA_BDAY_HAKON_AND_KIRI                   :  930, // 
		HELIA_BDAY_PHOENIXES                        :  931, // 
		HELIA_BDAY_FOX_TWINS                        :  932, // 
		ARIAN_FOLLOWER                              :  933, // 
		ARIAN_PARK                                  :  934, // -1 = disabled, 1 = helped.
		ARIAN_HEALTH                                :  935, // Higher is better.
		ARIAN_ANAL_XP                               :  936, // 
		ARIAN_CAPACITY                              :  937, // 
		ARIAN_COCK_SIZE                             :  938, // 
		ARIAN_DOUBLE_COCK                           :  939, // 
		ARIAN_VAGINA                                :  940, // 
		ARIAN_BREASTS                               :  941, // 
		ARIAN_VIRGIN                                :  942, // 
		ARIAN_S_DIALOGUE                            :  943, // 
		ARIAN_HERM_CHAT                             :  944, // 
		ARIAN_ASS_CHAT                              :  945, // 
		ARIAN_LESSONS                               :  946, // 
		ARIAN_DOUBLE_PENETRATION_CHAT               :  947, // 
		ARIAN_FIRST_REPTILUM                        :  948, // 
		ARIAN_TREATMENT                             :  949, // 
		ARIAN_HAS_BLOWN                             :  950, // 
		ARIAN_MORNING                               :  951, // 
		ARIAN_EGG_CHAT                              :  952, // 
		ARIAN_EGG_EVENT                             :  953, // 
		ARIAN_EGG_COLOR                             :  954, // 
		ARIAN_EGG_COUNTER                           :  955, // 
		HELSPAWN_NAME                               :  956, // 
		HELSPAWN_PERSONALITY                        :  957, // 
		HELSPAWN_DADDY                              :  958, // 
		HELSPAWN_WEAPON                             :  959, // 
		HELSPAWN_AGE                                :  960, // 
		HELSPAWN_GROWUP_COUNTER                     :  961, // 
		HEL_LOVE                                    :  962, // 
		HELIA_KIDS_CHAT                             :  963, // 
		HELIA_TALK_SEVEN                            :  964, // 
		HEL_NTR_TRACKER                             :  965, // 
		HEL_BONUS_POINTS                            :  966, // 
		HEL_PREGNANCY_INCUBATION                    :  967, // 
		HELIA_PREGNANCY_TYPE                        :  968, //Previously HEL_PREGNANCY_NOTICES
		HAD_FIRST_HELSPAWN_TALK                     :  969, // 
		HELSPAWN_INCEST                             :  970, // 
		HEL_TALK_EIGHT                              :  971, // 
		HELSPAWN_DISCOVER_BOOZE                     :  972, // 
		HELSPAWN_FUCK_INTERRUPTUS                   :  973, // 
		SPIDER_BRO_GIFT                             :  974, // 
		HAKON_AND_KIRI_VISIT                        :  975, // 
		KELLY_HAIR_COLOR                            :  976, // 
		KELLY_TALK_N_HAND_TIMES                     :  977, // 
		KELLY_TIMES_REWARDED                        :  978, // 
		KELLY_TIMES_DIED_HAIR                       :  979, // 
		KELLY_TIMES_APPLESAUCED                     :  980, // 
		KELLY_REWARD_COOLDOWN                       :  981, // 
		KIHA_CAMP_WATCH                             :  982, // 
		TIMES_ARIAN_DILDOED                         :  983, // 
		RUBI_BREAST_SIZE                            :  984, // 
		RUBI_COCK_SIZE                              :  985, // 
		RUBI_COCK_TYPE                              :  986, // 
		RUBI_LOWERBODY                              :  987, // 
		RUBI_HORNTYPE                               :  988, // 
		RUBI_NIPPLETYPE                             :  989, // 
		RUBI_NO_CUNT                                :  990, // 
		RUBI_CUNTTYPE                               :  991, // 
		RUBI_EYE_DESCRIPT                           :  992, // 
		RUBI_EYE_TYPE                               :  993, // 
		RUBI_SKIN                                   :  994, // 
		RUBI_HAIR                                   :  995, // 
		RUBI_HAIR_LENGTH                            :  996, // 
		RUBI_BALLS_TYPE                             :  997, // 
		RUBI_EAR_TYPE                               :  998, // 
		RUBI_HANDS                                  :  999, // 
		RUBI_WHISKERS                               : 1000, // 
		RUBI_FEET                                   : 1001, // 
		RUBI_DEBIMBO                                : 1002, // 
		RUBI_NIPPLE_TYPE                            : 1003, // 
		RUBI_SHE                                    : 1004, // 
		TIMES_DISCUSSED_RUBIS_IDENTITY              : 1005, // 
		RUBI_ICECREAM_CONFESSION                    : 1006, // 
		TIMES_RUBI_DATED                            : 1007, // 
		RUBI_FANCY_CONFESSION                       : 1008, // 
		RUBI_BAR_CONFESSION                         : 1009, // 
		RUBI_TIMES_ANALLY_TRAINED                   : 1010, // 
		RUBI_TIMES_GIVEN_AN_ITEM                    : 1011, // 
		RUBI_BONDAGE_STRAPS                         : 1012, // 
		RUBI_INQUISITORS_CORSET                     : 1013, // 
		RUBI_SETUP                                  : 1014, // 
		EXPLORATION_PAGE                            : 1015, // 
		BOG_EXPLORED                                : 1016, // 
		TIMES_ENCOUNTERED_FROG                      : 1017, // 
		FERAS_GLADE_EXPLORED_YEAR                   : 1018,
		FERAS_TRAP_SPRUNG_YEAR                      : 1019,
		TIMES_VALERIA_GOO_THREESOMED                : 1020,
		MORE_TURKEY                                 : 1021,
		LYNNETTE_PREGNANCY_CYCLE                    : 1022, //0-3 = pregnant. 4-6 = not.
		LYNNETTE_APPROVAL                           : 1023,
		LYNNETTE_BABY_COUNT                         : 1024,
		LYNNETTE_CARRYING_COUNT                     : 1025,
		LYNNETTE_MET_UNPREGNANT                     : 1026,
		LYNNETTE_ANNOUNCED_APPROVAL                 : 1027,
		LYNNETTE_FUCK_COUNTER                       : 1028,
		UMA_TIMES_SEXED                             : 1029,
		UMA_TIMES_MASSAGED                          : 1030,
		UMA_TIMES_ACUPUNCTURE_UNDO                  : 1031,
		UMA_TIMES_SUCKED_YOU                        : 1032,
		TIMES_RUT_FUCKED_URTAS_CUNT                 : 1033,
		TIMES_KIHA_ANALED                           : 1034,
		TIMES_ENCOUNTERED_GOBLIN_ASSASSIN           : 1035,
		IZUMI_MET                                   : 1036, // Player has had the introduction/meeting scene with Izumi
		IZUMI_LAST_ENCOUNTER                        : 1037, // Outcome of the last enouncter with Izumi, 0 = Unset, 1 = PC Lost in a fight, 2 = PC ran away, 3 = PC Won in a fight
		IZUMI_TIMES_SUBMITTED                       : 1038, // Times the player has voluntarily submitted to Izumi's demands
		IZUMI_TIMES_GRABBED_THE_HORN                : 1039, // Times the player has beaten Izumi in a fight, and touched her horn.
		IZUMI_TIMES_LOST_FIGHT                      : 1040, // Times the player has been beaten by Izumi in a fight
		IZUMI_SEEN_PC_GENDER                        : 1041, // Indicates if Izumi knows the PCs true gender/equipment (val in the last gender int that izumi knows the player was)
		CUSTOM_FONT_SIZE                            : 1042, // Defines the currently set font size for output text elements. (Hacky, need to do something better, but this works for now.)
		FERRET_BAD_END_WARNING                      : 1043,
		TIMES_TALKED_WITH_JOJO                      : 1044, // Number of times the player has talked with Pure Jojo.
		TIMES_TRAINED_WITH_JOJO                     : 1045, // Number of times the player has trained with Jojo
		UNLOCKED_JOJO_TRAINING                      : 1046,
		MET_FROSTY                                  : 1047,
		SIGNED_FROSTYS_CONTRACT                     : 1048,
		FROSTY_POINTS                               : 1049,
		SEEN_GENDERLESS_FROSTY_REJECTION            : 1050,
		MARBLE_PURIFIED                             : 1051,
		MARBLE_BOYS                                 : 1052,
		CLARA_IMPRISONED                            : 1053,
		CLARA_PURIFIED                              : 1054,
		MARBLE_TIME_SINCE_NURSED_IN_HOURS           : 1055,
		MARBLE_BREAST_SIZE                          : 1056,
		TIMES_GIVEN_MARBLE_PURE_LABOVA              : 1057,
		MARBLE_RATHAZUL_COUNTER_1                   : 1058,
		MARBLE_PURIFICATION_STAGE                   : 1059,
		MURBLE_TEA_DRINKER_COUNT                    : 1060,
		MARBLE_RATHAZUL_COUNTER_2                   : 1061,
		MARBLE_WARNED_ABOUT_CORRUPTION              : 1062,
		MARBLE_LEFT_OVER_CORRUPTION                 : 1063,
		MARBLE_COUNTUP_TO_PURIFYING                 : 1064,
		TIMES_ENCOUNTERED_PRINCESS_GWYNN            : 1065, // Times the player has run into Princess Gwyn
		WILD_HUNT_ENCOUNTERS                        : 1066,	// Total wild hunt encounters
		ERLKING_DISABLED                            : 1067, // Wild hunt/Erlking has been disabled
		ERLKING_ENCOUNTER_COUNTER                   : 1068,
		KATHERINE_MET_SCYLLA                        : 1069,
		WHITNEY_TALK_MURBLE_AND_KELT                : 1070, // Player has done the talk with Whitney requiring they have metl Murble and Kelt
		WHITNEY_TALK_TELADRE                        : 1071, // Player talked to Whitney about TelAdre
		WHITNEY_TALK_HIGH_MOUNTAIN                  : 1072, // Player talked to Whitney about the High Mountains
		WHITNEY_TALK_DUNGEON                        : 1073, // Player talked to Whitney about shutting D1 down
		WHITNEY_TALK_DUNGEON_FOLLOWUP               : 1074, // Player talked to Whitney about D1 #
		FARM_CORRUPTION_DISABLED                    : 1075, // Player selected "Never" when presented with an option to corrupt farm
		FARM_CORRUPT_PROMPT_DISPLAY                 : 1076, // Tracking the state for prompt display
		FARM_CORRUPTION_STARTED                     : 1077, // Player has started the farm corruption process
		WHITNEY_CORRUPTION                          : 1078, // Whitneys corruption value
		FOLLOWER_AT_FARM_AMILY                      : 1079, // Amily as at the farm
		FOLLOWER_AT_FARM_JOJO                       : 1080, // Jojo is at the farm
		FOLLOWER_AT_FARM_SOPHIE                     : 1081, // Sophie is at the farm (0 = no, 1 = Sophie, 2 = Bimbo Sophie)
		FOLLOWER_AT_FARM_IZMA                       : 1082, // Izma is at the farm (0 = no, 1 = Izma, 2 = Izmael)
		FOLLOWER_AT_FARM_ISABELLA                   : 1083, // Isabell is at the farm
		FOLLOWER_AT_FARM_VAPULA                     : 1084, // Vapula is at the farm
		FOLLOWER_AT_FARM_LATEXY                     : 1085, // Latexy is at the farm
		FOLLOWER_AT_FARM_CERAPH                     : 1086, // Ceraph is at the farm
		FOLLOWER_AT_FARM_HOLLI                      : 1087, // Holli has corrupted the farm (Yes I know she can't actually move gtfo) (0 = no, anything else = num days affected)
		FOLLOWER_AT_FARM_KELLY                      : 1088, // Kelly is at the farm (Don't think this is strictly required, depends if pc can disable Kellys corruption effect)
		FOLLOWER_AT_FARM_BATH_GIRL                  : 1089, // Bathslut is at the farm
		FARM_CORRUPTION_FIRST_DATE                  : 1090, // Day value that the Farm completed the corruption process
		FOLLOWER_AT_FARM_MARBLE                     : 1091,
		FARM_CORRUPTION_DAYS_SINCE_LAST_PAYOUT      : 1092,
		FARM_CORRUPTION_GEMS_WAITING                : 1093,
		FARM_UPGRADES_REFINERY                      : 1094,
		WHITNEY_CORRUPTION_COMPLETE                 : 1095,
		FOLLOWER_PRODUCTION_AMILY                   : 1096,
		FARM_SUCCUMILK_STORED                       : 1097,
		FOLLOWER_PRODUCTION_JOJO                    : 1098,
		FARM_INCUDRAFT_STORED                       : 1099,
		FOLLOWER_AT_FARM_AMILY_GIBS_MILK            : 1100,
		FOLLOWER_AT_FARM_JOJO_GIBS_DRAFT            : 1101,
		FOLLOWER_PRODUCTION_SOPHIE                  : 1102,
		FOLLOWER_PRODUCTION_SOPHIE_COLORCHOICE      : 1103,
		FARM_EGG_STORED                             : 1104,
		FARM_EGG_COUNTDOWN                          : 1105,
		FOLLOWER_PRODUCTION_VAPULA                  : 1106,
		FOLLOWER_AT_FARM_VAPULA_GIBS_MILK           : 1107,
		HOLLI_FUCKED_TODAY                          : 1108,
		FARM_UPGRADES_CONTRACEPTIVE                 : 1109,
		KELT_TALKED_FARM_MANAGEMENT                 : 1110,
		FARM_CONTRACEPTIVE_STORED                   : 1111,
		WHITNEY_CORRUPTION_HIGHEST                  : 1112,
		WHITNEY_CORRUPTION_0_30_DROP_MESSAGE        : 1113,
		FARM_CORRUPTION_APPROACHED_WHITNEY          : 1114,
		WHITNEY_LEAVE_0_60                          : 1115,
		WHITNEY_MENU_31_60                          : 1116,
		WHITNEY_MENU_61_90                          : 1117,
		WHITNEY_LEAVE_61_90                         : 1118,
		WHITNEY_MENU_91_119                         : 1119,
		WHITNEY_DISABLED_FOR_DAY                    : 1120,
		WHITNEY_DEFURRED                            : 1121,
		WHITNEY_DOM                                 : 1122,
		FARM_UPGRADES_MILKTANK                      : 1123,
		QUEUE_BREASTMILKER_UPGRADE                  : 1124,
		QUEUE_COCKMILKER_UPGRADE                    : 1125,
		QUEUE_REFINERY_UPGRADE                      : 1126,
		QUEUE_CONTRACEPTIVE_UPGRADE                 : 1127,
		QUEUE_MILKTANK_UPGRADE                      : 1128,
		WHITNEY_TATTOO_COLLARBONE                   : 1129,
		WHITNEY_TATTOO_SHOULDERS                    : 1130,
		WHITNEY_TATTOO_LOWERBACK                    : 1131,
		WHITNEY_TATTOO_BUTT                         : 1132,
		FARM_CORRUPTION_BRANDING_MENU_UNLOCKED      : 1133,
		QUEUE_BRANDING_UPGRADE                      : 1134,
		QUEUE_BRANDING_AVAILABLE_TALK               : 1135,
		WHITNEY_ORAL_TRAINING                       : 1136,
		AMILY_TATTOO_COLLARBONE                     : 1137,
		AMILY_TATTOO_SHOULDERS                      : 1138,
		AMILY_TATTOO_LOWERBACK                      : 1139,
		AMILY_TATTOO_BUTT                           : 1140,
		JOJO_TATTOO_COLLARBONE                      : 1141,
		JOJO_TATTOO_SHOULDERS                       : 1142,
		JOJO_TATTOO_LOWERBACK                       : 1143,
		JOJO_TATTOO_BUTT                            : 1144,
		SOPHIE_TATTOO_COLLARBONE                    : 1145,
		SOPHIE_TATTOO_SHOULDERS                     : 1146,
		SOPHIE_TATTOO_LOWERBACK                     : 1147,
		SOPHIE_TATTOO_BUTT                          : 1148,
		VAPULA_TATTOO_COLLARBONE                    : 1149,
		VAPULA_TATTOO_SHOULDERS                     : 1150,
		VAPULA_TATTOO_LOWERBACK                     : 1151,
		VAPULA_TATTOO_BUTT                          : 1152,
		KELLY_TATTOO_COLLARBONE                     : 1153,
		KELLY_TATTOO_SHOULDERS                      : 1154,
		KELLY_TATTOO_LOWERBACK                      : 1155,
		KELLY_TATTOO_BUTT                           : 1156,
		MILKY_TATTOO_COLLARBONE                     : 1157,
		MILKY_TATTOO_SHOULDERS                      : 1158,
		MILKY_TATTOO_LOWERBACK                      : 1159,
		MILKY_TATTOO_BUTT                           : 1160,
		WHITNEY_DOM_FIRST_PLEASURE                  : 1161,
		FARM_UPGRADES_ORGYROOM                      : 1162,
		MASSAGE_HAPPY_ENDINGS                       : 1163,
		QUEUE_ORGYROOM_UPGRADE                      : 1164,
		FOUND_CATHEDRAL                             : 1165,
		PLACES_PAGE                                 : 1166,
		FUCK_YOU_GOT_MINE_RAPHAEL                   : 1167,
		MARBLE_MILKED_BEFORE                        : 1168,
		TATTOO_SAVEFIX_APPLIED                      : 1169,
		BIRTHS_PHOUKA                               : 1170, // For the status page, possible future content
		BIRTHS_FAERIE                               : 1171, // For the status page, possible future content
		PHOUKA_ENCOUNTER_STATUS                     : 1172, // 0 for never encountered, 1 for encountered at least once, other values can be used later if you're doing something for one
		PHOUKA_LORE                                 : 1173, // 0 when you don't know what they're called, 1 once you learn their name, higher values as you hear more drunken stories.
		PREGNANCY_CORRUPTION                        : 1174, // Starts at 2 when you get pregnant. Drops if you drink pure honey, rises if you drink phouka whiskey
		TREACLE_MINE_YEAR_DONE                      : 1175, // Same as for the Fera encounter, this is a once a year halloween deal
		PLAYER_INFECTED_HELLHOUNDS                  : 1176,
		PLAYER_INFECTED_MINOTAURS                   : 1177,
		PLAYER_INFECTED_IMPS                        : 1178,
		FEMOIT_UNLOCKED                             : 1179, // Unlocked the option to feminise Benoit
		BIMBO_FEMOIT_UNLOCKED                       : 1180, // Unlocked the option to bimbofy Benoit
		BENOIT_STATUS                               : 1181, // Benoits "mode" -- 0 = Male, 1 = Fem, 2 = Bimbo
		FEMOIT_NEXTDAY_EVENT                        : 1182, // Proc the event the following day when you visit - stores the minimum day number that the event can proc on.
		FEMOIT_TALKED_TO                            : 1183,
		KATHERINE_RANDOM_RECRUITMENT_DISABLED       : 1184,
		TIMES_FUCKED_FEMOIT                         : 1185,
		FEMOIT_EGGS                                 : 1186,
		FEMOIT_INCUBATION                           : 1187,
		FEMOIT_READY_FOR_EGGS                       : 1188,
		FEMOIT_FIRST_CLUTCH_MISSED                  : 1189,
		FEMOIT_EGGS_LAID                            : 1190,
		FEMOIT_HELPED_LAY                           : 1191,
		FEMOIT_SPOONED                              : 1192,
		FEMOIT_NEXTDAY_EVENT_DONE                   : 1193,
		VALA_HEALED_HONEY                           : 1194,
		AMILY_PREGNANCY_TYPE                        : 1195,
		AMILY_BUTT_PREGNANCY_TYPE                   : 1196,
		FEMALE_SPIDERMORPH_PREGNANCY_TYPE           : 1197,
		PHYLLA_VAGINAL_PREGNANCY_TYPE               : 1198,
		TAMANI_PREGNANCY_TYPE                       : 1199,
		TAMANI_PREGNANCY_INCUBATION                 : 1200,
		TAMANI_PREGNANCY_COUNT                      : 1201, //Just how many has she got stuffed in there?
		TAMANI_TIMES_IMPREGNATED                    : 1202,
		TAMANI_MET                                  : 1203,
		TAMANI_NUMBER_OF_DAUGHTERS                  : 1204,
		TAMANI_DAUGHTERS_PREGNANCY_TYPE             : 1205,
		TAMANI_DAUGHTERS_PREGNANCY_COUNT            : 1206,
		IZMA_PREGNANCY_TYPE                         : 1207,
		EMBER_PREGNANCY_TYPE                        : 1208,
		JOJO_BUTT_PREGNANCY_TYPE                    : 1209,
		SHEILA_DISABLED                             : 1210, //1 = Told to avoid or you refused apology, 2 = Baby Issues, 3 = Worm Infested, 4 = Jojo's 'Wife'
		SHEILA_PREGNANCY_TYPE                       : 1211,
		KELLY_PREGNANCY_TYPE                        : 1212,
		KELLY_KIDS_MALE                             : 1213, //Tracks number of sons with Kelly. Total number of children is stored in KELLY_KIDS
		FUCK_OFF_THEIVING_RAPHAEL                   : 1214,
		VALA_TIMES_CONSENSUAL_SEX                   : 1215,
		KATHERINE_DICK_FORM                         : 1216,
		KATHERINE_BREAST_SIZE                       : 1217,
		KATHERINE_HOURS_SINCE_CUM                   : 1218,
		KATHERINE_SEXUAL_EXPERIENCE                 : 1219,
		KATHERINE_CLOTHES                           : 1220,
		KATHERINE_CLOTHES_PREF                      : 1221,
		KATHERINE_CLOTHES_WORN                      : 1222,
		KATHERINE_HAIR_COLOR                        : 1223,
		KATHERINE_IS_CAT_GIRL                       : 1224,
		KATHERINE_LOCATION                          : 1225,
		KATHERINE_TRAINING                          : 1226,
		KATHERINE_SUB_FLAGS                         : 1227,
		KATHERINE_AMILY_AFFECTION                   : 1228,
		KATHERINE_COTTON_AFFECTION                  : 1229,
		KATHERINE_EDRYN_AFFECTION                   : 1230,
		KATHERINE_HELIA_AFFECTION                   : 1231,
		KATHERINE_URTA_AFFECTION                    : 1232,
		KATHERINE_URTA_DATE                         : 1233,
		KATHERINE_URTA_TIMES_SEX                    : 1234,
		KATHERINE_VALA_AFFECTION                    : 1235,
		KATHERINE_VALA_DATE                         : 1236,
		KATHERINE_VALA_TIMES_SEX                    : 1237,
		SAVE_FILE_INTEGER_FORMAT_VERSION            : 1238,
		D3_DISCOVERED                               : 1239,
		D3_ENTERED_MAGPIEHALL                       : 1240,
		D3_BASILISKS_REMOVED_FROM_MAGPIE_HALL       : 1241,
		D3_MIRRORS_SHATTERED                        : 1242,
		D3_JEAN_CLAUDE_DEFEATED                     : 1243,
		D3_DOPPLEGANGER_DEFEATED                    : 1244,
		D3_MECHANIC_LAST_GREET                      : 1245,
		D3_MECHANIC_FIGHT_RESULT                    : 1246,
		D3_MECHANIC_COCK_TYPE_SELECTION             : 1247, // This is the kinda shit that sounds like it might get referenced in future (HAHAHA YEAH RIGHT?)
		D3_STATUE_DEFEATED                          : 1248,
		D3_GARDENER_DEFEATED                        : 1249,
		D1_OMNIBUS_KILLED                           : 1250,
		D3_CENTAUR_DEFEATED                         : 1251,
		D3_EGGS_AVAILABLE                           : 1252,
		NOT_HELPED_ARIAN_TODAY                      : 1253,
		BEE_GIRL_STATUS                             : 1254, //Player Attitude + Conversation Stage
		BEE_GIRL_COMBAT_WINS_WITH_RAPE              : 1255,
		BEE_GIRL_COMBAT_WINS_WITHOUT_RAPE           : 1256,
		BEE_GIRL_COMBAT_LOSSES                      : 1257,
		KATHERINE_MILK_OPTIONS                      : 1258,
		SCYLLA_FURRY_FOURSOME_COUNT                 : 1259,
		SCYLLA_SMALLCOCK_INTRO                      : 1260, // Player has had the initial lil' dick intro version with scylla
		UNKNOWN_FLAG_NUMBER_01261                   : 1261,
		UNKNOWN_FLAG_NUMBER_01262                   : 1262,
		UNKNOWN_FLAG_NUMBER_01263                   : 1263,
		UNKNOWN_FLAG_NUMBER_01264                   : 1264,
		UNKNOWN_FLAG_NUMBER_01265                   : 1265,
		UNKNOWN_FLAG_NUMBER_01266                   : 1266,
		UNKNOWN_FLAG_NUMBER_01267                   : 1267,
		UNKNOWN_FLAG_NUMBER_01268                   : 1268,
		UNKNOWN_FLAG_NUMBER_01269                   : 1269,
		UNKNOWN_FLAG_NUMBER_01270                   : 1270,
		UNKNOWN_FLAG_NUMBER_01271                   : 1271,
		UNKNOWN_FLAG_NUMBER_01272                   : 1272,
		UNKNOWN_FLAG_NUMBER_01273                   : 1273,
		UNKNOWN_FLAG_NUMBER_01274                   : 1274,
		UNKNOWN_FLAG_NUMBER_01275                   : 1275,
		UNKNOWN_FLAG_NUMBER_01276                   : 1276,
		UNKNOWN_FLAG_NUMBER_01277                   : 1277,
		UNKNOWN_FLAG_NUMBER_01278                   : 1278,
		UNKNOWN_FLAG_NUMBER_01279                   : 1279,
		UNKNOWN_FLAG_NUMBER_01280                   : 1280,
		UNKNOWN_FLAG_NUMBER_01281                   : 1281,
		UNKNOWN_FLAG_NUMBER_01282                   : 1282,
		UNKNOWN_FLAG_NUMBER_01283                   : 1283,
		UNKNOWN_FLAG_NUMBER_01284                   : 1284,
		UNKNOWN_FLAG_NUMBER_01285                   : 1285,
		UNKNOWN_FLAG_NUMBER_01286                   : 1286,
		UNKNOWN_FLAG_NUMBER_01287                   : 1287,
		UNKNOWN_FLAG_NUMBER_01288                   : 1288,
		UNKNOWN_FLAG_NUMBER_01289                   : 1289,
		UNKNOWN_FLAG_NUMBER_01290                   : 1290,
		UNKNOWN_FLAG_NUMBER_01291                   : 1291,
		UNKNOWN_FLAG_NUMBER_01292                   : 1292,
		UNKNOWN_FLAG_NUMBER_01293                   : 1293,
		UNKNOWN_FLAG_NUMBER_01294                   : 1294,
		UNKNOWN_FLAG_NUMBER_01295                   : 1295,
		UNKNOWN_FLAG_NUMBER_01296                   : 1296,
		UNKNOWN_FLAG_NUMBER_01297                   : 1297,
		UNKNOWN_FLAG_NUMBER_01298                   : 1298,
		UNKNOWN_FLAG_NUMBER_01299                   : 1299,
		UNKNOWN_FLAG_NUMBER_01300                   : 1300,
		UNKNOWN_FLAG_NUMBER_01301                   : 1301,
		UNKNOWN_FLAG_NUMBER_01302                   : 1302,
		UNKNOWN_FLAG_NUMBER_01303                   : 1303,
		UNKNOWN_FLAG_NUMBER_01304                   : 1304,
		UNKNOWN_FLAG_NUMBER_01305                   : 1305,
		UNKNOWN_FLAG_NUMBER_01306                   : 1306,
		UNKNOWN_FLAG_NUMBER_01307                   : 1307,
		UNKNOWN_FLAG_NUMBER_01308                   : 1308,
		UNKNOWN_FLAG_NUMBER_01309                   : 1309,
		UNKNOWN_FLAG_NUMBER_01310                   : 1310,
		UNKNOWN_FLAG_NUMBER_01311                   : 1311,
		UNKNOWN_FLAG_NUMBER_01312                   : 1312,
		UNKNOWN_FLAG_NUMBER_01313                   : 1313,
		UNKNOWN_FLAG_NUMBER_01314                   : 1314,
		UNKNOWN_FLAG_NUMBER_01315                   : 1315,
		UNKNOWN_FLAG_NUMBER_01316                   : 1316,
		UNKNOWN_FLAG_NUMBER_01317                   : 1317,
		UNKNOWN_FLAG_NUMBER_01318                   : 1318,
		UNKNOWN_FLAG_NUMBER_01319                   : 1319,
		UNKNOWN_FLAG_NUMBER_01320                   : 1320,
		UNKNOWN_FLAG_NUMBER_01321                   : 1321,
		UNKNOWN_FLAG_NUMBER_01322                   : 1322,
		UNKNOWN_FLAG_NUMBER_01323                   : 1323,
		UNKNOWN_FLAG_NUMBER_01324                   : 1324,
		UNKNOWN_FLAG_NUMBER_01325                   : 1325,
		UNKNOWN_FLAG_NUMBER_01326                   : 1326,
		UNKNOWN_FLAG_NUMBER_01327                   : 1327,
		UNKNOWN_FLAG_NUMBER_01328                   : 1328,
		UNKNOWN_FLAG_NUMBER_01329                   : 1329,
		UNKNOWN_FLAG_NUMBER_01330                   : 1330,
		UNKNOWN_FLAG_NUMBER_01331                   : 1331,
		UNKNOWN_FLAG_NUMBER_01332                   : 1332,
		UNKNOWN_FLAG_NUMBER_01333                   : 1333,
		UNKNOWN_FLAG_NUMBER_01334                   : 1334,
		UNKNOWN_FLAG_NUMBER_01335                   : 1335,
		UNKNOWN_FLAG_NUMBER_01336                   : 1336,
		UNKNOWN_FLAG_NUMBER_01337                   : 1337,
		UNKNOWN_FLAG_NUMBER_01338                   : 1338,
		UNKNOWN_FLAG_NUMBER_01339                   : 1339,
		UNKNOWN_FLAG_NUMBER_01340                   : 1340,
		UNKNOWN_FLAG_NUMBER_01341                   : 1341,
		UNKNOWN_FLAG_NUMBER_01342                   : 1342,
		UNKNOWN_FLAG_NUMBER_01343                   : 1343,
		UNKNOWN_FLAG_NUMBER_01344                   : 1344,
		UNKNOWN_FLAG_NUMBER_01345                   : 1345,
		UNKNOWN_FLAG_NUMBER_01346                   : 1346,
		UNKNOWN_FLAG_NUMBER_01347                   : 1347,
		UNKNOWN_FLAG_NUMBER_01348                   : 1348,
		UNKNOWN_FLAG_NUMBER_01349                   : 1349,
		UNKNOWN_FLAG_NUMBER_01350                   : 1350,
		UNKNOWN_FLAG_NUMBER_01351                   : 1351,
		UNKNOWN_FLAG_NUMBER_01352                   : 1352,
		UNKNOWN_FLAG_NUMBER_01353                   : 1353,
		UNKNOWN_FLAG_NUMBER_01354                   : 1354,
		UNKNOWN_FLAG_NUMBER_01355                   : 1355,
		UNKNOWN_FLAG_NUMBER_01356                   : 1356,
		UNKNOWN_FLAG_NUMBER_01357                   : 1357,
		UNKNOWN_FLAG_NUMBER_01358                   : 1358,
		UNKNOWN_FLAG_NUMBER_01359                   : 1359,
		UNKNOWN_FLAG_NUMBER_01360                   : 1360,
		UNKNOWN_FLAG_NUMBER_01361                   : 1361,
		UNKNOWN_FLAG_NUMBER_01362                   : 1362,
		UNKNOWN_FLAG_NUMBER_01363                   : 1363,
		UNKNOWN_FLAG_NUMBER_01364                   : 1364,
		UNKNOWN_FLAG_NUMBER_01365                   : 1365,
		UNKNOWN_FLAG_NUMBER_01366                   : 1366,
		UNKNOWN_FLAG_NUMBER_01367                   : 1367,
		UNKNOWN_FLAG_NUMBER_01368                   : 1368,
		UNKNOWN_FLAG_NUMBER_01369                   : 1369,
		UNKNOWN_FLAG_NUMBER_01370                   : 1370,
		UNKNOWN_FLAG_NUMBER_01371                   : 1371,
		UNKNOWN_FLAG_NUMBER_01372                   : 1372,
		UNKNOWN_FLAG_NUMBER_01373                   : 1373,
		UNKNOWN_FLAG_NUMBER_01374                   : 1374,
		UNKNOWN_FLAG_NUMBER_01375                   : 1375,
		UNKNOWN_FLAG_NUMBER_01376                   : 1376,
		UNKNOWN_FLAG_NUMBER_01377                   : 1377,
		UNKNOWN_FLAG_NUMBER_01378                   : 1378,
		UNKNOWN_FLAG_NUMBER_01379                   : 1379,
		UNKNOWN_FLAG_NUMBER_01380                   : 1380,
		UNKNOWN_FLAG_NUMBER_01381                   : 1381,
		UNKNOWN_FLAG_NUMBER_01382                   : 1382,
		UNKNOWN_FLAG_NUMBER_01383                   : 1383,
		UNKNOWN_FLAG_NUMBER_01384                   : 1384,
		UNKNOWN_FLAG_NUMBER_01385                   : 1385,
		UNKNOWN_FLAG_NUMBER_01386                   : 1386,
		UNKNOWN_FLAG_NUMBER_01387                   : 1387,
		UNKNOWN_FLAG_NUMBER_01388                   : 1388,
		UNKNOWN_FLAG_NUMBER_01389                   : 1389,
		UNKNOWN_FLAG_NUMBER_01390                   : 1390,
		UNKNOWN_FLAG_NUMBER_01391                   : 1391,
		UNKNOWN_FLAG_NUMBER_01392                   : 1392,
		UNKNOWN_FLAG_NUMBER_01393                   : 1393,
		UNKNOWN_FLAG_NUMBER_01394                   : 1394,
		UNKNOWN_FLAG_NUMBER_01395                   : 1395,
		UNKNOWN_FLAG_NUMBER_01396                   : 1396,
		UNKNOWN_FLAG_NUMBER_01397                   : 1397,
		UNKNOWN_FLAG_NUMBER_01398                   : 1398,
		UNKNOWN_FLAG_NUMBER_01399                   : 1399,
		UNKNOWN_FLAG_NUMBER_01400                   : 1400,
		UNKNOWN_FLAG_NUMBER_01401                   : 1401,
		UNKNOWN_FLAG_NUMBER_01402                   : 1402,
		UNKNOWN_FLAG_NUMBER_01403                   : 1403,
		UNKNOWN_FLAG_NUMBER_01404                   : 1404,
		UNKNOWN_FLAG_NUMBER_01405                   : 1405,
		UNKNOWN_FLAG_NUMBER_01406                   : 1406,
		UNKNOWN_FLAG_NUMBER_01407                   : 1407,
		UNKNOWN_FLAG_NUMBER_01408                   : 1408,
		UNKNOWN_FLAG_NUMBER_01409                   : 1409,
		UNKNOWN_FLAG_NUMBER_01410                   : 1410,
		UNKNOWN_FLAG_NUMBER_01411                   : 1411,
		UNKNOWN_FLAG_NUMBER_01412                   : 1412,
		UNKNOWN_FLAG_NUMBER_01413                   : 1413,
		UNKNOWN_FLAG_NUMBER_01414                   : 1414,
		UNKNOWN_FLAG_NUMBER_01415                   : 1415,
		UNKNOWN_FLAG_NUMBER_01416                   : 1416,
		UNKNOWN_FLAG_NUMBER_01417                   : 1417,
		UNKNOWN_FLAG_NUMBER_01418                   : 1418,
		UNKNOWN_FLAG_NUMBER_01419                   : 1419,
		UNKNOWN_FLAG_NUMBER_01420                   : 1420,
		UNKNOWN_FLAG_NUMBER_01421                   : 1421,
		UNKNOWN_FLAG_NUMBER_01422                   : 1422,
		UNKNOWN_FLAG_NUMBER_01423                   : 1423,
		UNKNOWN_FLAG_NUMBER_01424                   : 1424,
		UNKNOWN_FLAG_NUMBER_01425                   : 1425,
		UNKNOWN_FLAG_NUMBER_01426                   : 1426,
		UNKNOWN_FLAG_NUMBER_01427                   : 1427,
		UNKNOWN_FLAG_NUMBER_01428                   : 1428,
		UNKNOWN_FLAG_NUMBER_01429                   : 1429,
		UNKNOWN_FLAG_NUMBER_01430                   : 1430,
		UNKNOWN_FLAG_NUMBER_01431                   : 1431,
		UNKNOWN_FLAG_NUMBER_01432                   : 1432,
		UNKNOWN_FLAG_NUMBER_01433                   : 1433,
		UNKNOWN_FLAG_NUMBER_01434                   : 1434,
		UNKNOWN_FLAG_NUMBER_01435                   : 1435,
		UNKNOWN_FLAG_NUMBER_01436                   : 1436,
		UNKNOWN_FLAG_NUMBER_01437                   : 1437,
		UNKNOWN_FLAG_NUMBER_01438                   : 1438,
		UNKNOWN_FLAG_NUMBER_01439                   : 1439,
		UNKNOWN_FLAG_NUMBER_01440                   : 1440,
		UNKNOWN_FLAG_NUMBER_01441                   : 1441,
		UNKNOWN_FLAG_NUMBER_01442                   : 1442,
		UNKNOWN_FLAG_NUMBER_01443                   : 1443,
		UNKNOWN_FLAG_NUMBER_01444                   : 1444,
		UNKNOWN_FLAG_NUMBER_01445                   : 1445,
		UNKNOWN_FLAG_NUMBER_01446                   : 1446,
		UNKNOWN_FLAG_NUMBER_01447                   : 1447,
		UNKNOWN_FLAG_NUMBER_01448                   : 1448,
		UNKNOWN_FLAG_NUMBER_01449                   : 1449,
		UNKNOWN_FLAG_NUMBER_01450                   : 1450,
		UNKNOWN_FLAG_NUMBER_01451                   : 1451,
		UNKNOWN_FLAG_NUMBER_01452                   : 1452,
		UNKNOWN_FLAG_NUMBER_01453                   : 1453,
		UNKNOWN_FLAG_NUMBER_01454                   : 1454,
		UNKNOWN_FLAG_NUMBER_01455                   : 1455,
		UNKNOWN_FLAG_NUMBER_01456                   : 1456,
		UNKNOWN_FLAG_NUMBER_01457                   : 1457,
		UNKNOWN_FLAG_NUMBER_01458                   : 1458,
		UNKNOWN_FLAG_NUMBER_01459                   : 1459,
		UNKNOWN_FLAG_NUMBER_01460                   : 1460,
		UNKNOWN_FLAG_NUMBER_01461                   : 1461,
		UNKNOWN_FLAG_NUMBER_01462                   : 1462,
		UNKNOWN_FLAG_NUMBER_01463                   : 1463,
		UNKNOWN_FLAG_NUMBER_01464                   : 1464,
		UNKNOWN_FLAG_NUMBER_01465                   : 1465,
		UNKNOWN_FLAG_NUMBER_01466                   : 1466,
		UNKNOWN_FLAG_NUMBER_01467                   : 1467,
		UNKNOWN_FLAG_NUMBER_01468                   : 1468,
		UNKNOWN_FLAG_NUMBER_01469                   : 1469,
		UNKNOWN_FLAG_NUMBER_01470                   : 1470,
		UNKNOWN_FLAG_NUMBER_01471                   : 1471,
		UNKNOWN_FLAG_NUMBER_01472                   : 1472,
		UNKNOWN_FLAG_NUMBER_01473                   : 1473,
		UNKNOWN_FLAG_NUMBER_01474                   : 1474,
		UNKNOWN_FLAG_NUMBER_01475                   : 1475,
		UNKNOWN_FLAG_NUMBER_01476                   : 1476,
		UNKNOWN_FLAG_NUMBER_01477                   : 1477,
		UNKNOWN_FLAG_NUMBER_01478                   : 1478,
		UNKNOWN_FLAG_NUMBER_01479                   : 1479,
		UNKNOWN_FLAG_NUMBER_01480                   : 1480,
		UNKNOWN_FLAG_NUMBER_01481                   : 1481,
		UNKNOWN_FLAG_NUMBER_01482                   : 1482,
		UNKNOWN_FLAG_NUMBER_01483                   : 1483,
		UNKNOWN_FLAG_NUMBER_01484                   : 1484,
		UNKNOWN_FLAG_NUMBER_01485                   : 1485,
		UNKNOWN_FLAG_NUMBER_01486                   : 1486,
		UNKNOWN_FLAG_NUMBER_01487                   : 1487,
		UNKNOWN_FLAG_NUMBER_01488                   : 1488,
		UNKNOWN_FLAG_NUMBER_01489                   : 1489,
		UNKNOWN_FLAG_NUMBER_01490                   : 1490,
		UNKNOWN_FLAG_NUMBER_01491                   : 1491,
		UNKNOWN_FLAG_NUMBER_01492                   : 1492,
		UNKNOWN_FLAG_NUMBER_01493                   : 1493,
		UNKNOWN_FLAG_NUMBER_01494                   : 1494,
		UNKNOWN_FLAG_NUMBER_01495                   : 1495,
		UNKNOWN_FLAG_NUMBER_01496                   : 1496,
		UNKNOWN_FLAG_NUMBER_01497                   : 1497,
		UNKNOWN_FLAG_NUMBER_01498                   : 1498,
		UNKNOWN_FLAG_NUMBER_01499                   : 1499,
		UNKNOWN_FLAG_NUMBER_01500                   : 1500,
		UNKNOWN_FLAG_NUMBER_01501                   : 1501,
		UNKNOWN_FLAG_NUMBER_01502                   : 1502,
		UNKNOWN_FLAG_NUMBER_01503                   : 1503,
		UNKNOWN_FLAG_NUMBER_01504                   : 1504,
		UNKNOWN_FLAG_NUMBER_01505                   : 1505,
		UNKNOWN_FLAG_NUMBER_01506                   : 1506,
		UNKNOWN_FLAG_NUMBER_01507                   : 1507,
		UNKNOWN_FLAG_NUMBER_01508                   : 1508,
		UNKNOWN_FLAG_NUMBER_01509                   : 1509,
		UNKNOWN_FLAG_NUMBER_01510                   : 1510,
		UNKNOWN_FLAG_NUMBER_01511                   : 1511,
		UNKNOWN_FLAG_NUMBER_01512                   : 1512,
		UNKNOWN_FLAG_NUMBER_01513                   : 1513,
		UNKNOWN_FLAG_NUMBER_01514                   : 1514,
		UNKNOWN_FLAG_NUMBER_01515                   : 1515,
		UNKNOWN_FLAG_NUMBER_01516                   : 1516,
		UNKNOWN_FLAG_NUMBER_01517                   : 1517,
		UNKNOWN_FLAG_NUMBER_01518                   : 1518,
		UNKNOWN_FLAG_NUMBER_01519                   : 1519,
		UNKNOWN_FLAG_NUMBER_01520                   : 1520,
		UNKNOWN_FLAG_NUMBER_01521                   : 1521,
		UNKNOWN_FLAG_NUMBER_01522                   : 1522,
		UNKNOWN_FLAG_NUMBER_01523                   : 1523,
		UNKNOWN_FLAG_NUMBER_01524                   : 1524,
		UNKNOWN_FLAG_NUMBER_01525                   : 1525,
		UNKNOWN_FLAG_NUMBER_01526                   : 1526,
		UNKNOWN_FLAG_NUMBER_01527                   : 1527,
		UNKNOWN_FLAG_NUMBER_01528                   : 1528,
		UNKNOWN_FLAG_NUMBER_01529                   : 1529,
		UNKNOWN_FLAG_NUMBER_01530                   : 1530,
		UNKNOWN_FLAG_NUMBER_01531                   : 1531,
		UNKNOWN_FLAG_NUMBER_01532                   : 1532,
		UNKNOWN_FLAG_NUMBER_01533                   : 1533,
		UNKNOWN_FLAG_NUMBER_01534                   : 1534,
		UNKNOWN_FLAG_NUMBER_01535                   : 1535,
		UNKNOWN_FLAG_NUMBER_01536                   : 1536,
		UNKNOWN_FLAG_NUMBER_01537                   : 1537,
		UNKNOWN_FLAG_NUMBER_01538                   : 1538,
		UNKNOWN_FLAG_NUMBER_01539                   : 1539,
		UNKNOWN_FLAG_NUMBER_01540                   : 1540,
		UNKNOWN_FLAG_NUMBER_01541                   : 1541,
		UNKNOWN_FLAG_NUMBER_01542                   : 1542,
		UNKNOWN_FLAG_NUMBER_01543                   : 1543,
		UNKNOWN_FLAG_NUMBER_01544                   : 1544,
		UNKNOWN_FLAG_NUMBER_01545                   : 1545,
		UNKNOWN_FLAG_NUMBER_01546                   : 1546,
		UNKNOWN_FLAG_NUMBER_01547                   : 1547,
		UNKNOWN_FLAG_NUMBER_01548                   : 1548,
		UNKNOWN_FLAG_NUMBER_01549                   : 1549,
		UNKNOWN_FLAG_NUMBER_01550                   : 1550,
		UNKNOWN_FLAG_NUMBER_01551                   : 1551,
		UNKNOWN_FLAG_NUMBER_01552                   : 1552,
		UNKNOWN_FLAG_NUMBER_01553                   : 1553,
		UNKNOWN_FLAG_NUMBER_01554                   : 1554,
		UNKNOWN_FLAG_NUMBER_01555                   : 1555,
		UNKNOWN_FLAG_NUMBER_01556                   : 1556,
		UNKNOWN_FLAG_NUMBER_01557                   : 1557,
		UNKNOWN_FLAG_NUMBER_01558                   : 1558,
		UNKNOWN_FLAG_NUMBER_01559                   : 1559,
		UNKNOWN_FLAG_NUMBER_01560                   : 1560,
		UNKNOWN_FLAG_NUMBER_01561                   : 1561,
		UNKNOWN_FLAG_NUMBER_01562                   : 1562,
		UNKNOWN_FLAG_NUMBER_01563                   : 1563,
		UNKNOWN_FLAG_NUMBER_01564                   : 1564,
		UNKNOWN_FLAG_NUMBER_01565                   : 1565,
		UNKNOWN_FLAG_NUMBER_01566                   : 1566,
		UNKNOWN_FLAG_NUMBER_01567                   : 1567,
		UNKNOWN_FLAG_NUMBER_01568                   : 1568,
		UNKNOWN_FLAG_NUMBER_01569                   : 1569,
		UNKNOWN_FLAG_NUMBER_01570                   : 1570,
		UNKNOWN_FLAG_NUMBER_01571                   : 1571,
		UNKNOWN_FLAG_NUMBER_01572                   : 1572,
		UNKNOWN_FLAG_NUMBER_01573                   : 1573,
		UNKNOWN_FLAG_NUMBER_01574                   : 1574,
		UNKNOWN_FLAG_NUMBER_01575                   : 1575,
		UNKNOWN_FLAG_NUMBER_01576                   : 1576,
		UNKNOWN_FLAG_NUMBER_01577                   : 1577,
		UNKNOWN_FLAG_NUMBER_01578                   : 1578,
		UNKNOWN_FLAG_NUMBER_01579                   : 1579,
		UNKNOWN_FLAG_NUMBER_01580                   : 1580,
		UNKNOWN_FLAG_NUMBER_01581                   : 1581,
		UNKNOWN_FLAG_NUMBER_01582                   : 1582,
		UNKNOWN_FLAG_NUMBER_01583                   : 1583,
		UNKNOWN_FLAG_NUMBER_01584                   : 1584,
		UNKNOWN_FLAG_NUMBER_01585                   : 1585,
		UNKNOWN_FLAG_NUMBER_01586                   : 1586,
		UNKNOWN_FLAG_NUMBER_01587                   : 1587,
		UNKNOWN_FLAG_NUMBER_01588                   : 1588,
		UNKNOWN_FLAG_NUMBER_01589                   : 1589,
		UNKNOWN_FLAG_NUMBER_01590                   : 1590,
		UNKNOWN_FLAG_NUMBER_01591                   : 1591,
		UNKNOWN_FLAG_NUMBER_01592                   : 1592,
		UNKNOWN_FLAG_NUMBER_01593                   : 1593,
		UNKNOWN_FLAG_NUMBER_01594                   : 1594,
		UNKNOWN_FLAG_NUMBER_01595                   : 1595,
		UNKNOWN_FLAG_NUMBER_01596                   : 1596,
		UNKNOWN_FLAG_NUMBER_01597                   : 1597,
		UNKNOWN_FLAG_NUMBER_01598                   : 1598,
		UNKNOWN_FLAG_NUMBER_01599                   : 1599,
		UNKNOWN_FLAG_NUMBER_01600                   : 1600,
		UNKNOWN_FLAG_NUMBER_01601                   : 1601,
		UNKNOWN_FLAG_NUMBER_01602                   : 1602,
		UNKNOWN_FLAG_NUMBER_01603                   : 1603,
		UNKNOWN_FLAG_NUMBER_01604                   : 1604,
		UNKNOWN_FLAG_NUMBER_01605                   : 1605,
		UNKNOWN_FLAG_NUMBER_01606                   : 1606,
		UNKNOWN_FLAG_NUMBER_01607                   : 1607,
		UNKNOWN_FLAG_NUMBER_01608                   : 1608,
		UNKNOWN_FLAG_NUMBER_01609                   : 1609,
		UNKNOWN_FLAG_NUMBER_01610                   : 1610,
		UNKNOWN_FLAG_NUMBER_01611                   : 1611,
		UNKNOWN_FLAG_NUMBER_01612                   : 1612,
		UNKNOWN_FLAG_NUMBER_01613                   : 1613,
		UNKNOWN_FLAG_NUMBER_01614                   : 1614,
		UNKNOWN_FLAG_NUMBER_01615                   : 1615,
		UNKNOWN_FLAG_NUMBER_01616                   : 1616,
		UNKNOWN_FLAG_NUMBER_01617                   : 1617,
		UNKNOWN_FLAG_NUMBER_01618                   : 1618,
		UNKNOWN_FLAG_NUMBER_01619                   : 1619,
		UNKNOWN_FLAG_NUMBER_01620                   : 1620,
		UNKNOWN_FLAG_NUMBER_01621                   : 1621,
		UNKNOWN_FLAG_NUMBER_01622                   : 1622,
		UNKNOWN_FLAG_NUMBER_01623                   : 1623,
		UNKNOWN_FLAG_NUMBER_01624                   : 1624,
		UNKNOWN_FLAG_NUMBER_01625                   : 1625,
		UNKNOWN_FLAG_NUMBER_01626                   : 1626,
		UNKNOWN_FLAG_NUMBER_01627                   : 1627,
		UNKNOWN_FLAG_NUMBER_01628                   : 1628,
		UNKNOWN_FLAG_NUMBER_01629                   : 1629,
		UNKNOWN_FLAG_NUMBER_01630                   : 1630,
		UNKNOWN_FLAG_NUMBER_01631                   : 1631,
		UNKNOWN_FLAG_NUMBER_01632                   : 1632,
		UNKNOWN_FLAG_NUMBER_01633                   : 1633,
		UNKNOWN_FLAG_NUMBER_01634                   : 1634,
		UNKNOWN_FLAG_NUMBER_01635                   : 1635,
		UNKNOWN_FLAG_NUMBER_01636                   : 1636,
		UNKNOWN_FLAG_NUMBER_01637                   : 1637,
		UNKNOWN_FLAG_NUMBER_01638                   : 1638,
		UNKNOWN_FLAG_NUMBER_01639                   : 1639,
		UNKNOWN_FLAG_NUMBER_01640                   : 1640,
		UNKNOWN_FLAG_NUMBER_01641                   : 1641,
		UNKNOWN_FLAG_NUMBER_01642                   : 1642,
		UNKNOWN_FLAG_NUMBER_01643                   : 1643,
		UNKNOWN_FLAG_NUMBER_01644                   : 1644,
		UNKNOWN_FLAG_NUMBER_01645                   : 1645,
		UNKNOWN_FLAG_NUMBER_01646                   : 1646,
		UNKNOWN_FLAG_NUMBER_01647                   : 1647,
		UNKNOWN_FLAG_NUMBER_01648                   : 1648,
		UNKNOWN_FLAG_NUMBER_01649                   : 1649,
		UNKNOWN_FLAG_NUMBER_01650                   : 1650,
		UNKNOWN_FLAG_NUMBER_01651                   : 1651,
		UNKNOWN_FLAG_NUMBER_01652                   : 1652,
		UNKNOWN_FLAG_NUMBER_01653                   : 1653,
		UNKNOWN_FLAG_NUMBER_01654                   : 1654,
		UNKNOWN_FLAG_NUMBER_01655                   : 1655,
		UNKNOWN_FLAG_NUMBER_01656                   : 1656,
		UNKNOWN_FLAG_NUMBER_01657                   : 1657,
		UNKNOWN_FLAG_NUMBER_01658                   : 1658,
		UNKNOWN_FLAG_NUMBER_01659                   : 1659,
		UNKNOWN_FLAG_NUMBER_01660                   : 1660,
		UNKNOWN_FLAG_NUMBER_01661                   : 1661,
		UNKNOWN_FLAG_NUMBER_01662                   : 1662,
		UNKNOWN_FLAG_NUMBER_01663                   : 1663,
		UNKNOWN_FLAG_NUMBER_01664                   : 1664,
		UNKNOWN_FLAG_NUMBER_01665                   : 1665,
		UNKNOWN_FLAG_NUMBER_01666                   : 1666,
		UNKNOWN_FLAG_NUMBER_01667                   : 1667,
		UNKNOWN_FLAG_NUMBER_01668                   : 1668,
		UNKNOWN_FLAG_NUMBER_01669                   : 1669,
		UNKNOWN_FLAG_NUMBER_01670                   : 1670,
		UNKNOWN_FLAG_NUMBER_01671                   : 1671,
		UNKNOWN_FLAG_NUMBER_01672                   : 1672,
		UNKNOWN_FLAG_NUMBER_01673                   : 1673,
		UNKNOWN_FLAG_NUMBER_01674                   : 1674,
		UNKNOWN_FLAG_NUMBER_01675                   : 1675,
		UNKNOWN_FLAG_NUMBER_01676                   : 1676,
		UNKNOWN_FLAG_NUMBER_01677                   : 1677,
		UNKNOWN_FLAG_NUMBER_01678                   : 1678,
		UNKNOWN_FLAG_NUMBER_01679                   : 1679,
		UNKNOWN_FLAG_NUMBER_01680                   : 1680,
		UNKNOWN_FLAG_NUMBER_01681                   : 1681,
		UNKNOWN_FLAG_NUMBER_01682                   : 1682,
		UNKNOWN_FLAG_NUMBER_01683                   : 1683,
		UNKNOWN_FLAG_NUMBER_01684                   : 1684,
		UNKNOWN_FLAG_NUMBER_01685                   : 1685,
		UNKNOWN_FLAG_NUMBER_01686                   : 1686,
		UNKNOWN_FLAG_NUMBER_01687                   : 1687,
		UNKNOWN_FLAG_NUMBER_01688                   : 1688,
		UNKNOWN_FLAG_NUMBER_01689                   : 1689,
		UNKNOWN_FLAG_NUMBER_01690                   : 1690,
		UNKNOWN_FLAG_NUMBER_01691                   : 1691,
		UNKNOWN_FLAG_NUMBER_01692                   : 1692,
		UNKNOWN_FLAG_NUMBER_01693                   : 1693,
		UNKNOWN_FLAG_NUMBER_01694                   : 1694,
		UNKNOWN_FLAG_NUMBER_01695                   : 1695,
		UNKNOWN_FLAG_NUMBER_01696                   : 1696,
		UNKNOWN_FLAG_NUMBER_01697                   : 1697,
		UNKNOWN_FLAG_NUMBER_01698                   : 1698,
		UNKNOWN_FLAG_NUMBER_01699                   : 1699,
		UNKNOWN_FLAG_NUMBER_01700                   : 1700,
		UNKNOWN_FLAG_NUMBER_01701                   : 1701,
		UNKNOWN_FLAG_NUMBER_01702                   : 1702,
		UNKNOWN_FLAG_NUMBER_01703                   : 1703,
		UNKNOWN_FLAG_NUMBER_01704                   : 1704,
		UNKNOWN_FLAG_NUMBER_01705                   : 1705,
		UNKNOWN_FLAG_NUMBER_01706                   : 1706,
		UNKNOWN_FLAG_NUMBER_01707                   : 1707,
		UNKNOWN_FLAG_NUMBER_01708                   : 1708,
		UNKNOWN_FLAG_NUMBER_01709                   : 1709,
		UNKNOWN_FLAG_NUMBER_01710                   : 1710,
		UNKNOWN_FLAG_NUMBER_01711                   : 1711,
		UNKNOWN_FLAG_NUMBER_01712                   : 1712,
		UNKNOWN_FLAG_NUMBER_01713                   : 1713,
		UNKNOWN_FLAG_NUMBER_01714                   : 1714,
		UNKNOWN_FLAG_NUMBER_01715                   : 1715,
		UNKNOWN_FLAG_NUMBER_01716                   : 1716,
		UNKNOWN_FLAG_NUMBER_01717                   : 1717,
		UNKNOWN_FLAG_NUMBER_01718                   : 1718,
		UNKNOWN_FLAG_NUMBER_01719                   : 1719,
		UNKNOWN_FLAG_NUMBER_01720                   : 1720,
		UNKNOWN_FLAG_NUMBER_01721                   : 1721,
		UNKNOWN_FLAG_NUMBER_01722                   : 1722,
		UNKNOWN_FLAG_NUMBER_01723                   : 1723,
		UNKNOWN_FLAG_NUMBER_01724                   : 1724,
		UNKNOWN_FLAG_NUMBER_01725                   : 1725,
		UNKNOWN_FLAG_NUMBER_01726                   : 1726,
		UNKNOWN_FLAG_NUMBER_01727                   : 1727,
		UNKNOWN_FLAG_NUMBER_01728                   : 1728,
		UNKNOWN_FLAG_NUMBER_01729                   : 1729,
		UNKNOWN_FLAG_NUMBER_01730                   : 1730,
		UNKNOWN_FLAG_NUMBER_01731                   : 1731,
		UNKNOWN_FLAG_NUMBER_01732                   : 1732,
		UNKNOWN_FLAG_NUMBER_01733                   : 1733,
		UNKNOWN_FLAG_NUMBER_01734                   : 1734,
		UNKNOWN_FLAG_NUMBER_01735                   : 1735,
		UNKNOWN_FLAG_NUMBER_01736                   : 1736,
		UNKNOWN_FLAG_NUMBER_01737                   : 1737,
		UNKNOWN_FLAG_NUMBER_01738                   : 1738,
		UNKNOWN_FLAG_NUMBER_01739                   : 1739,
		UNKNOWN_FLAG_NUMBER_01740                   : 1740,
		UNKNOWN_FLAG_NUMBER_01741                   : 1741,
		UNKNOWN_FLAG_NUMBER_01742                   : 1742,
		UNKNOWN_FLAG_NUMBER_01743                   : 1743,
		UNKNOWN_FLAG_NUMBER_01744                   : 1744,
		UNKNOWN_FLAG_NUMBER_01745                   : 1745,
		UNKNOWN_FLAG_NUMBER_01746                   : 1746,
		UNKNOWN_FLAG_NUMBER_01747                   : 1747,
		UNKNOWN_FLAG_NUMBER_01748                   : 1748,
		UNKNOWN_FLAG_NUMBER_01749                   : 1749,
		UNKNOWN_FLAG_NUMBER_01750                   : 1750,
		UNKNOWN_FLAG_NUMBER_01751                   : 1751,
		UNKNOWN_FLAG_NUMBER_01752                   : 1752,
		UNKNOWN_FLAG_NUMBER_01753                   : 1753,
		UNKNOWN_FLAG_NUMBER_01754                   : 1754,
		UNKNOWN_FLAG_NUMBER_01755                   : 1755,
		UNKNOWN_FLAG_NUMBER_01756                   : 1756,
		UNKNOWN_FLAG_NUMBER_01757                   : 1757,
		UNKNOWN_FLAG_NUMBER_01758                   : 1758,
		UNKNOWN_FLAG_NUMBER_01759                   : 1759,
		UNKNOWN_FLAG_NUMBER_01760                   : 1760,
		UNKNOWN_FLAG_NUMBER_01761                   : 1761,
		UNKNOWN_FLAG_NUMBER_01762                   : 1762,
		UNKNOWN_FLAG_NUMBER_01763                   : 1763,
		UNKNOWN_FLAG_NUMBER_01764                   : 1764,
		UNKNOWN_FLAG_NUMBER_01765                   : 1765,
		UNKNOWN_FLAG_NUMBER_01766                   : 1766,
		UNKNOWN_FLAG_NUMBER_01767                   : 1767,
		UNKNOWN_FLAG_NUMBER_01768                   : 1768,
		UNKNOWN_FLAG_NUMBER_01769                   : 1769,
		UNKNOWN_FLAG_NUMBER_01770                   : 1770,
		UNKNOWN_FLAG_NUMBER_01771                   : 1771,
		UNKNOWN_FLAG_NUMBER_01772                   : 1772,
		UNKNOWN_FLAG_NUMBER_01773                   : 1773,
		UNKNOWN_FLAG_NUMBER_01774                   : 1774,
		UNKNOWN_FLAG_NUMBER_01775                   : 1775,
		UNKNOWN_FLAG_NUMBER_01776                   : 1776,
		UNKNOWN_FLAG_NUMBER_01777                   : 1777,
		UNKNOWN_FLAG_NUMBER_01778                   : 1778,
		UNKNOWN_FLAG_NUMBER_01779                   : 1779,
		UNKNOWN_FLAG_NUMBER_01780                   : 1780,
		UNKNOWN_FLAG_NUMBER_01781                   : 1781,
		UNKNOWN_FLAG_NUMBER_01782                   : 1782,
		UNKNOWN_FLAG_NUMBER_01783                   : 1783,
		UNKNOWN_FLAG_NUMBER_01784                   : 1784,
		UNKNOWN_FLAG_NUMBER_01785                   : 1785,
		UNKNOWN_FLAG_NUMBER_01786                   : 1786,
		UNKNOWN_FLAG_NUMBER_01787                   : 1787,
		UNKNOWN_FLAG_NUMBER_01788                   : 1788,
		UNKNOWN_FLAG_NUMBER_01789                   : 1789,
		UNKNOWN_FLAG_NUMBER_01790                   : 1790,
		UNKNOWN_FLAG_NUMBER_01791                   : 1791,
		UNKNOWN_FLAG_NUMBER_01792                   : 1792,
		UNKNOWN_FLAG_NUMBER_01793                   : 1793,
		UNKNOWN_FLAG_NUMBER_01794                   : 1794,
		UNKNOWN_FLAG_NUMBER_01795                   : 1795,
		UNKNOWN_FLAG_NUMBER_01796                   : 1796,
		UNKNOWN_FLAG_NUMBER_01797                   : 1797,
		UNKNOWN_FLAG_NUMBER_01798                   : 1798,
		UNKNOWN_FLAG_NUMBER_01799                   : 1799,
		UNKNOWN_FLAG_NUMBER_01800                   : 1800,
		UNKNOWN_FLAG_NUMBER_01801                   : 1801,
		UNKNOWN_FLAG_NUMBER_01802                   : 1802,
		UNKNOWN_FLAG_NUMBER_01803                   : 1803,
		UNKNOWN_FLAG_NUMBER_01804                   : 1804,
		UNKNOWN_FLAG_NUMBER_01805                   : 1805,
		UNKNOWN_FLAG_NUMBER_01806                   : 1806,
		UNKNOWN_FLAG_NUMBER_01807                   : 1807,
		UNKNOWN_FLAG_NUMBER_01808                   : 1808,
		UNKNOWN_FLAG_NUMBER_01809                   : 1809,
		UNKNOWN_FLAG_NUMBER_01810                   : 1810,
		UNKNOWN_FLAG_NUMBER_01811                   : 1811,
		UNKNOWN_FLAG_NUMBER_01812                   : 1812,
		UNKNOWN_FLAG_NUMBER_01813                   : 1813,
		UNKNOWN_FLAG_NUMBER_01814                   : 1814,
		UNKNOWN_FLAG_NUMBER_01815                   : 1815,
		UNKNOWN_FLAG_NUMBER_01816                   : 1816,
		UNKNOWN_FLAG_NUMBER_01817                   : 1817,
		UNKNOWN_FLAG_NUMBER_01818                   : 1818,
		UNKNOWN_FLAG_NUMBER_01819                   : 1819,
		UNKNOWN_FLAG_NUMBER_01820                   : 1820,
		UNKNOWN_FLAG_NUMBER_01821                   : 1821,
		UNKNOWN_FLAG_NUMBER_01822                   : 1822,
		UNKNOWN_FLAG_NUMBER_01823                   : 1823,
		UNKNOWN_FLAG_NUMBER_01824                   : 1824,
		UNKNOWN_FLAG_NUMBER_01825                   : 1825,
		UNKNOWN_FLAG_NUMBER_01826                   : 1826,
		UNKNOWN_FLAG_NUMBER_01827                   : 1827,
		UNKNOWN_FLAG_NUMBER_01828                   : 1828,
		UNKNOWN_FLAG_NUMBER_01829                   : 1829,
		UNKNOWN_FLAG_NUMBER_01830                   : 1830,
		UNKNOWN_FLAG_NUMBER_01831                   : 1831,
		UNKNOWN_FLAG_NUMBER_01832                   : 1832,
		UNKNOWN_FLAG_NUMBER_01833                   : 1833,
		UNKNOWN_FLAG_NUMBER_01834                   : 1834,
		UNKNOWN_FLAG_NUMBER_01835                   : 1835,
		UNKNOWN_FLAG_NUMBER_01836                   : 1836,
		UNKNOWN_FLAG_NUMBER_01837                   : 1837,
		UNKNOWN_FLAG_NUMBER_01838                   : 1838,
		UNKNOWN_FLAG_NUMBER_01839                   : 1839,
		UNKNOWN_FLAG_NUMBER_01840                   : 1840,
		UNKNOWN_FLAG_NUMBER_01841                   : 1841,
		UNKNOWN_FLAG_NUMBER_01842                   : 1842,
		UNKNOWN_FLAG_NUMBER_01843                   : 1843,
		UNKNOWN_FLAG_NUMBER_01844                   : 1844,
		UNKNOWN_FLAG_NUMBER_01845                   : 1845,
		UNKNOWN_FLAG_NUMBER_01846                   : 1846,
		UNKNOWN_FLAG_NUMBER_01847                   : 1847,
		UNKNOWN_FLAG_NUMBER_01848                   : 1848,
		UNKNOWN_FLAG_NUMBER_01849                   : 1849,
		UNKNOWN_FLAG_NUMBER_01850                   : 1850,
		UNKNOWN_FLAG_NUMBER_01851                   : 1851,
		UNKNOWN_FLAG_NUMBER_01852                   : 1852,
		UNKNOWN_FLAG_NUMBER_01853                   : 1853,
		UNKNOWN_FLAG_NUMBER_01854                   : 1854,
		UNKNOWN_FLAG_NUMBER_01855                   : 1855,
		UNKNOWN_FLAG_NUMBER_01856                   : 1856,
		UNKNOWN_FLAG_NUMBER_01857                   : 1857,
		UNKNOWN_FLAG_NUMBER_01858                   : 1858,
		UNKNOWN_FLAG_NUMBER_01859                   : 1859,
		UNKNOWN_FLAG_NUMBER_01860                   : 1860,
		UNKNOWN_FLAG_NUMBER_01861                   : 1861,
		UNKNOWN_FLAG_NUMBER_01862                   : 1862,
		UNKNOWN_FLAG_NUMBER_01863                   : 1863,
		UNKNOWN_FLAG_NUMBER_01864                   : 1864,
		UNKNOWN_FLAG_NUMBER_01865                   : 1865,
		UNKNOWN_FLAG_NUMBER_01866                   : 1866,
		UNKNOWN_FLAG_NUMBER_01867                   : 1867,
		UNKNOWN_FLAG_NUMBER_01868                   : 1868,
		UNKNOWN_FLAG_NUMBER_01869                   : 1869,
		UNKNOWN_FLAG_NUMBER_01870                   : 1870,
		UNKNOWN_FLAG_NUMBER_01871                   : 1871,
		UNKNOWN_FLAG_NUMBER_01872                   : 1872,
		UNKNOWN_FLAG_NUMBER_01873                   : 1873,
		UNKNOWN_FLAG_NUMBER_01874                   : 1874,
		UNKNOWN_FLAG_NUMBER_01875                   : 1875,
		UNKNOWN_FLAG_NUMBER_01876                   : 1876,
		UNKNOWN_FLAG_NUMBER_01877                   : 1877,
		UNKNOWN_FLAG_NUMBER_01878                   : 1878,
		UNKNOWN_FLAG_NUMBER_01879                   : 1879,
		UNKNOWN_FLAG_NUMBER_01880                   : 1880,
		UNKNOWN_FLAG_NUMBER_01881                   : 1881,
		UNKNOWN_FLAG_NUMBER_01882                   : 1882,
		UNKNOWN_FLAG_NUMBER_01883                   : 1883,
		UNKNOWN_FLAG_NUMBER_01884                   : 1884,
		UNKNOWN_FLAG_NUMBER_01885                   : 1885,
		UNKNOWN_FLAG_NUMBER_01886                   : 1886,
		UNKNOWN_FLAG_NUMBER_01887                   : 1887,
		UNKNOWN_FLAG_NUMBER_01888                   : 1888,
		UNKNOWN_FLAG_NUMBER_01889                   : 1889,
		UNKNOWN_FLAG_NUMBER_01890                   : 1890,
		UNKNOWN_FLAG_NUMBER_01891                   : 1891,
		UNKNOWN_FLAG_NUMBER_01892                   : 1892,
		UNKNOWN_FLAG_NUMBER_01893                   : 1893,
		UNKNOWN_FLAG_NUMBER_01894                   : 1894,
		UNKNOWN_FLAG_NUMBER_01895                   : 1895,
		UNKNOWN_FLAG_NUMBER_01896                   : 1896,
		UNKNOWN_FLAG_NUMBER_01897                   : 1897,
		UNKNOWN_FLAG_NUMBER_01898                   : 1898,
		UNKNOWN_FLAG_NUMBER_01899                   : 1899,
		UNKNOWN_FLAG_NUMBER_01900                   : 1900,
		UNKNOWN_FLAG_NUMBER_01901                   : 1901,
		UNKNOWN_FLAG_NUMBER_01902                   : 1902,
		UNKNOWN_FLAG_NUMBER_01903                   : 1903,
		UNKNOWN_FLAG_NUMBER_01904                   : 1904,
		UNKNOWN_FLAG_NUMBER_01905                   : 1905,
		UNKNOWN_FLAG_NUMBER_01906                   : 1906,
		UNKNOWN_FLAG_NUMBER_01907                   : 1907,
		UNKNOWN_FLAG_NUMBER_01908                   : 1908,
		UNKNOWN_FLAG_NUMBER_01909                   : 1909,
		UNKNOWN_FLAG_NUMBER_01910                   : 1910,
		UNKNOWN_FLAG_NUMBER_01911                   : 1911,
		UNKNOWN_FLAG_NUMBER_01912                   : 1912,
		UNKNOWN_FLAG_NUMBER_01913                   : 1913,
		UNKNOWN_FLAG_NUMBER_01914                   : 1914,
		UNKNOWN_FLAG_NUMBER_01915                   : 1915,
		UNKNOWN_FLAG_NUMBER_01916                   : 1916,
		UNKNOWN_FLAG_NUMBER_01917                   : 1917,
		UNKNOWN_FLAG_NUMBER_01918                   : 1918,
		UNKNOWN_FLAG_NUMBER_01919                   : 1919,
		UNKNOWN_FLAG_NUMBER_01920                   : 1920,
		UNKNOWN_FLAG_NUMBER_01921                   : 1921,
		UNKNOWN_FLAG_NUMBER_01922                   : 1922,
		UNKNOWN_FLAG_NUMBER_01923                   : 1923,
		UNKNOWN_FLAG_NUMBER_01924                   : 1924,
		UNKNOWN_FLAG_NUMBER_01925                   : 1925,
		UNKNOWN_FLAG_NUMBER_01926                   : 1926,
		UNKNOWN_FLAG_NUMBER_01927                   : 1927,
		UNKNOWN_FLAG_NUMBER_01928                   : 1928,
		UNKNOWN_FLAG_NUMBER_01929                   : 1929,
		UNKNOWN_FLAG_NUMBER_01930                   : 1930,
		UNKNOWN_FLAG_NUMBER_01931                   : 1931,
		UNKNOWN_FLAG_NUMBER_01932                   : 1932,
		UNKNOWN_FLAG_NUMBER_01933                   : 1933,
		UNKNOWN_FLAG_NUMBER_01934                   : 1934,
		UNKNOWN_FLAG_NUMBER_01935                   : 1935,
		UNKNOWN_FLAG_NUMBER_01936                   : 1936,
		UNKNOWN_FLAG_NUMBER_01937                   : 1937,
		UNKNOWN_FLAG_NUMBER_01938                   : 1938,
		UNKNOWN_FLAG_NUMBER_01939                   : 1939,
		UNKNOWN_FLAG_NUMBER_01940                   : 1940,
		UNKNOWN_FLAG_NUMBER_01941                   : 1941,
		UNKNOWN_FLAG_NUMBER_01942                   : 1942,
		UNKNOWN_FLAG_NUMBER_01943                   : 1943,
		UNKNOWN_FLAG_NUMBER_01944                   : 1944,
		UNKNOWN_FLAG_NUMBER_01945                   : 1945,
		UNKNOWN_FLAG_NUMBER_01946                   : 1946,
		UNKNOWN_FLAG_NUMBER_01947                   : 1947,
		UNKNOWN_FLAG_NUMBER_01948                   : 1948,
		UNKNOWN_FLAG_NUMBER_01949                   : 1949,
		UNKNOWN_FLAG_NUMBER_01950                   : 1950,
		UNKNOWN_FLAG_NUMBER_01951                   : 1951,
		UNKNOWN_FLAG_NUMBER_01952                   : 1952,
		UNKNOWN_FLAG_NUMBER_01953                   : 1953,
		UNKNOWN_FLAG_NUMBER_01954                   : 1954,
		UNKNOWN_FLAG_NUMBER_01955                   : 1955,
		UNKNOWN_FLAG_NUMBER_01956                   : 1956,
		UNKNOWN_FLAG_NUMBER_01957                   : 1957,
		UNKNOWN_FLAG_NUMBER_01958                   : 1958,
		UNKNOWN_FLAG_NUMBER_01959                   : 1959,
		UNKNOWN_FLAG_NUMBER_01960                   : 1960,
		UNKNOWN_FLAG_NUMBER_01961                   : 1961,
		UNKNOWN_FLAG_NUMBER_01962                   : 1962,
		UNKNOWN_FLAG_NUMBER_01963                   : 1963,
		UNKNOWN_FLAG_NUMBER_01964                   : 1964,
		UNKNOWN_FLAG_NUMBER_01965                   : 1965,
		UNKNOWN_FLAG_NUMBER_01966                   : 1966,
		UNKNOWN_FLAG_NUMBER_01967                   : 1967,
		UNKNOWN_FLAG_NUMBER_01968                   : 1968,
		UNKNOWN_FLAG_NUMBER_01969                   : 1969,
		UNKNOWN_FLAG_NUMBER_01970                   : 1970,
		UNKNOWN_FLAG_NUMBER_01971                   : 1971,
		UNKNOWN_FLAG_NUMBER_01972                   : 1972,
		UNKNOWN_FLAG_NUMBER_01973                   : 1973,
		UNKNOWN_FLAG_NUMBER_01974                   : 1974,
		UNKNOWN_FLAG_NUMBER_01975                   : 1975,
		UNKNOWN_FLAG_NUMBER_01976                   : 1976,
		UNKNOWN_FLAG_NUMBER_01977                   : 1977,
		UNKNOWN_FLAG_NUMBER_01978                   : 1978,
		UNKNOWN_FLAG_NUMBER_01979                   : 1979,
		UNKNOWN_FLAG_NUMBER_01980                   : 1980,
		UNKNOWN_FLAG_NUMBER_01981                   : 1981,
		UNKNOWN_FLAG_NUMBER_01982                   : 1982,
		UNKNOWN_FLAG_NUMBER_01983                   : 1983,
		UNKNOWN_FLAG_NUMBER_01984                   : 1984,
		UNKNOWN_FLAG_NUMBER_01985                   : 1985,
		UNKNOWN_FLAG_NUMBER_01986                   : 1986,
		UNKNOWN_FLAG_NUMBER_01987                   : 1987,
		UNKNOWN_FLAG_NUMBER_01988                   : 1988,
		UNKNOWN_FLAG_NUMBER_01989                   : 1989,
		UNKNOWN_FLAG_NUMBER_01990                   : 1990,
		UNKNOWN_FLAG_NUMBER_01991                   : 1991,
		UNKNOWN_FLAG_NUMBER_01992                   : 1992,
		UNKNOWN_FLAG_NUMBER_01993                   : 1993,
		UNKNOWN_FLAG_NUMBER_01994                   : 1994,
		UNKNOWN_FLAG_NUMBER_01995                   : 1995,
		UNKNOWN_FLAG_NUMBER_01996                   : 1996,
		UNKNOWN_FLAG_NUMBER_01997                   : 1997,
		UNKNOWN_FLAG_NUMBER_01998                   : 1998,
		UNKNOWN_FLAG_NUMBER_01999                   : 1999,
		UNKNOWN_FLAG_NUMBER_02000                   : 2000,
		UNKNOWN_FLAG_NUMBER_02001                   : 2001,
		UNKNOWN_FLAG_NUMBER_02002                   : 2002,
		UNKNOWN_FLAG_NUMBER_02003                   : 2003,
		UNKNOWN_FLAG_NUMBER_02004                   : 2004,
		UNKNOWN_FLAG_NUMBER_02005                   : 2005,
		UNKNOWN_FLAG_NUMBER_02006                   : 2006,
		UNKNOWN_FLAG_NUMBER_02007                   : 2007,
		UNKNOWN_FLAG_NUMBER_02008                   : 2008,
		UNKNOWN_FLAG_NUMBER_02009                   : 2009,
		UNKNOWN_FLAG_NUMBER_02010                   : 2010,
		UNKNOWN_FLAG_NUMBER_02011                   : 2011,
		UNKNOWN_FLAG_NUMBER_02012                   : 2012,
		UNKNOWN_FLAG_NUMBER_02013                   : 2013,
		UNKNOWN_FLAG_NUMBER_02014                   : 2014,
		UNKNOWN_FLAG_NUMBER_02015                   : 2015,
		UNKNOWN_FLAG_NUMBER_02016                   : 2016,
		UNKNOWN_FLAG_NUMBER_02017                   : 2017,
		UNKNOWN_FLAG_NUMBER_02018                   : 2018,
		UNKNOWN_FLAG_NUMBER_02019                   : 2019,
		UNKNOWN_FLAG_NUMBER_02020                   : 2020,
		UNKNOWN_FLAG_NUMBER_02021                   : 2021,
		UNKNOWN_FLAG_NUMBER_02022                   : 2022,
		UNKNOWN_FLAG_NUMBER_02023                   : 2023,
		UNKNOWN_FLAG_NUMBER_02024                   : 2024,
		UNKNOWN_FLAG_NUMBER_02025                   : 2025,
		UNKNOWN_FLAG_NUMBER_02026                   : 2026,
		UNKNOWN_FLAG_NUMBER_02027                   : 2027,
		UNKNOWN_FLAG_NUMBER_02028                   : 2028,
		UNKNOWN_FLAG_NUMBER_02029                   : 2029,
		UNKNOWN_FLAG_NUMBER_02030                   : 2030,
		UNKNOWN_FLAG_NUMBER_02031                   : 2031,
		UNKNOWN_FLAG_NUMBER_02032                   : 2032,
		UNKNOWN_FLAG_NUMBER_02033                   : 2033,
		UNKNOWN_FLAG_NUMBER_02034                   : 2034,
		UNKNOWN_FLAG_NUMBER_02035                   : 2035,
		UNKNOWN_FLAG_NUMBER_02036                   : 2036,
		UNKNOWN_FLAG_NUMBER_02037                   : 2037,
		UNKNOWN_FLAG_NUMBER_02038                   : 2038,
		UNKNOWN_FLAG_NUMBER_02039                   : 2039,
		UNKNOWN_FLAG_NUMBER_02040                   : 2040,
		UNKNOWN_FLAG_NUMBER_02041                   : 2041,
		UNKNOWN_FLAG_NUMBER_02042                   : 2042,
		UNKNOWN_FLAG_NUMBER_02043                   : 2043,
		UNKNOWN_FLAG_NUMBER_02044                   : 2044,
		UNKNOWN_FLAG_NUMBER_02045                   : 2045,
		UNKNOWN_FLAG_NUMBER_02046                   : 2046,
		UNKNOWN_FLAG_NUMBER_02047                   : 2047,
		UNKNOWN_FLAG_NUMBER_02048                   : 2048,
		UNKNOWN_FLAG_NUMBER_02049                   : 2049,
		UNKNOWN_FLAG_NUMBER_02050                   : 2050,
		UNKNOWN_FLAG_NUMBER_02051                   : 2051,
		UNKNOWN_FLAG_NUMBER_02052                   : 2052,
		UNKNOWN_FLAG_NUMBER_02053                   : 2053,
		UNKNOWN_FLAG_NUMBER_02054                   : 2054,
		UNKNOWN_FLAG_NUMBER_02055                   : 2055,
		UNKNOWN_FLAG_NUMBER_02056                   : 2056,
		UNKNOWN_FLAG_NUMBER_02057                   : 2057,
		UNKNOWN_FLAG_NUMBER_02058                   : 2058,
		UNKNOWN_FLAG_NUMBER_02059                   : 2059,
		UNKNOWN_FLAG_NUMBER_02060                   : 2060,
		UNKNOWN_FLAG_NUMBER_02061                   : 2061,
		UNKNOWN_FLAG_NUMBER_02062                   : 2062,
		UNKNOWN_FLAG_NUMBER_02063                   : 2063,
		UNKNOWN_FLAG_NUMBER_02064                   : 2064,
		UNKNOWN_FLAG_NUMBER_02065                   : 2065,
		UNKNOWN_FLAG_NUMBER_02066                   : 2066,
		UNKNOWN_FLAG_NUMBER_02067                   : 2067,
		UNKNOWN_FLAG_NUMBER_02068                   : 2068,
		UNKNOWN_FLAG_NUMBER_02069                   : 2069,
		UNKNOWN_FLAG_NUMBER_02070                   : 2070,
		UNKNOWN_FLAG_NUMBER_02071                   : 2071,
		UNKNOWN_FLAG_NUMBER_02072                   : 2072,
		UNKNOWN_FLAG_NUMBER_02073                   : 2073,
		UNKNOWN_FLAG_NUMBER_02074                   : 2074,
		UNKNOWN_FLAG_NUMBER_02075                   : 2075,
		UNKNOWN_FLAG_NUMBER_02076                   : 2076,
		UNKNOWN_FLAG_NUMBER_02077                   : 2077,
		UNKNOWN_FLAG_NUMBER_02078                   : 2078,
		UNKNOWN_FLAG_NUMBER_02079                   : 2079,
		UNKNOWN_FLAG_NUMBER_02080                   : 2080,
		UNKNOWN_FLAG_NUMBER_02081                   : 2081,
		UNKNOWN_FLAG_NUMBER_02082                   : 2082,
		UNKNOWN_FLAG_NUMBER_02083                   : 2083,
		UNKNOWN_FLAG_NUMBER_02084                   : 2084,
		UNKNOWN_FLAG_NUMBER_02085                   : 2085,
		UNKNOWN_FLAG_NUMBER_02086                   : 2086,
		UNKNOWN_FLAG_NUMBER_02087                   : 2087,
		UNKNOWN_FLAG_NUMBER_02088                   : 2088,
		UNKNOWN_FLAG_NUMBER_02089                   : 2089,
		UNKNOWN_FLAG_NUMBER_02090                   : 2090,
		UNKNOWN_FLAG_NUMBER_02091                   : 2091,
		UNKNOWN_FLAG_NUMBER_02092                   : 2092,
		UNKNOWN_FLAG_NUMBER_02093                   : 2093,
		UNKNOWN_FLAG_NUMBER_02094                   : 2094,
		UNKNOWN_FLAG_NUMBER_02095                   : 2095,
		UNKNOWN_FLAG_NUMBER_02096                   : 2096,
		UNKNOWN_FLAG_NUMBER_02097                   : 2097,
		UNKNOWN_FLAG_NUMBER_02098                   : 2098,
		UNKNOWN_FLAG_NUMBER_02099                   : 2099,
		UNKNOWN_FLAG_NUMBER_02100                   : 2100,
		UNKNOWN_FLAG_NUMBER_02101                   : 2101,
		UNKNOWN_FLAG_NUMBER_02102                   : 2102,
		UNKNOWN_FLAG_NUMBER_02103                   : 2103,
		UNKNOWN_FLAG_NUMBER_02104                   : 2104,
		UNKNOWN_FLAG_NUMBER_02105                   : 2105,
		UNKNOWN_FLAG_NUMBER_02106                   : 2106,
		UNKNOWN_FLAG_NUMBER_02107                   : 2107,
		UNKNOWN_FLAG_NUMBER_02108                   : 2108,
		UNKNOWN_FLAG_NUMBER_02109                   : 2109,
		UNKNOWN_FLAG_NUMBER_02110                   : 2110,
		UNKNOWN_FLAG_NUMBER_02111                   : 2111,
		UNKNOWN_FLAG_NUMBER_02112                   : 2112,
		UNKNOWN_FLAG_NUMBER_02113                   : 2113,
		UNKNOWN_FLAG_NUMBER_02114                   : 2114,
		UNKNOWN_FLAG_NUMBER_02115                   : 2115,
		UNKNOWN_FLAG_NUMBER_02116                   : 2116,
		UNKNOWN_FLAG_NUMBER_02117                   : 2117,
		UNKNOWN_FLAG_NUMBER_02118                   : 2118,
		UNKNOWN_FLAG_NUMBER_02119                   : 2119,
		UNKNOWN_FLAG_NUMBER_02120                   : 2120,
		UNKNOWN_FLAG_NUMBER_02121                   : 2121,
		UNKNOWN_FLAG_NUMBER_02122                   : 2122,
		UNKNOWN_FLAG_NUMBER_02123                   : 2123,
		UNKNOWN_FLAG_NUMBER_02124                   : 2124,
		UNKNOWN_FLAG_NUMBER_02125                   : 2125,
		UNKNOWN_FLAG_NUMBER_02126                   : 2126,
		UNKNOWN_FLAG_NUMBER_02127                   : 2127,
		UNKNOWN_FLAG_NUMBER_02128                   : 2128,
		UNKNOWN_FLAG_NUMBER_02129                   : 2129,
		UNKNOWN_FLAG_NUMBER_02130                   : 2130,
		UNKNOWN_FLAG_NUMBER_02131                   : 2131,
		UNKNOWN_FLAG_NUMBER_02132                   : 2132,
		UNKNOWN_FLAG_NUMBER_02133                   : 2133,
		UNKNOWN_FLAG_NUMBER_02134                   : 2134,
		UNKNOWN_FLAG_NUMBER_02135                   : 2135,
		UNKNOWN_FLAG_NUMBER_02136                   : 2136,
		UNKNOWN_FLAG_NUMBER_02137                   : 2137,
		UNKNOWN_FLAG_NUMBER_02138                   : 2138,
		UNKNOWN_FLAG_NUMBER_02139                   : 2139,
		UNKNOWN_FLAG_NUMBER_02140                   : 2140,
		UNKNOWN_FLAG_NUMBER_02141                   : 2141,
		UNKNOWN_FLAG_NUMBER_02142                   : 2142,
		UNKNOWN_FLAG_NUMBER_02143                   : 2143,
		UNKNOWN_FLAG_NUMBER_02144                   : 2144,
		UNKNOWN_FLAG_NUMBER_02145                   : 2145,
		UNKNOWN_FLAG_NUMBER_02146                   : 2146,
		UNKNOWN_FLAG_NUMBER_02147                   : 2147,
		UNKNOWN_FLAG_NUMBER_02148                   : 2148,
		UNKNOWN_FLAG_NUMBER_02149                   : 2149,
		UNKNOWN_FLAG_NUMBER_02150                   : 2150,
		UNKNOWN_FLAG_NUMBER_02151                   : 2151,
		UNKNOWN_FLAG_NUMBER_02152                   : 2152,
		UNKNOWN_FLAG_NUMBER_02153                   : 2153,
		UNKNOWN_FLAG_NUMBER_02154                   : 2154,
		UNKNOWN_FLAG_NUMBER_02155                   : 2155,
		UNKNOWN_FLAG_NUMBER_02156                   : 2156,
		UNKNOWN_FLAG_NUMBER_02157                   : 2157,
		UNKNOWN_FLAG_NUMBER_02158                   : 2158,
		UNKNOWN_FLAG_NUMBER_02159                   : 2159,
		UNKNOWN_FLAG_NUMBER_02160                   : 2160,
		UNKNOWN_FLAG_NUMBER_02161                   : 2161,
		UNKNOWN_FLAG_NUMBER_02162                   : 2162,
		UNKNOWN_FLAG_NUMBER_02163                   : 2163,
		UNKNOWN_FLAG_NUMBER_02164                   : 2164,
		UNKNOWN_FLAG_NUMBER_02165                   : 2165,
		UNKNOWN_FLAG_NUMBER_02166                   : 2166,
		UNKNOWN_FLAG_NUMBER_02167                   : 2167,
		UNKNOWN_FLAG_NUMBER_02168                   : 2168,
		UNKNOWN_FLAG_NUMBER_02169                   : 2169,
		UNKNOWN_FLAG_NUMBER_02170                   : 2170,
		UNKNOWN_FLAG_NUMBER_02171                   : 2171,
		UNKNOWN_FLAG_NUMBER_02172                   : 2172,
		UNKNOWN_FLAG_NUMBER_02173                   : 2173,
		UNKNOWN_FLAG_NUMBER_02174                   : 2174,
		UNKNOWN_FLAG_NUMBER_02175                   : 2175,
		UNKNOWN_FLAG_NUMBER_02176                   : 2176,
		UNKNOWN_FLAG_NUMBER_02177                   : 2177,
		UNKNOWN_FLAG_NUMBER_02178                   : 2178,
		UNKNOWN_FLAG_NUMBER_02179                   : 2179,
		UNKNOWN_FLAG_NUMBER_02180                   : 2180,
		UNKNOWN_FLAG_NUMBER_02181                   : 2181,
		UNKNOWN_FLAG_NUMBER_02182                   : 2182,
		UNKNOWN_FLAG_NUMBER_02183                   : 2183,
		UNKNOWN_FLAG_NUMBER_02184                   : 2184,
		UNKNOWN_FLAG_NUMBER_02185                   : 2185,
		UNKNOWN_FLAG_NUMBER_02186                   : 2186,
		UNKNOWN_FLAG_NUMBER_02187                   : 2187,
		UNKNOWN_FLAG_NUMBER_02188                   : 2188,
		UNKNOWN_FLAG_NUMBER_02189                   : 2189,
		UNKNOWN_FLAG_NUMBER_02190                   : 2190,
		UNKNOWN_FLAG_NUMBER_02191                   : 2191,
		UNKNOWN_FLAG_NUMBER_02192                   : 2192,
		UNKNOWN_FLAG_NUMBER_02193                   : 2193,
		UNKNOWN_FLAG_NUMBER_02194                   : 2194,
		UNKNOWN_FLAG_NUMBER_02195                   : 2195,
		UNKNOWN_FLAG_NUMBER_02196                   : 2196,
		UNKNOWN_FLAG_NUMBER_02197                   : 2197,
		UNKNOWN_FLAG_NUMBER_02198                   : 2198,
		UNKNOWN_FLAG_NUMBER_02199                   : 2199,
		UNKNOWN_FLAG_NUMBER_02200                   : 2200,
		UNKNOWN_FLAG_NUMBER_02201                   : 2201,
		UNKNOWN_FLAG_NUMBER_02202                   : 2202,
		UNKNOWN_FLAG_NUMBER_02203                   : 2203,
		UNKNOWN_FLAG_NUMBER_02204                   : 2204,
		UNKNOWN_FLAG_NUMBER_02205                   : 2205,
		UNKNOWN_FLAG_NUMBER_02206                   : 2206,
		UNKNOWN_FLAG_NUMBER_02207                   : 2207,
		UNKNOWN_FLAG_NUMBER_02208                   : 2208,
		UNKNOWN_FLAG_NUMBER_02209                   : 2209,
		UNKNOWN_FLAG_NUMBER_02210                   : 2210,
		UNKNOWN_FLAG_NUMBER_02211                   : 2211,
		UNKNOWN_FLAG_NUMBER_02212                   : 2212,
		UNKNOWN_FLAG_NUMBER_02213                   : 2213,
		UNKNOWN_FLAG_NUMBER_02214                   : 2214,
		UNKNOWN_FLAG_NUMBER_02215                   : 2215,
		UNKNOWN_FLAG_NUMBER_02216                   : 2216,
		UNKNOWN_FLAG_NUMBER_02217                   : 2217,
		UNKNOWN_FLAG_NUMBER_02218                   : 2218,
		UNKNOWN_FLAG_NUMBER_02219                   : 2219,
		UNKNOWN_FLAG_NUMBER_02220                   : 2220,
		UNKNOWN_FLAG_NUMBER_02221                   : 2221,
		UNKNOWN_FLAG_NUMBER_02222                   : 2222,
		UNKNOWN_FLAG_NUMBER_02223                   : 2223,
		UNKNOWN_FLAG_NUMBER_02224                   : 2224,
		UNKNOWN_FLAG_NUMBER_02225                   : 2225,
		UNKNOWN_FLAG_NUMBER_02226                   : 2226,
		UNKNOWN_FLAG_NUMBER_02227                   : 2227,
		UNKNOWN_FLAG_NUMBER_02228                   : 2228,
		UNKNOWN_FLAG_NUMBER_02229                   : 2229,
		UNKNOWN_FLAG_NUMBER_02230                   : 2230,
		UNKNOWN_FLAG_NUMBER_02231                   : 2231,
		UNKNOWN_FLAG_NUMBER_02232                   : 2232,
		UNKNOWN_FLAG_NUMBER_02233                   : 2233,
		UNKNOWN_FLAG_NUMBER_02234                   : 2234,
		UNKNOWN_FLAG_NUMBER_02235                   : 2235,
		UNKNOWN_FLAG_NUMBER_02236                   : 2236,
		UNKNOWN_FLAG_NUMBER_02237                   : 2237,
		UNKNOWN_FLAG_NUMBER_02238                   : 2238,
		UNKNOWN_FLAG_NUMBER_02239                   : 2239,
		UNKNOWN_FLAG_NUMBER_02240                   : 2240,
		UNKNOWN_FLAG_NUMBER_02241                   : 2241,
		UNKNOWN_FLAG_NUMBER_02242                   : 2242,
		UNKNOWN_FLAG_NUMBER_02243                   : 2243,
		UNKNOWN_FLAG_NUMBER_02244                   : 2244,
		UNKNOWN_FLAG_NUMBER_02245                   : 2245,
		UNKNOWN_FLAG_NUMBER_02246                   : 2246,
		UNKNOWN_FLAG_NUMBER_02247                   : 2247,
		UNKNOWN_FLAG_NUMBER_02248                   : 2248,
		UNKNOWN_FLAG_NUMBER_02249                   : 2249,
		UNKNOWN_FLAG_NUMBER_02250                   : 2250,
		UNKNOWN_FLAG_NUMBER_02251                   : 2251,
		UNKNOWN_FLAG_NUMBER_02252                   : 2252,
		UNKNOWN_FLAG_NUMBER_02253                   : 2253,
		UNKNOWN_FLAG_NUMBER_02254                   : 2254,
		UNKNOWN_FLAG_NUMBER_02255                   : 2255,
		UNKNOWN_FLAG_NUMBER_02256                   : 2256,
		UNKNOWN_FLAG_NUMBER_02257                   : 2257,
		UNKNOWN_FLAG_NUMBER_02258                   : 2258,
		UNKNOWN_FLAG_NUMBER_02259                   : 2259,
		UNKNOWN_FLAG_NUMBER_02260                   : 2260,
		UNKNOWN_FLAG_NUMBER_02261                   : 2261,
		UNKNOWN_FLAG_NUMBER_02262                   : 2262,
		UNKNOWN_FLAG_NUMBER_02263                   : 2263,
		UNKNOWN_FLAG_NUMBER_02264                   : 2264,
		UNKNOWN_FLAG_NUMBER_02265                   : 2265,
		UNKNOWN_FLAG_NUMBER_02266                   : 2266,
		UNKNOWN_FLAG_NUMBER_02267                   : 2267,
		UNKNOWN_FLAG_NUMBER_02268                   : 2268,
		UNKNOWN_FLAG_NUMBER_02269                   : 2269,
		UNKNOWN_FLAG_NUMBER_02270                   : 2270,
		UNKNOWN_FLAG_NUMBER_02271                   : 2271,
		UNKNOWN_FLAG_NUMBER_02272                   : 2272,
		UNKNOWN_FLAG_NUMBER_02273                   : 2273,
		UNKNOWN_FLAG_NUMBER_02274                   : 2274,
		UNKNOWN_FLAG_NUMBER_02275                   : 2275,
		UNKNOWN_FLAG_NUMBER_02276                   : 2276,
		UNKNOWN_FLAG_NUMBER_02277                   : 2277,
		UNKNOWN_FLAG_NUMBER_02278                   : 2278,
		UNKNOWN_FLAG_NUMBER_02279                   : 2279,
		UNKNOWN_FLAG_NUMBER_02280                   : 2280,
		UNKNOWN_FLAG_NUMBER_02281                   : 2281,
		UNKNOWN_FLAG_NUMBER_02282                   : 2282,
		UNKNOWN_FLAG_NUMBER_02283                   : 2283,
		UNKNOWN_FLAG_NUMBER_02284                   : 2284,
		UNKNOWN_FLAG_NUMBER_02285                   : 2285,
		UNKNOWN_FLAG_NUMBER_02286                   : 2286,
		UNKNOWN_FLAG_NUMBER_02287                   : 2287,
		UNKNOWN_FLAG_NUMBER_02288                   : 2288,
		UNKNOWN_FLAG_NUMBER_02289                   : 2289,
		UNKNOWN_FLAG_NUMBER_02290                   : 2290,
		UNKNOWN_FLAG_NUMBER_02291                   : 2291,
		UNKNOWN_FLAG_NUMBER_02292                   : 2292,
		UNKNOWN_FLAG_NUMBER_02293                   : 2293,
		UNKNOWN_FLAG_NUMBER_02294                   : 2294,
		UNKNOWN_FLAG_NUMBER_02295                   : 2295,
		UNKNOWN_FLAG_NUMBER_02296                   : 2296,
		UNKNOWN_FLAG_NUMBER_02297                   : 2297,
		UNKNOWN_FLAG_NUMBER_02298                   : 2298,
		UNKNOWN_FLAG_NUMBER_02299                   : 2299,
		UNKNOWN_FLAG_NUMBER_02300                   : 2300,
		UNKNOWN_FLAG_NUMBER_02301                   : 2301,
		UNKNOWN_FLAG_NUMBER_02302                   : 2302,
		UNKNOWN_FLAG_NUMBER_02303                   : 2303,
		UNKNOWN_FLAG_NUMBER_02304                   : 2304,
		UNKNOWN_FLAG_NUMBER_02305                   : 2305,
		UNKNOWN_FLAG_NUMBER_02306                   : 2306,
		UNKNOWN_FLAG_NUMBER_02307                   : 2307,
		UNKNOWN_FLAG_NUMBER_02308                   : 2308,
		UNKNOWN_FLAG_NUMBER_02309                   : 2309,
		UNKNOWN_FLAG_NUMBER_02310                   : 2310,
		UNKNOWN_FLAG_NUMBER_02311                   : 2311,
		UNKNOWN_FLAG_NUMBER_02312                   : 2312,
		UNKNOWN_FLAG_NUMBER_02313                   : 2313,
		UNKNOWN_FLAG_NUMBER_02314                   : 2314,
		UNKNOWN_FLAG_NUMBER_02315                   : 2315,
		UNKNOWN_FLAG_NUMBER_02316                   : 2316,
		UNKNOWN_FLAG_NUMBER_02317                   : 2317,
		UNKNOWN_FLAG_NUMBER_02318                   : 2318,
		UNKNOWN_FLAG_NUMBER_02319                   : 2319,
		UNKNOWN_FLAG_NUMBER_02320                   : 2320,
		UNKNOWN_FLAG_NUMBER_02321                   : 2321,
		UNKNOWN_FLAG_NUMBER_02322                   : 2322,
		UNKNOWN_FLAG_NUMBER_02323                   : 2323,
		UNKNOWN_FLAG_NUMBER_02324                   : 2324,
		UNKNOWN_FLAG_NUMBER_02325                   : 2325,
		UNKNOWN_FLAG_NUMBER_02326                   : 2326,
		UNKNOWN_FLAG_NUMBER_02327                   : 2327,
		UNKNOWN_FLAG_NUMBER_02328                   : 2328,
		UNKNOWN_FLAG_NUMBER_02329                   : 2329,
		UNKNOWN_FLAG_NUMBER_02330                   : 2330,
		UNKNOWN_FLAG_NUMBER_02331                   : 2331,
		UNKNOWN_FLAG_NUMBER_02332                   : 2332,
		UNKNOWN_FLAG_NUMBER_02333                   : 2333,
		UNKNOWN_FLAG_NUMBER_02334                   : 2334,
		UNKNOWN_FLAG_NUMBER_02335                   : 2335,
		UNKNOWN_FLAG_NUMBER_02336                   : 2336,
		UNKNOWN_FLAG_NUMBER_02337                   : 2337,
		UNKNOWN_FLAG_NUMBER_02338                   : 2338,
		UNKNOWN_FLAG_NUMBER_02339                   : 2339,
		UNKNOWN_FLAG_NUMBER_02340                   : 2340,
		UNKNOWN_FLAG_NUMBER_02341                   : 2341,
		UNKNOWN_FLAG_NUMBER_02342                   : 2342,
		UNKNOWN_FLAG_NUMBER_02343                   : 2343,
		UNKNOWN_FLAG_NUMBER_02344                   : 2344,
		UNKNOWN_FLAG_NUMBER_02345                   : 2345,
		UNKNOWN_FLAG_NUMBER_02346                   : 2346,
		UNKNOWN_FLAG_NUMBER_02347                   : 2347,
		UNKNOWN_FLAG_NUMBER_02348                   : 2348,
		UNKNOWN_FLAG_NUMBER_02349                   : 2349,
		UNKNOWN_FLAG_NUMBER_02350                   : 2350,
		UNKNOWN_FLAG_NUMBER_02351                   : 2351,
		UNKNOWN_FLAG_NUMBER_02352                   : 2352,
		UNKNOWN_FLAG_NUMBER_02353                   : 2353,
		UNKNOWN_FLAG_NUMBER_02354                   : 2354,
		UNKNOWN_FLAG_NUMBER_02355                   : 2355,
		UNKNOWN_FLAG_NUMBER_02356                   : 2356,
		UNKNOWN_FLAG_NUMBER_02357                   : 2357,
		UNKNOWN_FLAG_NUMBER_02358                   : 2358,
		UNKNOWN_FLAG_NUMBER_02359                   : 2359,
		UNKNOWN_FLAG_NUMBER_02360                   : 2360,
		UNKNOWN_FLAG_NUMBER_02361                   : 2361,
		UNKNOWN_FLAG_NUMBER_02362                   : 2362,
		UNKNOWN_FLAG_NUMBER_02363                   : 2363,
		UNKNOWN_FLAG_NUMBER_02364                   : 2364,
		UNKNOWN_FLAG_NUMBER_02365                   : 2365,
		UNKNOWN_FLAG_NUMBER_02366                   : 2366,
		UNKNOWN_FLAG_NUMBER_02367                   : 2367,
		UNKNOWN_FLAG_NUMBER_02368                   : 2368,
		UNKNOWN_FLAG_NUMBER_02369                   : 2369,
		UNKNOWN_FLAG_NUMBER_02370                   : 2370,
		UNKNOWN_FLAG_NUMBER_02371                   : 2371,
		UNKNOWN_FLAG_NUMBER_02372                   : 2372,
		UNKNOWN_FLAG_NUMBER_02373                   : 2373,
		UNKNOWN_FLAG_NUMBER_02374                   : 2374,
		UNKNOWN_FLAG_NUMBER_02375                   : 2375,
		UNKNOWN_FLAG_NUMBER_02376                   : 2376,
		UNKNOWN_FLAG_NUMBER_02377                   : 2377,
		UNKNOWN_FLAG_NUMBER_02378                   : 2378,
		UNKNOWN_FLAG_NUMBER_02379                   : 2379,
		UNKNOWN_FLAG_NUMBER_02380                   : 2380,
		UNKNOWN_FLAG_NUMBER_02381                   : 2381,
		UNKNOWN_FLAG_NUMBER_02382                   : 2382,
		UNKNOWN_FLAG_NUMBER_02383                   : 2383,
		UNKNOWN_FLAG_NUMBER_02384                   : 2384,
		UNKNOWN_FLAG_NUMBER_02385                   : 2385,
		UNKNOWN_FLAG_NUMBER_02386                   : 2386,
		UNKNOWN_FLAG_NUMBER_02387                   : 2387,
		UNKNOWN_FLAG_NUMBER_02388                   : 2388,
		UNKNOWN_FLAG_NUMBER_02389                   : 2389,
		UNKNOWN_FLAG_NUMBER_02390                   : 2390,
		UNKNOWN_FLAG_NUMBER_02391                   : 2391,
		UNKNOWN_FLAG_NUMBER_02392                   : 2392,
		UNKNOWN_FLAG_NUMBER_02393                   : 2393,
		UNKNOWN_FLAG_NUMBER_02394                   : 2394,
		UNKNOWN_FLAG_NUMBER_02395                   : 2395,
		UNKNOWN_FLAG_NUMBER_02396                   : 2396,
		UNKNOWN_FLAG_NUMBER_02397                   : 2397,
		UNKNOWN_FLAG_NUMBER_02398                   : 2398,
		UNKNOWN_FLAG_NUMBER_02399                   : 2399,
		UNKNOWN_FLAG_NUMBER_02400                   : 2400,
		UNKNOWN_FLAG_NUMBER_02401                   : 2401,
		UNKNOWN_FLAG_NUMBER_02402                   : 2402,
		UNKNOWN_FLAG_NUMBER_02403                   : 2403,
		UNKNOWN_FLAG_NUMBER_02404                   : 2404,
		UNKNOWN_FLAG_NUMBER_02405                   : 2405,
		UNKNOWN_FLAG_NUMBER_02406                   : 2406,
		UNKNOWN_FLAG_NUMBER_02407                   : 2407,
		UNKNOWN_FLAG_NUMBER_02408                   : 2408,
		UNKNOWN_FLAG_NUMBER_02409                   : 2409,
		UNKNOWN_FLAG_NUMBER_02410                   : 2410,
		UNKNOWN_FLAG_NUMBER_02411                   : 2411,
		UNKNOWN_FLAG_NUMBER_02412                   : 2412,
		UNKNOWN_FLAG_NUMBER_02413                   : 2413,
		UNKNOWN_FLAG_NUMBER_02414                   : 2414,
		UNKNOWN_FLAG_NUMBER_02415                   : 2415,
		UNKNOWN_FLAG_NUMBER_02416                   : 2416,
		UNKNOWN_FLAG_NUMBER_02417                   : 2417,
		UNKNOWN_FLAG_NUMBER_02418                   : 2418,
		UNKNOWN_FLAG_NUMBER_02419                   : 2419,
		UNKNOWN_FLAG_NUMBER_02420                   : 2420,
		UNKNOWN_FLAG_NUMBER_02421                   : 2421,
		UNKNOWN_FLAG_NUMBER_02422                   : 2422,
		UNKNOWN_FLAG_NUMBER_02423                   : 2423,
		UNKNOWN_FLAG_NUMBER_02424                   : 2424,
		UNKNOWN_FLAG_NUMBER_02425                   : 2425,
		UNKNOWN_FLAG_NUMBER_02426                   : 2426,
		UNKNOWN_FLAG_NUMBER_02427                   : 2427,
		UNKNOWN_FLAG_NUMBER_02428                   : 2428,
		UNKNOWN_FLAG_NUMBER_02429                   : 2429,
		UNKNOWN_FLAG_NUMBER_02430                   : 2430,
		UNKNOWN_FLAG_NUMBER_02431                   : 2431,
		UNKNOWN_FLAG_NUMBER_02432                   : 2432,
		UNKNOWN_FLAG_NUMBER_02433                   : 2433,
		UNKNOWN_FLAG_NUMBER_02434                   : 2434,
		UNKNOWN_FLAG_NUMBER_02435                   : 2435,
		UNKNOWN_FLAG_NUMBER_02436                   : 2436,
		UNKNOWN_FLAG_NUMBER_02437                   : 2437,
		UNKNOWN_FLAG_NUMBER_02438                   : 2438,
		UNKNOWN_FLAG_NUMBER_02439                   : 2439,
		UNKNOWN_FLAG_NUMBER_02440                   : 2440,
		UNKNOWN_FLAG_NUMBER_02441                   : 2441,
		UNKNOWN_FLAG_NUMBER_02442                   : 2442,
		UNKNOWN_FLAG_NUMBER_02443                   : 2443,
		UNKNOWN_FLAG_NUMBER_02444                   : 2444,
		UNKNOWN_FLAG_NUMBER_02445                   : 2445,
		UNKNOWN_FLAG_NUMBER_02446                   : 2446,
		UNKNOWN_FLAG_NUMBER_02447                   : 2447,
		UNKNOWN_FLAG_NUMBER_02448                   : 2448,
		UNKNOWN_FLAG_NUMBER_02449                   : 2449,
		UNKNOWN_FLAG_NUMBER_02450                   : 2450,
		UNKNOWN_FLAG_NUMBER_02451                   : 2451,
		UNKNOWN_FLAG_NUMBER_02452                   : 2452,
		UNKNOWN_FLAG_NUMBER_02453                   : 2453,
		UNKNOWN_FLAG_NUMBER_02454                   : 2454,
		UNKNOWN_FLAG_NUMBER_02455                   : 2455,
		UNKNOWN_FLAG_NUMBER_02456                   : 2456,
		UNKNOWN_FLAG_NUMBER_02457                   : 2457,
		UNKNOWN_FLAG_NUMBER_02458                   : 2458,
		UNKNOWN_FLAG_NUMBER_02459                   : 2459,
		UNKNOWN_FLAG_NUMBER_02460                   : 2460,
		UNKNOWN_FLAG_NUMBER_02461                   : 2461,
		UNKNOWN_FLAG_NUMBER_02462                   : 2462,
		UNKNOWN_FLAG_NUMBER_02463                   : 2463,
		UNKNOWN_FLAG_NUMBER_02464                   : 2464,
		UNKNOWN_FLAG_NUMBER_02465                   : 2465,
		UNKNOWN_FLAG_NUMBER_02466                   : 2466,
		UNKNOWN_FLAG_NUMBER_02467                   : 2467,
		UNKNOWN_FLAG_NUMBER_02468                   : 2468,
		UNKNOWN_FLAG_NUMBER_02469                   : 2469,
		UNKNOWN_FLAG_NUMBER_02470                   : 2470,
		UNKNOWN_FLAG_NUMBER_02471                   : 2471,
		UNKNOWN_FLAG_NUMBER_02472                   : 2472,
		UNKNOWN_FLAG_NUMBER_02473                   : 2473,
		UNKNOWN_FLAG_NUMBER_02474                   : 2474,
		UNKNOWN_FLAG_NUMBER_02475                   : 2475,
		UNKNOWN_FLAG_NUMBER_02476                   : 2476,
		UNKNOWN_FLAG_NUMBER_02477                   : 2477,
		UNKNOWN_FLAG_NUMBER_02478                   : 2478,
		UNKNOWN_FLAG_NUMBER_02479                   : 2479,
		UNKNOWN_FLAG_NUMBER_02480                   : 2480,
		UNKNOWN_FLAG_NUMBER_02481                   : 2481,
		UNKNOWN_FLAG_NUMBER_02482                   : 2482,
		UNKNOWN_FLAG_NUMBER_02483                   : 2483,
		UNKNOWN_FLAG_NUMBER_02484                   : 2484,
		UNKNOWN_FLAG_NUMBER_02485                   : 2485,
		UNKNOWN_FLAG_NUMBER_02486                   : 2486,
		UNKNOWN_FLAG_NUMBER_02487                   : 2487,
		UNKNOWN_FLAG_NUMBER_02488                   : 2488,
		UNKNOWN_FLAG_NUMBER_02489                   : 2489,
		UNKNOWN_FLAG_NUMBER_02490                   : 2490,
		UNKNOWN_FLAG_NUMBER_02491                   : 2491,
		UNKNOWN_FLAG_NUMBER_02492                   : 2492,
		UNKNOWN_FLAG_NUMBER_02493                   : 2493,
		UNKNOWN_FLAG_NUMBER_02494                   : 2494,
		UNKNOWN_FLAG_NUMBER_02495                   : 2495,
		UNKNOWN_FLAG_NUMBER_02496                   : 2496,
		UNKNOWN_FLAG_NUMBER_02497                   : 2497,
		UNKNOWN_FLAG_NUMBER_02498                   : 2498,
		UNKNOWN_FLAG_NUMBER_02499                   : 2499,
		UNKNOWN_FLAG_NUMBER_02500                   : 2500,
		UNKNOWN_FLAG_NUMBER_02501                   : 2501,
		UNKNOWN_FLAG_NUMBER_02502                   : 2502,
		UNKNOWN_FLAG_NUMBER_02503                   : 2503,
		UNKNOWN_FLAG_NUMBER_02504                   : 2504,
		UNKNOWN_FLAG_NUMBER_02505                   : 2505,
		UNKNOWN_FLAG_NUMBER_02506                   : 2506,
		UNKNOWN_FLAG_NUMBER_02507                   : 2507,
		UNKNOWN_FLAG_NUMBER_02508                   : 2508,
		UNKNOWN_FLAG_NUMBER_02509                   : 2509,
		UNKNOWN_FLAG_NUMBER_02510                   : 2510,
		UNKNOWN_FLAG_NUMBER_02511                   : 2511,
		UNKNOWN_FLAG_NUMBER_02512                   : 2512,
		UNKNOWN_FLAG_NUMBER_02513                   : 2513,
		UNKNOWN_FLAG_NUMBER_02514                   : 2514,
		UNKNOWN_FLAG_NUMBER_02515                   : 2515,
		UNKNOWN_FLAG_NUMBER_02516                   : 2516,
		UNKNOWN_FLAG_NUMBER_02517                   : 2517,
		UNKNOWN_FLAG_NUMBER_02518                   : 2518,
		UNKNOWN_FLAG_NUMBER_02519                   : 2519,
		UNKNOWN_FLAG_NUMBER_02520                   : 2520,
		UNKNOWN_FLAG_NUMBER_02521                   : 2521,
		UNKNOWN_FLAG_NUMBER_02522                   : 2522,
		UNKNOWN_FLAG_NUMBER_02523                   : 2523,
		UNKNOWN_FLAG_NUMBER_02524                   : 2524,
		UNKNOWN_FLAG_NUMBER_02525                   : 2525,
		UNKNOWN_FLAG_NUMBER_02526                   : 2526,
		UNKNOWN_FLAG_NUMBER_02527                   : 2527,
		UNKNOWN_FLAG_NUMBER_02528                   : 2528,
		UNKNOWN_FLAG_NUMBER_02529                   : 2529,
		UNKNOWN_FLAG_NUMBER_02530                   : 2530,
		UNKNOWN_FLAG_NUMBER_02531                   : 2531,
		UNKNOWN_FLAG_NUMBER_02532                   : 2532,
		UNKNOWN_FLAG_NUMBER_02533                   : 2533,
		UNKNOWN_FLAG_NUMBER_02534                   : 2534,
		UNKNOWN_FLAG_NUMBER_02535                   : 2535,
		UNKNOWN_FLAG_NUMBER_02536                   : 2536,
		UNKNOWN_FLAG_NUMBER_02537                   : 2537,
		UNKNOWN_FLAG_NUMBER_02538                   : 2538,
		UNKNOWN_FLAG_NUMBER_02539                   : 2539,
		UNKNOWN_FLAG_NUMBER_02540                   : 2540,
		UNKNOWN_FLAG_NUMBER_02541                   : 2541,
		UNKNOWN_FLAG_NUMBER_02542                   : 2542,
		UNKNOWN_FLAG_NUMBER_02543                   : 2543,
		UNKNOWN_FLAG_NUMBER_02544                   : 2544,
		UNKNOWN_FLAG_NUMBER_02545                   : 2545,
		UNKNOWN_FLAG_NUMBER_02546                   : 2546,
		UNKNOWN_FLAG_NUMBER_02547                   : 2547,
		UNKNOWN_FLAG_NUMBER_02548                   : 2548,
		UNKNOWN_FLAG_NUMBER_02549                   : 2549,
		UNKNOWN_FLAG_NUMBER_02550                   : 2550,
		UNKNOWN_FLAG_NUMBER_02551                   : 2551,
		UNKNOWN_FLAG_NUMBER_02552                   : 2552,
		UNKNOWN_FLAG_NUMBER_02553                   : 2553,
		UNKNOWN_FLAG_NUMBER_02554                   : 2554,
		UNKNOWN_FLAG_NUMBER_02555                   : 2555,
		UNKNOWN_FLAG_NUMBER_02556                   : 2556,
		UNKNOWN_FLAG_NUMBER_02557                   : 2557,
		UNKNOWN_FLAG_NUMBER_02558                   : 2558,
		UNKNOWN_FLAG_NUMBER_02559                   : 2559,
		UNKNOWN_FLAG_NUMBER_02560                   : 2560,
		UNKNOWN_FLAG_NUMBER_02561                   : 2561,
		UNKNOWN_FLAG_NUMBER_02562                   : 2562,
		UNKNOWN_FLAG_NUMBER_02563                   : 2563,
		UNKNOWN_FLAG_NUMBER_02564                   : 2564,
		UNKNOWN_FLAG_NUMBER_02565                   : 2565,
		UNKNOWN_FLAG_NUMBER_02566                   : 2566,
		UNKNOWN_FLAG_NUMBER_02567                   : 2567,
		UNKNOWN_FLAG_NUMBER_02568                   : 2568,
		UNKNOWN_FLAG_NUMBER_02569                   : 2569,
		UNKNOWN_FLAG_NUMBER_02570                   : 2570,
		UNKNOWN_FLAG_NUMBER_02571                   : 2571,
		UNKNOWN_FLAG_NUMBER_02572                   : 2572,
		UNKNOWN_FLAG_NUMBER_02573                   : 2573,
		UNKNOWN_FLAG_NUMBER_02574                   : 2574,
		UNKNOWN_FLAG_NUMBER_02575                   : 2575,
		UNKNOWN_FLAG_NUMBER_02576                   : 2576,
		UNKNOWN_FLAG_NUMBER_02577                   : 2577,
		UNKNOWN_FLAG_NUMBER_02578                   : 2578,
		UNKNOWN_FLAG_NUMBER_02579                   : 2579,
		UNKNOWN_FLAG_NUMBER_02580                   : 2580,
		UNKNOWN_FLAG_NUMBER_02581                   : 2581,
		UNKNOWN_FLAG_NUMBER_02582                   : 2582,
		UNKNOWN_FLAG_NUMBER_02583                   : 2583,
		UNKNOWN_FLAG_NUMBER_02584                   : 2584,
		UNKNOWN_FLAG_NUMBER_02585                   : 2585,
		UNKNOWN_FLAG_NUMBER_02586                   : 2586,
		UNKNOWN_FLAG_NUMBER_02587                   : 2587,
		UNKNOWN_FLAG_NUMBER_02588                   : 2588,
		UNKNOWN_FLAG_NUMBER_02589                   : 2589,
		UNKNOWN_FLAG_NUMBER_02590                   : 2590,
		UNKNOWN_FLAG_NUMBER_02591                   : 2591,
		UNKNOWN_FLAG_NUMBER_02592                   : 2592,
		UNKNOWN_FLAG_NUMBER_02593                   : 2593,
		UNKNOWN_FLAG_NUMBER_02594                   : 2594,
		UNKNOWN_FLAG_NUMBER_02595                   : 2595,
		UNKNOWN_FLAG_NUMBER_02596                   : 2596,
		UNKNOWN_FLAG_NUMBER_02597                   : 2597,
		UNKNOWN_FLAG_NUMBER_02598                   : 2598,
		UNKNOWN_FLAG_NUMBER_02599                   : 2599,
		UNKNOWN_FLAG_NUMBER_02600                   : 2600,
		UNKNOWN_FLAG_NUMBER_02601                   : 2601,
		UNKNOWN_FLAG_NUMBER_02602                   : 2602,
		UNKNOWN_FLAG_NUMBER_02603                   : 2603,
		UNKNOWN_FLAG_NUMBER_02604                   : 2604,
		UNKNOWN_FLAG_NUMBER_02605                   : 2605,
		UNKNOWN_FLAG_NUMBER_02606                   : 2606,
		UNKNOWN_FLAG_NUMBER_02607                   : 2607,
		UNKNOWN_FLAG_NUMBER_02608                   : 2608,
		UNKNOWN_FLAG_NUMBER_02609                   : 2609,
		UNKNOWN_FLAG_NUMBER_02610                   : 2610,
		UNKNOWN_FLAG_NUMBER_02611                   : 2611,
		UNKNOWN_FLAG_NUMBER_02612                   : 2612,
		UNKNOWN_FLAG_NUMBER_02613                   : 2613,
		UNKNOWN_FLAG_NUMBER_02614                   : 2614,
		UNKNOWN_FLAG_NUMBER_02615                   : 2615,
		UNKNOWN_FLAG_NUMBER_02616                   : 2616,
		UNKNOWN_FLAG_NUMBER_02617                   : 2617,
		UNKNOWN_FLAG_NUMBER_02618                   : 2618,
		UNKNOWN_FLAG_NUMBER_02619                   : 2619,
		UNKNOWN_FLAG_NUMBER_02620                   : 2620,
		UNKNOWN_FLAG_NUMBER_02621                   : 2621,
		UNKNOWN_FLAG_NUMBER_02622                   : 2622,
		UNKNOWN_FLAG_NUMBER_02623                   : 2623,
		UNKNOWN_FLAG_NUMBER_02624                   : 2624,
		UNKNOWN_FLAG_NUMBER_02625                   : 2625,
		UNKNOWN_FLAG_NUMBER_02626                   : 2626,
		UNKNOWN_FLAG_NUMBER_02627                   : 2627,
		UNKNOWN_FLAG_NUMBER_02628                   : 2628,
		UNKNOWN_FLAG_NUMBER_02629                   : 2629,
		UNKNOWN_FLAG_NUMBER_02630                   : 2630,
		UNKNOWN_FLAG_NUMBER_02631                   : 2631,
		UNKNOWN_FLAG_NUMBER_02632                   : 2632,
		UNKNOWN_FLAG_NUMBER_02633                   : 2633,
		UNKNOWN_FLAG_NUMBER_02634                   : 2634,
		UNKNOWN_FLAG_NUMBER_02635                   : 2635,
		UNKNOWN_FLAG_NUMBER_02636                   : 2636,
		UNKNOWN_FLAG_NUMBER_02637                   : 2637,
		UNKNOWN_FLAG_NUMBER_02638                   : 2638,
		UNKNOWN_FLAG_NUMBER_02639                   : 2639,
		UNKNOWN_FLAG_NUMBER_02640                   : 2640,
		UNKNOWN_FLAG_NUMBER_02641                   : 2641,
		UNKNOWN_FLAG_NUMBER_02642                   : 2642,
		UNKNOWN_FLAG_NUMBER_02643                   : 2643,
		UNKNOWN_FLAG_NUMBER_02644                   : 2644,
		UNKNOWN_FLAG_NUMBER_02645                   : 2645,
		UNKNOWN_FLAG_NUMBER_02646                   : 2646,
		UNKNOWN_FLAG_NUMBER_02647                   : 2647,
		UNKNOWN_FLAG_NUMBER_02648                   : 2648,
		UNKNOWN_FLAG_NUMBER_02649                   : 2649,
		UNKNOWN_FLAG_NUMBER_02650                   : 2650,
		UNKNOWN_FLAG_NUMBER_02651                   : 2651,
		UNKNOWN_FLAG_NUMBER_02652                   : 2652,
		UNKNOWN_FLAG_NUMBER_02653                   : 2653,
		UNKNOWN_FLAG_NUMBER_02654                   : 2654,
		UNKNOWN_FLAG_NUMBER_02655                   : 2655,
		UNKNOWN_FLAG_NUMBER_02656                   : 2656,
		UNKNOWN_FLAG_NUMBER_02657                   : 2657,
		UNKNOWN_FLAG_NUMBER_02658                   : 2658,
		UNKNOWN_FLAG_NUMBER_02659                   : 2659,
		UNKNOWN_FLAG_NUMBER_02660                   : 2660,
		UNKNOWN_FLAG_NUMBER_02661                   : 2661,
		UNKNOWN_FLAG_NUMBER_02662                   : 2662,
		UNKNOWN_FLAG_NUMBER_02663                   : 2663,
		UNKNOWN_FLAG_NUMBER_02664                   : 2664,
		UNKNOWN_FLAG_NUMBER_02665                   : 2665,
		UNKNOWN_FLAG_NUMBER_02666                   : 2666,
		UNKNOWN_FLAG_NUMBER_02667                   : 2667,
		UNKNOWN_FLAG_NUMBER_02668                   : 2668,
		UNKNOWN_FLAG_NUMBER_02669                   : 2669,
		UNKNOWN_FLAG_NUMBER_02670                   : 2670,
		UNKNOWN_FLAG_NUMBER_02671                   : 2671,
		UNKNOWN_FLAG_NUMBER_02672                   : 2672,
		UNKNOWN_FLAG_NUMBER_02673                   : 2673,
		UNKNOWN_FLAG_NUMBER_02674                   : 2674,
		UNKNOWN_FLAG_NUMBER_02675                   : 2675,
		UNKNOWN_FLAG_NUMBER_02676                   : 2676,
		UNKNOWN_FLAG_NUMBER_02677                   : 2677,
		UNKNOWN_FLAG_NUMBER_02678                   : 2678,
		UNKNOWN_FLAG_NUMBER_02679                   : 2679,
		UNKNOWN_FLAG_NUMBER_02680                   : 2680,
		UNKNOWN_FLAG_NUMBER_02681                   : 2681,
		UNKNOWN_FLAG_NUMBER_02682                   : 2682,
		UNKNOWN_FLAG_NUMBER_02683                   : 2683,
		UNKNOWN_FLAG_NUMBER_02684                   : 2684,
		UNKNOWN_FLAG_NUMBER_02685                   : 2685,
		UNKNOWN_FLAG_NUMBER_02686                   : 2686,
		UNKNOWN_FLAG_NUMBER_02687                   : 2687,
		UNKNOWN_FLAG_NUMBER_02688                   : 2688,
		UNKNOWN_FLAG_NUMBER_02689                   : 2689,
		UNKNOWN_FLAG_NUMBER_02690                   : 2690,
		UNKNOWN_FLAG_NUMBER_02691                   : 2691,
		UNKNOWN_FLAG_NUMBER_02692                   : 2692,
		UNKNOWN_FLAG_NUMBER_02693                   : 2693,
		UNKNOWN_FLAG_NUMBER_02694                   : 2694,
		UNKNOWN_FLAG_NUMBER_02695                   : 2695,
		UNKNOWN_FLAG_NUMBER_02696                   : 2696,
		UNKNOWN_FLAG_NUMBER_02697                   : 2697,
		UNKNOWN_FLAG_NUMBER_02698                   : 2698,
		UNKNOWN_FLAG_NUMBER_02699                   : 2699,
		UNKNOWN_FLAG_NUMBER_02700                   : 2700,
		UNKNOWN_FLAG_NUMBER_02701                   : 2701,
		UNKNOWN_FLAG_NUMBER_02702                   : 2702,
		UNKNOWN_FLAG_NUMBER_02703                   : 2703,
		UNKNOWN_FLAG_NUMBER_02704                   : 2704,
		UNKNOWN_FLAG_NUMBER_02705                   : 2705,
		UNKNOWN_FLAG_NUMBER_02706                   : 2706,
		UNKNOWN_FLAG_NUMBER_02707                   : 2707,
		UNKNOWN_FLAG_NUMBER_02708                   : 2708,
		UNKNOWN_FLAG_NUMBER_02709                   : 2709,
		UNKNOWN_FLAG_NUMBER_02710                   : 2710,
		UNKNOWN_FLAG_NUMBER_02711                   : 2711,
		UNKNOWN_FLAG_NUMBER_02712                   : 2712,
		UNKNOWN_FLAG_NUMBER_02713                   : 2713,
		UNKNOWN_FLAG_NUMBER_02714                   : 2714,
		UNKNOWN_FLAG_NUMBER_02715                   : 2715,
		UNKNOWN_FLAG_NUMBER_02716                   : 2716,
		UNKNOWN_FLAG_NUMBER_02717                   : 2717,
		UNKNOWN_FLAG_NUMBER_02718                   : 2718,
		UNKNOWN_FLAG_NUMBER_02719                   : 2719,
		UNKNOWN_FLAG_NUMBER_02720                   : 2720,
		UNKNOWN_FLAG_NUMBER_02721                   : 2721,
		UNKNOWN_FLAG_NUMBER_02722                   : 2722,
		UNKNOWN_FLAG_NUMBER_02723                   : 2723,
		UNKNOWN_FLAG_NUMBER_02724                   : 2724,
		UNKNOWN_FLAG_NUMBER_02725                   : 2725,
		UNKNOWN_FLAG_NUMBER_02726                   : 2726,
		UNKNOWN_FLAG_NUMBER_02727                   : 2727,
		UNKNOWN_FLAG_NUMBER_02728                   : 2728,
		UNKNOWN_FLAG_NUMBER_02729                   : 2729,
		UNKNOWN_FLAG_NUMBER_02730                   : 2730,
		UNKNOWN_FLAG_NUMBER_02731                   : 2731,
		UNKNOWN_FLAG_NUMBER_02732                   : 2732,
		UNKNOWN_FLAG_NUMBER_02733                   : 2733,
		UNKNOWN_FLAG_NUMBER_02734                   : 2734,
		UNKNOWN_FLAG_NUMBER_02735                   : 2735,
		UNKNOWN_FLAG_NUMBER_02736                   : 2736,
		UNKNOWN_FLAG_NUMBER_02737                   : 2737,
		UNKNOWN_FLAG_NUMBER_02738                   : 2738,
		UNKNOWN_FLAG_NUMBER_02739                   : 2739,
		UNKNOWN_FLAG_NUMBER_02740                   : 2740,
		UNKNOWN_FLAG_NUMBER_02741                   : 2741,
		UNKNOWN_FLAG_NUMBER_02742                   : 2742,
		UNKNOWN_FLAG_NUMBER_02743                   : 2743,
		UNKNOWN_FLAG_NUMBER_02744                   : 2744,
		UNKNOWN_FLAG_NUMBER_02745                   : 2745,
		UNKNOWN_FLAG_NUMBER_02746                   : 2746,
		UNKNOWN_FLAG_NUMBER_02747                   : 2747,
		UNKNOWN_FLAG_NUMBER_02748                   : 2748,
		UNKNOWN_FLAG_NUMBER_02749                   : 2749,
		UNKNOWN_FLAG_NUMBER_02750                   : 2750,
		UNKNOWN_FLAG_NUMBER_02751                   : 2751,
		UNKNOWN_FLAG_NUMBER_02752                   : 2752,
		UNKNOWN_FLAG_NUMBER_02753                   : 2753,
		UNKNOWN_FLAG_NUMBER_02754                   : 2754,
		UNKNOWN_FLAG_NUMBER_02755                   : 2755,
		UNKNOWN_FLAG_NUMBER_02756                   : 2756,
		UNKNOWN_FLAG_NUMBER_02757                   : 2757,
		UNKNOWN_FLAG_NUMBER_02758                   : 2758,
		UNKNOWN_FLAG_NUMBER_02759                   : 2759,
		UNKNOWN_FLAG_NUMBER_02760                   : 2760,
		UNKNOWN_FLAG_NUMBER_02761                   : 2761,
		UNKNOWN_FLAG_NUMBER_02762                   : 2762,
		UNKNOWN_FLAG_NUMBER_02763                   : 2763,
		UNKNOWN_FLAG_NUMBER_02764                   : 2764,
		UNKNOWN_FLAG_NUMBER_02765                   : 2765,
		UNKNOWN_FLAG_NUMBER_02766                   : 2766,
		UNKNOWN_FLAG_NUMBER_02767                   : 2767,
		UNKNOWN_FLAG_NUMBER_02768                   : 2768,
		UNKNOWN_FLAG_NUMBER_02769                   : 2769,
		UNKNOWN_FLAG_NUMBER_02770                   : 2770,
		UNKNOWN_FLAG_NUMBER_02771                   : 2771,
		UNKNOWN_FLAG_NUMBER_02772                   : 2772,
		UNKNOWN_FLAG_NUMBER_02773                   : 2773,
		UNKNOWN_FLAG_NUMBER_02774                   : 2774,
		UNKNOWN_FLAG_NUMBER_02775                   : 2775,
		UNKNOWN_FLAG_NUMBER_02776                   : 2776,
		UNKNOWN_FLAG_NUMBER_02777                   : 2777,
		UNKNOWN_FLAG_NUMBER_02778                   : 2778,
		UNKNOWN_FLAG_NUMBER_02779                   : 2779,
		UNKNOWN_FLAG_NUMBER_02780                   : 2780,
		UNKNOWN_FLAG_NUMBER_02781                   : 2781,
		UNKNOWN_FLAG_NUMBER_02782                   : 2782,
		UNKNOWN_FLAG_NUMBER_02783                   : 2783,
		UNKNOWN_FLAG_NUMBER_02784                   : 2784,
		UNKNOWN_FLAG_NUMBER_02785                   : 2785,
		UNKNOWN_FLAG_NUMBER_02786                   : 2786,
		UNKNOWN_FLAG_NUMBER_02787                   : 2787,
		UNKNOWN_FLAG_NUMBER_02788                   : 2788,
		UNKNOWN_FLAG_NUMBER_02789                   : 2789,
		UNKNOWN_FLAG_NUMBER_02790                   : 2790,
		UNKNOWN_FLAG_NUMBER_02791                   : 2791,
		UNKNOWN_FLAG_NUMBER_02792                   : 2792,
		UNKNOWN_FLAG_NUMBER_02793                   : 2793,
		UNKNOWN_FLAG_NUMBER_02794                   : 2794,
		UNKNOWN_FLAG_NUMBER_02795                   : 2795,
		UNKNOWN_FLAG_NUMBER_02796                   : 2796,
		UNKNOWN_FLAG_NUMBER_02797                   : 2797,
		UNKNOWN_FLAG_NUMBER_02798                   : 2798,
		UNKNOWN_FLAG_NUMBER_02799                   : 2799,
		UNKNOWN_FLAG_NUMBER_02800                   : 2800,
		UNKNOWN_FLAG_NUMBER_02801                   : 2801,
		UNKNOWN_FLAG_NUMBER_02802                   : 2802,
		UNKNOWN_FLAG_NUMBER_02803                   : 2803,
		UNKNOWN_FLAG_NUMBER_02804                   : 2804,
		UNKNOWN_FLAG_NUMBER_02805                   : 2805,
		UNKNOWN_FLAG_NUMBER_02806                   : 2806,
		UNKNOWN_FLAG_NUMBER_02807                   : 2807,
		UNKNOWN_FLAG_NUMBER_02808                   : 2808,
		UNKNOWN_FLAG_NUMBER_02809                   : 2809,
		UNKNOWN_FLAG_NUMBER_02810                   : 2810,
		UNKNOWN_FLAG_NUMBER_02811                   : 2811,
		UNKNOWN_FLAG_NUMBER_02812                   : 2812,
		UNKNOWN_FLAG_NUMBER_02813                   : 2813,
		UNKNOWN_FLAG_NUMBER_02814                   : 2814,
		UNKNOWN_FLAG_NUMBER_02815                   : 2815,
		UNKNOWN_FLAG_NUMBER_02816                   : 2816,
		UNKNOWN_FLAG_NUMBER_02817                   : 2817,
		UNKNOWN_FLAG_NUMBER_02818                   : 2818,
		UNKNOWN_FLAG_NUMBER_02819                   : 2819,
		UNKNOWN_FLAG_NUMBER_02820                   : 2820,
		UNKNOWN_FLAG_NUMBER_02821                   : 2821,
		UNKNOWN_FLAG_NUMBER_02822                   : 2822,
		UNKNOWN_FLAG_NUMBER_02823                   : 2823,
		UNKNOWN_FLAG_NUMBER_02824                   : 2824,
		UNKNOWN_FLAG_NUMBER_02825                   : 2825,
		UNKNOWN_FLAG_NUMBER_02826                   : 2826,
		UNKNOWN_FLAG_NUMBER_02827                   : 2827,
		UNKNOWN_FLAG_NUMBER_02828                   : 2828,
		UNKNOWN_FLAG_NUMBER_02829                   : 2829,
		UNKNOWN_FLAG_NUMBER_02830                   : 2830,
		UNKNOWN_FLAG_NUMBER_02831                   : 2831,
		UNKNOWN_FLAG_NUMBER_02832                   : 2832,
		UNKNOWN_FLAG_NUMBER_02833                   : 2833,
		UNKNOWN_FLAG_NUMBER_02834                   : 2834,
		UNKNOWN_FLAG_NUMBER_02835                   : 2835,
		UNKNOWN_FLAG_NUMBER_02836                   : 2836,
		UNKNOWN_FLAG_NUMBER_02837                   : 2837,
		UNKNOWN_FLAG_NUMBER_02838                   : 2838,
		UNKNOWN_FLAG_NUMBER_02839                   : 2839,
		UNKNOWN_FLAG_NUMBER_02840                   : 2840,
		UNKNOWN_FLAG_NUMBER_02841                   : 2841,
		UNKNOWN_FLAG_NUMBER_02842                   : 2842,
		UNKNOWN_FLAG_NUMBER_02843                   : 2843,
		UNKNOWN_FLAG_NUMBER_02844                   : 2844,
		UNKNOWN_FLAG_NUMBER_02845                   : 2845,
		UNKNOWN_FLAG_NUMBER_02846                   : 2846,
		UNKNOWN_FLAG_NUMBER_02847                   : 2847,
		UNKNOWN_FLAG_NUMBER_02848                   : 2848,
		UNKNOWN_FLAG_NUMBER_02849                   : 2849,
		UNKNOWN_FLAG_NUMBER_02850                   : 2850,
		UNKNOWN_FLAG_NUMBER_02851                   : 2851,
		UNKNOWN_FLAG_NUMBER_02852                   : 2852,
		UNKNOWN_FLAG_NUMBER_02853                   : 2853,
		UNKNOWN_FLAG_NUMBER_02854                   : 2854,
		UNKNOWN_FLAG_NUMBER_02855                   : 2855,
		UNKNOWN_FLAG_NUMBER_02856                   : 2856,
		UNKNOWN_FLAG_NUMBER_02857                   : 2857,
		UNKNOWN_FLAG_NUMBER_02858                   : 2858,
		UNKNOWN_FLAG_NUMBER_02859                   : 2859,
		UNKNOWN_FLAG_NUMBER_02860                   : 2860,
		UNKNOWN_FLAG_NUMBER_02861                   : 2861,
		UNKNOWN_FLAG_NUMBER_02862                   : 2862,
		UNKNOWN_FLAG_NUMBER_02863                   : 2863,
		UNKNOWN_FLAG_NUMBER_02864                   : 2864,
		UNKNOWN_FLAG_NUMBER_02865                   : 2865,
		UNKNOWN_FLAG_NUMBER_02866                   : 2866,
		UNKNOWN_FLAG_NUMBER_02867                   : 2867,
		UNKNOWN_FLAG_NUMBER_02868                   : 2868,
		UNKNOWN_FLAG_NUMBER_02869                   : 2869,
		UNKNOWN_FLAG_NUMBER_02870                   : 2870,
		UNKNOWN_FLAG_NUMBER_02871                   : 2871,
		UNKNOWN_FLAG_NUMBER_02872                   : 2872,
		UNKNOWN_FLAG_NUMBER_02873                   : 2873,
		UNKNOWN_FLAG_NUMBER_02874                   : 2874,
		UNKNOWN_FLAG_NUMBER_02875                   : 2875,
		UNKNOWN_FLAG_NUMBER_02876                   : 2876,
		UNKNOWN_FLAG_NUMBER_02877                   : 2877,
		UNKNOWN_FLAG_NUMBER_02878                   : 2878,
		UNKNOWN_FLAG_NUMBER_02879                   : 2879,
		UNKNOWN_FLAG_NUMBER_02880                   : 2880,
		UNKNOWN_FLAG_NUMBER_02881                   : 2881,
		UNKNOWN_FLAG_NUMBER_02882                   : 2882,
		UNKNOWN_FLAG_NUMBER_02883                   : 2883,
		UNKNOWN_FLAG_NUMBER_02884                   : 2884,
		UNKNOWN_FLAG_NUMBER_02885                   : 2885,
		UNKNOWN_FLAG_NUMBER_02886                   : 2886,
		UNKNOWN_FLAG_NUMBER_02887                   : 2887,
		UNKNOWN_FLAG_NUMBER_02888                   : 2888,
		UNKNOWN_FLAG_NUMBER_02889                   : 2889,
		UNKNOWN_FLAG_NUMBER_02890                   : 2890,
		UNKNOWN_FLAG_NUMBER_02891                   : 2891,
		UNKNOWN_FLAG_NUMBER_02892                   : 2892,
		UNKNOWN_FLAG_NUMBER_02893                   : 2893,
		UNKNOWN_FLAG_NUMBER_02894                   : 2894,
		UNKNOWN_FLAG_NUMBER_02895                   : 2895,
		UNKNOWN_FLAG_NUMBER_02896                   : 2896,
		UNKNOWN_FLAG_NUMBER_02897                   : 2897,
		UNKNOWN_FLAG_NUMBER_02898                   : 2898,
		UNKNOWN_FLAG_NUMBER_02899                   : 2899,
		UNKNOWN_FLAG_NUMBER_02900                   : 2900,
		UNKNOWN_FLAG_NUMBER_02901                   : 2901,
		UNKNOWN_FLAG_NUMBER_02902                   : 2902,
		UNKNOWN_FLAG_NUMBER_02903                   : 2903,
		UNKNOWN_FLAG_NUMBER_02904                   : 2904,
		UNKNOWN_FLAG_NUMBER_02905                   : 2905,
		UNKNOWN_FLAG_NUMBER_02906                   : 2906,
		UNKNOWN_FLAG_NUMBER_02907                   : 2907,
		UNKNOWN_FLAG_NUMBER_02908                   : 2908,
		UNKNOWN_FLAG_NUMBER_02909                   : 2909,
		UNKNOWN_FLAG_NUMBER_02910                   : 2910,
		UNKNOWN_FLAG_NUMBER_02911                   : 2911,
		UNKNOWN_FLAG_NUMBER_02912                   : 2912,
		UNKNOWN_FLAG_NUMBER_02913                   : 2913,
		UNKNOWN_FLAG_NUMBER_02914                   : 2914,
		UNKNOWN_FLAG_NUMBER_02915                   : 2915,
		UNKNOWN_FLAG_NUMBER_02916                   : 2916,
		UNKNOWN_FLAG_NUMBER_02917                   : 2917,
		UNKNOWN_FLAG_NUMBER_02918                   : 2918,
		UNKNOWN_FLAG_NUMBER_02919                   : 2919,
		UNKNOWN_FLAG_NUMBER_02920                   : 2920,
		UNKNOWN_FLAG_NUMBER_02921                   : 2921,
		UNKNOWN_FLAG_NUMBER_02922                   : 2922,
		UNKNOWN_FLAG_NUMBER_02923                   : 2923,
		UNKNOWN_FLAG_NUMBER_02924                   : 2924,
		UNKNOWN_FLAG_NUMBER_02925                   : 2925,
		UNKNOWN_FLAG_NUMBER_02926                   : 2926,
		UNKNOWN_FLAG_NUMBER_02927                   : 2927,
		UNKNOWN_FLAG_NUMBER_02928                   : 2928,
		UNKNOWN_FLAG_NUMBER_02929                   : 2929,
		UNKNOWN_FLAG_NUMBER_02930                   : 2930,
		UNKNOWN_FLAG_NUMBER_02931                   : 2931,
		UNKNOWN_FLAG_NUMBER_02932                   : 2932,
		UNKNOWN_FLAG_NUMBER_02933                   : 2933,
		UNKNOWN_FLAG_NUMBER_02934                   : 2934,
		UNKNOWN_FLAG_NUMBER_02935                   : 2935,
		UNKNOWN_FLAG_NUMBER_02936                   : 2936,
		UNKNOWN_FLAG_NUMBER_02937                   : 2937,
		UNKNOWN_FLAG_NUMBER_02938                   : 2938,
		UNKNOWN_FLAG_NUMBER_02939                   : 2939,
		UNKNOWN_FLAG_NUMBER_02940                   : 2940,
		UNKNOWN_FLAG_NUMBER_02941                   : 2941,
		UNKNOWN_FLAG_NUMBER_02942                   : 2942,
		UNKNOWN_FLAG_NUMBER_02943                   : 2943,
		UNKNOWN_FLAG_NUMBER_02944                   : 2944,
		UNKNOWN_FLAG_NUMBER_02945                   : 2945,
		UNKNOWN_FLAG_NUMBER_02946                   : 2946,
		UNKNOWN_FLAG_NUMBER_02947                   : 2947,
		UNKNOWN_FLAG_NUMBER_02948                   : 2948,
		UNKNOWN_FLAG_NUMBER_02949                   : 2949,
		UNKNOWN_FLAG_NUMBER_02950                   : 2950,
		UNKNOWN_FLAG_NUMBER_02951                   : 2951,
		UNKNOWN_FLAG_NUMBER_02952                   : 2952,
		UNKNOWN_FLAG_NUMBER_02953                   : 2953,
		UNKNOWN_FLAG_NUMBER_02954                   : 2954,
		UNKNOWN_FLAG_NUMBER_02955                   : 2955,
		UNKNOWN_FLAG_NUMBER_02956                   : 2956,
		UNKNOWN_FLAG_NUMBER_02957                   : 2957,
		UNKNOWN_FLAG_NUMBER_02958                   : 2958,
		UNKNOWN_FLAG_NUMBER_02959                   : 2959,
		UNKNOWN_FLAG_NUMBER_02960                   : 2960,
		UNKNOWN_FLAG_NUMBER_02961                   : 2961,
		UNKNOWN_FLAG_NUMBER_02962                   : 2962,
		UNKNOWN_FLAG_NUMBER_02963                   : 2963,
		UNKNOWN_FLAG_NUMBER_02964                   : 2964,
		UNKNOWN_FLAG_NUMBER_02965                   : 2965,
		UNKNOWN_FLAG_NUMBER_02966                   : 2966,
		UNKNOWN_FLAG_NUMBER_02967                   : 2967,
		UNKNOWN_FLAG_NUMBER_02968                   : 2968,
		UNKNOWN_FLAG_NUMBER_02969                   : 2969,
		UNKNOWN_FLAG_NUMBER_02970                   : 2970,
		UNKNOWN_FLAG_NUMBER_02971                   : 2971,
		UNKNOWN_FLAG_NUMBER_02972                   : 2972,
		UNKNOWN_FLAG_NUMBER_02973                   : 2973,
		UNKNOWN_FLAG_NUMBER_02974                   : 2974,
		UNKNOWN_FLAG_NUMBER_02975                   : 2975,
		UNKNOWN_FLAG_NUMBER_02976                   : 2976,
		UNKNOWN_FLAG_NUMBER_02977                   : 2977,
		UNKNOWN_FLAG_NUMBER_02978                   : 2978,
		UNKNOWN_FLAG_NUMBER_02979                   : 2979,
		UNKNOWN_FLAG_NUMBER_02980                   : 2980,
		UNKNOWN_FLAG_NUMBER_02981                   : 2981,
		UNKNOWN_FLAG_NUMBER_02982                   : 2982,
		UNKNOWN_FLAG_NUMBER_02983                   : 2983,
		UNKNOWN_FLAG_NUMBER_02984                   : 2984,
		UNKNOWN_FLAG_NUMBER_02985                   : 2985,
		UNKNOWN_FLAG_NUMBER_02986                   : 2986,
		UNKNOWN_FLAG_NUMBER_02987                   : 2987,
		UNKNOWN_FLAG_NUMBER_02988                   : 2988,
		UNKNOWN_FLAG_NUMBER_02989                   : 2989,
		UNKNOWN_FLAG_NUMBER_02990                   : 2990,
		UNKNOWN_FLAG_NUMBER_02991                   : 2991,
		UNKNOWN_FLAG_NUMBER_02992                   : 2992,
		UNKNOWN_FLAG_NUMBER_02993                   : 2993,
		UNKNOWN_FLAG_NUMBER_02994                   : 2994,
		UNKNOWN_FLAG_NUMBER_02995                   : 2995,
		ITS_EVERY_DAY                               : 2996, // all special calender events occur every day!
		LOW_STANDARDS_FOR_ALL                       : 2997,
		HYPER_HAPPY                                 : 2998,
		UNKNOWN_FLAG_NUMBER_02999                   : 2999 // ------------------------- Jojo Debug Flag?
	};
});
