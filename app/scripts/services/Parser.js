'use strict';

angular.module( 'cocjs' ).factory( 'Parser', function( SceneLib, $log, CoC, CoC_Settings, kFLAGS, $showdown, Descriptors ) {
	function Parser() {
		this.init( this, arguments );
	}
	Parser.prototype.init = function( that ) {
		// this.parserState is used to store the scene-parser state.
		// it is cleared every time recursiveParser is called, and then any scene tags are added
		// as parserState['sceneName'] = 'scene content'
		that.parserState = {};
		that.buttonNum = 0;
	};
	/**
	 this.Parser Syntax:
	 // Querying simple PC stat nouns:
	 [noun]
	 Conditional statements:
	 // Simple if statement:
	 [if (condition) OUTPUT_IF_TRUE]
	 // If-Else statement
	 [if (condition) OUTPUT_IF_TRUE | OUTPUT_IF_FALSE]
	 // Note - Implicit else indicated by presence of the '|'
	 // Object aspect descriptions
	 [object aspect]
	 // gets the description of aspect 'aspect' of object/NPC/PC 'object'
	 // Eventually, I want this to be able to use introspection to access class attributes directly
	 // Maybe even manipulate them, though I haven\'t thought that out much at the moment.
	 // Gender Pronoun Weirdness:
	 // PRONOUNS: The parser uses Elverson/Spivak Pronouns specifically to allow characters to be written with non-specific genders.
	 // http://en.wikipedia.org/wiki/Spivak_pronoun
	 //
	 // Cheat Table:
	 //           | Subject    | Object       | Possessive Adjective | Possessive Pronoun | Reflexive         |
	 // Agendered | ey laughs  | I hugged em  | eir heart warmed     | that is eirs       | ey loves emself   |
	 // Masculine | he laughs  | I hugged him | his heart warmed     | that is his        | he loves himself  |
	 // Feminine  | she laughs | I hugged her | her heart warmed     | that is hers       | she loves herself |

	 [screen (SCREEN_NAME) | screen text]
	 // creates a new screen/page.
	 [button (SCREEN_NAME)| button_text]
	 // Creates a button which jumps to SCREEN_NAME when clicked
	 **/
	// provides singleArgConverters
	Parser.singleArgConverters = {
		// all the errors related to trying to parse stuff if not present are
		// already handled in the various *Descript() functions.
		// no need to duplicate them.
		// Note: all key strings MUST be ENTIRELY lowercase.
		"agility"					: function() { return "[Agility]"; },
		"armor"						: function() { return CoC.player.armorName;},
		"armorname"					: function() { return CoC.player.armorName;},
		"ass"						: function() { return Descriptors.buttDescript();},
		"asshole"					: function() { return Descriptors.assholeDescript(); },
		"balls"						: function() { return Descriptors.ballsDescriptLight(); },
		"boyfriend"					: function() { return CoC.player.mf("boyfriend", "girlfriend"); },
		"butt"						: function() { return Descriptors.buttDescript();},
		"butthole"					: function() { return Descriptors.assholeDescript();},
		"chest"						: function() { return Descriptors.chestDesc(); },
		"clit"						: function() { return Descriptors.clitDescript(); },
		"cock"						: function() { return CoC.player.cockDescript(0);},
		"cockhead"					: function() { return CoC.player.cockHead(0);},
		"cocks"						: function() { return CoC.player.multiCockDescriptLight(); },
		"cunt"						: function() { return Descriptors.vaginaDescript(); },
		"eachcock"					: function() { return CoC.player.sMultiCockDesc();},
		"evade"						: function() { return "[Evade]"; },
		"face"						: function() { return CoC.player.face(); },
		"feet"						: function() { return CoC.player.feet(); },
		"foot"						: function() { return CoC.player.foot(); },
		"fullchest"					: function() { return CoC.player.allChestDesc(); },
		"hair"						: function() { return Descriptors.hairDescript(); },
		"hairorfur"					: function() { return Descriptors.hairOrFur(); },
		"he"						: function() { return CoC.player.mf("he", "she"); },
		"he2"						: function() { return CoC.player2.mf("he", "she"); },
		"him"						: function() { return CoC.player.mf("him", "her"); },
		"him2"						: function() { return CoC.player2.mf("him", "her"); },
		"himself"					: function() { return CoC.player.mf("himself", "herself"); },
		"herself"					: function() { return CoC.player.mf("himself", "herself"); },
		"hips"						: function() { return Descriptors.hipDescript();},
		"his"						: function() { return CoC.player.mf("his", "her"); },
		"his2"						: function() { return CoC.player2.mf("his","her"); },
		"leg"						: function() { return CoC.player.leg(); },
		"legs"						: function() { return CoC.player.legs(); },
		"man"						: function() { return CoC.player.mf("man", "woman"); },
		"men"						: function() { return CoC.player.mf("men", "women"); },
		"master"					: function() { return CoC.player.mf("master","mistress"); },
		"misdirection"				: function() { return "[Misdirection]"; },
		"multicock"					: function() { return CoC.player.multiCockDescriptLight(); },
		"multicockdescriptlight"	: function() { return CoC.player.multiCockDescriptLight(); },
		"name"						: function() { return CoC.player.short;},
		"nipple"					: function() { return Descriptors.nippleDescript(0);},
		"nipples"					: function() { return Descriptors.nippleDescript(0) + "s";},
		"onecock"					: function() { return CoC.player.oMultiCockDesc();},
		"pg"						: function() { return "\n\n";},
		"pussy"						: function() { return Descriptors.vaginaDescript(); },
		"race"						: function() { return CoC.player.race(); },
		"sack"						: function() { return Descriptors.sackDescript(); },
		"sheath"					: function() { return CoC.player.sheathDescription(); },
		"skin"						: function() { return CoC.player.skin(); },
		"skinfurscales"				: function() { return CoC.player.skinFurScales(); },
		"tongue"					: function() { return Descriptors.tongueDescript(); },
		"vag"						: function() { return Descriptors.vaginaDescript(); },
		"vagina"					: function() { return Descriptors.vaginaDescript(); },
		"vagorass"					: function() { return (CoC.player.hasVagina() ? Descriptors.vaginaDescript() : Descriptors.assholeDescript()); },
		"weapon"					: function() { return CoC.player.weaponName;},
		"weaponname"				: function() { return CoC.player.weaponName; },
		                                         
		"latexyname"				: function() { return CoC.flags[kFLAGS.GOO_NAME]; },
		"bathgirlname"				: function() { return CoC.flags[kFLAGS.MILK_NAME]; },
		"cockplural"				: function() { return (CoC.player.cocks.length === 1) ? "cock" : "cocks"; },
		"dickplural"				: function() { return (CoC.player.cocks.length === 1) ? "dick" : "dicks"; },
		"headplural"				: function() { return (CoC.player.cocks.length === 1) ? "head" : "heads"; },
		"prickplural"				: function() { return (CoC.player.cocks.length === 1) ? "prick" : "pricks"; },
		"boy"						: function() { return CoC.player.mf("boy", "girl"); },
		"guy"						: function() { return CoC.player.mf("guy", "girl"); },
		"wings"						: function() { return Descriptors.wingsDescript(); },
		"tail"						: function() { return Descriptors.tailDescript(); },
		"onetail"					: function() { return Descriptors.oneTailDescript(); }
	};
	// Does lookup of single argument tags ('[cock]', '[armor]', etc...) in singleArgConverters
	// Supported variables are the options listed in the above
	// singleArgConverters object. If the passed argument is found in the above object,
	// the corresponding anonymous function is called, and it\'s return-value is returned.
	// If the arg is not present in the singleArgConverters object, an error message is
	// returned.
	// ALWAYS returns a string
	Parser.prototype.convertSingleArg = function( arg ) {
		var argResult = null;
		var capitalize = this.isUpperCase( arg.charAt( 0 ) );
		var argLower = arg.toLowerCase();
		if( Parser.singleArgConverters[argLower] ) {
			argResult = Parser.singleArgConverters[ argLower ]( CoC );
			if( this.lookupParserDebug ) {
				$log.warn( 'WARNING: Called, return = ', argResult );
			}
			if( capitalize ) {
				argResult = _.capitalize( argResult );
			}
			return argResult;
		} else {
			// ---------------------------------------------------------------------------------
			// TODO: Get rid of this shit.
			// UGLY hack to patch legacy functionality in TiTS
			// This needs to go eventually
			var descriptorArray = arg.split( '.' );
			var obj = this.getObjectFromString( CoC, descriptorArray[ 0 ] );
			if( obj === null ) { // Completely bad tag
				if( this.lookupParserDebug || this.logErrors ) {
					$log.warn( 'WARNING: Unknown subject in ' + arg );
				}
				return '<b>!Unknown subject in "' + arg + '"!</b>';
			}
			if( obj.hasOwnProperty( 'getDescription' ) && arg.indexOf( '.' ) > 0 ) {
				return obj.getDescription( descriptorArray[ 1 ], '' );
			}
			// end hack
			// ---------------------------------------------------------------------------------
			if( this.lookupParserDebug ) {
				$log.warn( 'WARNING: Lookup Arg = ', arg );
			}
			obj = this.getObjectFromString( CoC, arg );
			if( obj !== null ) {
				if( _.isFunction(obj) ) {
					if( this.lookupParserDebug ) {
						$log.warn( 'WARNING: Found corresponding function in owner class' );
					}
					return obj();
				} else {
					if( this.lookupParserDebug ) {
						$log.warn( 'WARNING: Found corresponding aspect in owner class' );
					}
					return obj;
				}
			} else {
				if( this.lookupParserDebug || this.logErrors ) {
					$log.warn( 'WARNING: No lookup found for', arg, ' search result is: ', obj );
				}
				return '<b>!Unknown tag "' + arg + '"!</b>';
			}
		}
	};

	// provides twoWordNumericTagsLookup and twoWordTagsLookup, which use
	// cockLookups/cockHeadLookups, and rubiLookups/arianLookups respectively
	// PRONOUNS: The parser uses Elverson/Spivak Pronouns specifically to allow characters to be written with non-specific genders.
	// http://en.wikipedia.org/wiki/Spivak_pronoun
	//
	// Cheat Table:
	//           | Subject    | Object       | Possessive Adjective | Possessive Pronoun | Reflexive         |
	// Agendered | ey laughs  | I hugged em  | eir heart warmed     | that is eirs       | ey loves emself   |
	// Masculine | he laughs  | I hugged him | his heart warmed     | that is his        | he loves himself  |
	// Feminine  | she laughs | I hugged her | her heart warmed     | that is hers       | she loves herself |
	// (Is it bad that half my development time so far has been researching non-gendered nouns? ~~~~Fake-Name)
	Parser.arianLookups = { // For subject: "arian"
		"man"		: function() {return SceneLib.arianScene.arianMF("man","woman");},
		// argh! "Man" is the mass-noun for humanity, and I'm loathe to choose an even more esoteric variant.
		// Elverson/Spivak terminology is already esoteric enough, and it lacks a ungendered mass noun.
		"ey"		: function() {return SceneLib.arianScene.arianMF("he","she");},
		"em"		: function() {return SceneLib.arianScene.arianMF("him","her");},
		"eir"		: function() {return SceneLib.arianScene.arianMF("his","her");},
		"eirs"		: function() {return SceneLib.arianScene.arianMF("his","hers");},
		"emself"	: function() {return SceneLib.arianScene.arianMF("himself","herself");},
		"chestadj"	: function() {return SceneLib.arianScene.arianChestAdjective();},
		"chest"		: function() {return SceneLib.arianScene.arianChest();}
	};
	// Arian unhandled terms (I have not decided how to support them yet):
	// arianMF("mas","mis")
	// arianMF("master","mistress")
	// arianMF("male","girly")
	Parser.rubiLookups = { // For subject: "rubi"
		"man"		: function() {return SceneLib.rubi.rubiMF("man","woman");},
		"ey"		: function() {return SceneLib.rubi.rubiMF("he","she");},
		"em"		: function() {return SceneLib.rubi.rubiMF("him","her");},
		"eir"		: function() {return SceneLib.rubi.rubiMF("his","her");},
		"eirs"		: function() {return SceneLib.rubi.rubiMF("his","hers");},
		"emself"	: function() {return SceneLib.rubi.rubiMF("himself","herself");},
		"cock"		: function() {return SceneLib.rubi.rubiCock();},
		"breasts"	: function() {return SceneLib.rubi.rubiBreasts();}
	};
	Parser.cockLookups = { // For subject: "cock"
		"all"		: function() { return CoC.player.multiCockDescriptLight(); },
		"each"		: function() { return CoC.player.sMultiCockDesc(); },
		"one"		: function() { return CoC.player.oMultiCockDesc(); },
		"largest"	: function() { return CoC.player.cockDescript(CoC.player.biggestCockIndex()); },
		"biggest"	: function() { return CoC.player.cockDescript(CoC.player.biggestCockIndex()); },
		"biggest2"	: function() { return CoC.player.cockDescript(CoC.player.biggestCockIndex2()); },
		"biggest3"  : function() { return CoC.player.cockDescript(CoC.player.biggestCockIndex3()); },
		"smallest"	: function() { return CoC.player.cockDescript(CoC.player.smallestCockIndex()); },
		"smallest2" : function() { return CoC.player.cockDescript(CoC.player.smallestCockIndex2()); },
		"longest"	: function() { return CoC.player.cockDescript(CoC.player.longestCock()); },
		"shortest"	: function() { return CoC.player.cockDescript(CoC.player.shortestCockIndex()); }
	};
	Parser.cockHeadLookups = { // For subject: "cockHead"
		"biggest"	: function() { return CoC.player.cockHead(CoC.player.biggestCockIndex()); },
		"biggest2"	: function() { return CoC.player.cockHead(CoC.player.biggestCockIndex2()); },
		"biggest3"	: function() { return CoC.player.cockHead(CoC.player.biggestCockIndex3()); },
		"largest"	: function() { return CoC.player.cockHead(CoC.player.biggestCockIndex()); },
		"smallest"	: function() { return CoC.player.cockHead(CoC.player.smallestCockIndex()); },
		"smallest2"	: function() { return CoC.player.cockHead(CoC.player.smallestCockIndex2()); },
		"longest"	: function() { return CoC.player.cockHead(CoC.player.longestCock()); },			// the *head* of a cock has a length? Wut?
		"shortest"	: function() { return CoC.player.cockHead(CoC.player.shortestCockIndex()); }
	};
	// These tags take a two-word tag with a **numberic** attribute for lookup.
	// [object NUMERIC-attribute]
	// if "NUMERIC-attribute" can be cast to a Number, the parser looks for "object" in twoWordNumericTagsLookup.
	// If it finds twoWordNumericTagsLookup["object"], it calls the anonymous function stored with said key "object"
	// like so: twoWordNumericTagsLookup["object"](Number("NUMERIC-attribute"))
	//
	// if attribute cannot be case to a number, the parser looks for "object" in twoWordTagsLookup.
	Parser.twoWordNumericTagsLookup = {};
	Parser.twoWordNumericTagsLookup.cockfit = function(thisPtr, aspect) {
		if(!CoC.player.hasCock()) {
			return "<b>(Attempt to parse cock when none present.)</b>";
		} else {
			if(CoC.player.cockThatFits(aspect) >= 0) {
				return CoC.player.cockDescript(CoC.player.cockThatFits(aspect));
			} else {
				return CoC.player.cockDescript(CoC.player.smallestCockIndex());
			}
		}
	};
	Parser.twoWordNumericTagsLookup.cockfit2 = function(thisPtr, aspect) {
		if(!CoC.player.hasCock()) {
			return "<b>(Attempt to parse cock when none present.)</b>";
		} else {
			if(CoC.player.cockThatFits2(aspect) >= 0) {
				return CoC.player.cockDescript(CoC.player.cockThatFits2(aspect));
			} else {
				return CoC.player.cockDescript(CoC.player.smallestCockIndex());
			}
		}
	};
	Parser.twoWordNumericTagsLookup.cockheadfit = function(thisPtr, aspect) {
		if (!CoC.player.hasCock()) {
			return "<b>(Attempt to parse cockhead when none present.)</b>";
		} else {
			if(CoC.player.cockThatFits(aspect) >= 0) {
				return CoC.player.cockHead(CoC.player.cockThatFits(aspect));
			} else {
				return CoC.player.cockHead(CoC.player.smallestCockIndex());
			}
		}
	};
	Parser.twoWordNumericTagsLookup.cockheadfit2 = function(thisPtr, aspect) {
		if(!CoC.player.hasCock()) {
			return "<b>(Attempt to parse cockhead when none present.)</b>";
		} else {
			if(CoC.player.cockThatFits2(aspect) >= 0) {
				return CoC.player.cockHead(CoC.player.cockThatFits2(aspect));
			} else {
				return CoC.player.cockHead(CoC.player.smallestCockIndex());
			}
		}
	};
	Parser.twoWordNumericTagsLookup.cock = function(thisPtr, aspect) {
		if(!CoC.player.hasCock()) {
			return "<b>(Attempt to parse cock when none present.)</b>";
		} else {
			if(aspect-1 >= 0 && aspect-1 < CoC.player.cockTotal()) {
				return CoC.player.cockDescript(aspect - 1);
			} else {
				return "<b>(Attempt To Parse CockDescript for Invalid Cock)</b>";
			}
		}
	};
	Parser.twoWordNumericTagsLookup.cockhead = function(thisPtr, aspect) {
		if(!CoC.player.hasCock()) {
			return "<b>(Attempt to parse cockHead when none present.)</b>";
		} else {
			var intAspect = Math.ceil(aspect - 1);
			if (intAspect >= 0 && intAspect < CoC.player.cockTotal()) {
				return CoC.player.cockHead(intAspect);
			} else {
				return "<b>(Attempt To Parse CockHeadDescript for Invalid Cock)</b>";
			}
		}
	};

	// These tags take an ascii attribute for lookup.
	// [object attribute]
	// if attribute cannot be cast to a number, the parser looks for "object" in twoWordTagsLookup,
	// and then uses the corresponding object to determine the value of "attribute", by looking for
	// "attribute" twoWordTagsLookup["object"]["attribute"]
	Parser.twoWordTagsLookup = {
		// NPCs:
		"rubi"		: Parser.rubiLookups,
		"arian"		: Parser.arianLookups,
		// PC Attributes:
		"cock"		: Parser.cockLookups,
		"cockhead"	: Parser.cockHeadLookups
	};
	Parser.prototype.convertDoubleArg = function( inputArg ) {
		var argResult = null;
		var thing ;
		var argTemp = inputArg.split( ' ' );
		if( argTemp.length !== 2 ) {
			$log.error( 'Not actually a two word tag! ' + inputArg );
			return '<b>!Not actually a two-word tag!"' + inputArg + '"!</b>';
		}
		var subject = argTemp[ 0 ];
		var aspect = argTemp[ 1 ];
		var subjectLower = argTemp[ 0 ].toLowerCase();
		var aspectLower = argTemp[ 1 ].toLowerCase();
		$log.debug( 'Doing lookup for subject', subject, ' aspect ', aspect );
		// Figure out if we need to capitalize the resulting text
		var capitalize = this.isUpperCase( aspect.charAt( 0 ) );
		// Only perform lookup in twoWordNumericTagsLookup if aspect can be cast to a valid number
		if( Parser.twoWordNumericTagsLookup[subjectLower] && !isNaN( aspect ) ) {
			aspectLower = parseInt( aspectLower );
			$log.debug( 'Found corresponding anonymous function' );
			argResult = Parser.twoWordNumericTagsLookup[ subjectLower ]( CoC, aspectLower );
			if( capitalize ) {
				argResult = _.capitalize( argResult );
			}
			$log.debug( 'Called two word numeric lookup, return = ', argResult );
			return argResult;
		}
		// aspect isn\'t a number. Look for subject in the normal twoWordTagsLookup
		if( Parser.twoWordTagsLookup[subjectLower] ) {
			if( Parser.twoWordTagsLookup[ subjectLower ][aspectLower] ) {
				$log.debug( 'Found corresponding anonymous function' );
				argResult = Parser.twoWordTagsLookup[ subjectLower ][ aspectLower ]( CoC );
				if( capitalize ) {
					argResult = _.capitalize( argResult );
				}
				$log.debug( 'Called two word lookup, return = ', argResult );
				return argResult;
			}
			$log.error( 'Unknown aspect in two-word tag. Arg: ' + inputArg + ' Aspect: ' + aspectLower );
			return '<b>!Unknown aspect in two-word tag "' + inputArg + '"! ASCII Aspect = "' + aspectLower + '"</b>';
		}
		$log.debug( 'trying to look-up two-word tag in parent' );
		// ---------------------------------------------------------------------------------
		// TODO: Get rid of this shit.
		// UGLY hack to patch legacy functionality in TiTS
		// This needs to go eventually
		var descriptorArray = subject.split( '.' );
		thing = this.getObjectFromString( CoC, descriptorArray[ 0 ] );
		if( thing === null ) { // Completely bad tag
			$log.error( 'Unknown subject in ' + inputArg );
			return '<b>!Unknown subject in "' + inputArg + '"!</b>';
		}
		if( thing.hasOwnProperty( 'getDescription' ) && subject.indexOf( '.' ) > 0 ) {
			if( argTemp.length > 1 ) {
				return thing.getDescription( descriptorArray[ 1 ], aspect );
			}
			return thing.getDescription( descriptorArray[ 1 ], '' );
		}
		// end hack
		// ---------------------------------------------------------------------------------
		var aspectLookup = this.getObjectFromString( CoC, aspect );
		if( thing !== null ) {
			if( _.isFunction(thing)) {
				$log.debug( 'Found corresponding function in owner class' );
				return thing( aspect );
			}
			if( _.isArray(thing)) {
				var indice = parseInt( aspectLower );
				if( isNaN( indice ) ) {
					$log.error( 'Cannot use non-number as indice to Array. Arg ' + inputArg + ' Subject: ' + subject + ' Aspect: ' + aspect );
					return '<b>Cannot use non-number as indice to Array "' + inputArg + '"! Subject = "' + subject + ', Aspect = ' + aspect + '\</b>';
				}
				return thing[ indice ];
			}
			if( _.isObject(thing)) {
				if( thing.hasOwnProperty( aspectLookup ) ) {
					return thing[ aspectLookup ];
				}
				if( thing.hasOwnProperty( aspect ) ) {
					return thing[ aspect ];
				}
				$log.error( 'Object does not have aspect as a member. Arg: ' + inputArg + ' Subject: ' + subject + ' Aspect:' + aspect + ' or ' + aspectLookup );
				return '<b>Object does not have aspect as a member "' + inputArg + '"! Subject = "' + subject + ', Aspect = ' + aspect + ' or ' + aspectLookup + '\</b>';
			}
			// This will work, but I don\'t know why you\'d want to
			// the aspect is just ignored
			$log.debug( 'Found corresponding aspect in owner class' );
			return String( thing );
		}
		$log.error( 'No lookup found for', inputArg, ' search result is: ', thing );
		return '<b>!Unknown subject in two-word tag "' + inputArg + '"! Subject = "' + subject + ', Aspect = ' + aspect + '\</b>';
	};
	// Provides the conditionalOptions object
	Parser.conditionalOptions = {
		"strength"			: function() {return  CoC.player.str;},
		"toughness"			: function() {return  CoC.player.tou;},
		"speed"				: function() {return  CoC.player.spe;},
		"intelligence"		: function() {return  CoC.player.inte;},
		"libido"			: function() {return  CoC.player.lib;},
		"sensitivity"		: function() {return  CoC.player.sens;},
		"corruption"		: function() {return  CoC.player.cor;},
		"fatigue"			: function() {return  CoC.player.fatigue;},
		"hp"				: function() {return  CoC.player.HP;},
		"hour"				: function() {return  CoC.time.hours;},
		"days"				: function() {return  CoC.time.days;},
		"tallness"			: function() {return  CoC.player.tallness;},
		"hairlength"		: function() {return  CoC.player.hairLength;},
		"femininity"		: function() {return  CoC.player.femininity;},
		"masculinity"		: function() {return  100 - CoC.player.femininity;},
		"cocks"				: function() {return  CoC.player.cockTotal();},
		"breastrows"		: function() {return  CoC.player.bRows();},
		"biggesttitsize"	: function() {return  CoC.player.biggestTitSize();},
		"vagcapacity"		: function() {return  CoC.player.vaginalCapacity();},
		"analcapacity"		: function() {return  CoC.player.analCapacity();},
		"balls"				: function() {return  CoC.player.balls;},
		"cumquantity"		: function() {return  CoC.player.cumQ();},
		"milkquantity"		: function() {return  CoC.player.lactationQ();},
		"hasvagina"			: function() {return  CoC.player.hasVagina();},
		"istaur"			: function() {return  CoC.player.isTaur();},
		"isnaga"			: function() {return  CoC.player.isNaga();},
		"isgoo"				: function() {return  CoC.player.isGoo();},
		"isbiped"			: function() {return  CoC.player.isBiped();},
		"hasbreasts"		: function() {return  (CoC.player.biggestTitSize() >= 1);},
		"hasballs"			: function() {return  (CoC.player.balls > 0);},
		"hascock"			: function() {return  CoC.player.hasCock();},
		"isherm"			: function() {return  (CoC.player.gender === 3);},
		"cumnormal"			: function() {return  (CoC.player.cumQ() <= 150);},
		"cummedium"			: function() {return  (CoC.player.cumQ() > 150 && CoC.player.cumQ() <= 350);},
		"cumhigh"			: function() {return  (CoC.player.cumQ() > 350 && CoC.player.cumQ() <= 1000);},
		"cumveryhigh"		: function() {return  (CoC.player.cumQ() > 1000 && CoC.player.cumQ() <= 2500);},
		"cumextreme"		: function() {return  (CoC.player.cumQ() > 2500);},
		"issquirter"		: function() {return  (CoC.player.wetness() >= 4);},
		"ispregnant"		: function() {return  (CoC.player.pregnancyIncubation > 0);},
		"isbuttpregnant"	: function() {return  (CoC.player.buttPregnancyIncubation > 0);},
		"hasnipplecunts"	: function() {return  CoC.player.hasFuckableNipples();},
		"canfly"			: function() {return  CoC.player.canFly();},
		"islactating"		: function() {return  (CoC.player.lactationQ() > 0);},
		"true"				: function() {return  true;},
		"false"				: function() {return  false;}
	};
	// converts a single argument to a conditional to
	// the relevant value, either by simply converting to a Number, or
	// through lookup in the above conditionalOptions oject, and then calling the
	// relevant function
	// Realistally, should only return either boolean or numbers.
	Parser.prototype.convertConditionalArgumentFromStr = function( arg ) {
		// convert the string contents of a conditional argument into a meaningful variable.
		var argLower = arg.toLowerCase();
		var argResult = -1;
		// Note: Case options MUST be ENTIRELY lower case. The comparaison string is converted to
		// lower case before the switch:case section
		// Try to cast to a number. If it fails, go on with the switch/case statement.
		if( !isNaN( Number( arg ) ) ) {
			$log.debug( 'Converted to float. Number = ', Number( arg ) );
			return Number( arg );
		}
		if( Parser.conditionalOptions[argLower] ) {
			$log.debug( 'Found corresponding anonymous function' );
			argResult = Parser.conditionalOptions[ argLower ]( CoC );
			$log.debug( 'Called, return = ', argResult );
			return argResult;
		}

		var obj = this.getObjectFromString( CoC, arg );
		$log.debug( 'Looked up ', arg, ' in ', CoC, 'Result was:', obj );
		if( obj !== null ) {
				$log.debug( 'Found corresponding function for conditional argument lookup.' );
			if( _.isFunction(obj)) {
				$log.debug( 'Found corresponding function in owner class' );
				argResult = Number( obj() );
				return argResult;
			}
			$log.debug( 'Found corresponding aspect in owner class' );
			argResult = Number( obj );
			return argResult;
		}
		$log.error( 'No lookups found!' );
		return null;
	};

	// Evaluates the conditional section of an if-statement.
	// Does the proper parsing and look-up of any of the special nouns
	// which can be present in the conditional
	Parser.prototype.evalConditionalStatementStr = function( textCond ) {
		// Evaluates a conditional statement:
		// (varArg1 [conditional] varArg2)
		// varArg1 & varArg2 can be either numbers, or any of the
		// strings in the 'conditionalOptions' object above.
		// numbers (which are in string format) are converted to a Number type
		// prior to comparison.
		// supports multiple comparison operators:
		// '=', '=='  - Both are Equals or equivalent-to operators
		// '<', '>    - Less-Than and Greater-Than
		// '<=', '>=' - Less-than or equal, greater-than or equal
		// '!='       - Not equal
		// proper, nested parsing of statements is a WIP
		// and not supported at this time.

		var isExp = /([\w\.]+)\s?(==|=|!=|<|>|<=|>=)\s?([\w\.]+)/;
		var expressionResult = isExp.exec( textCond );
		if( !expressionResult ) {
			var condArg = this.convertConditionalArgumentFromStr( textCond );
			if( condArg !== null ) {
				$log.debug( 'Conditional "', textCond, '" Evalueated to: "', condArg, '"' );
				return condArg;
			}
			$log.error( 'Invalid conditional! "(', textCond, ')" Conditionals must be in format:' );
			$log.error( ' "({statment1} (==|=|!=|<|>|<=|>=) {statement2})" or "({valid variable/function name})". ' );
			return false;
		}
		$log.debug( 'Expression = ', textCond, 'Expression result = [', expressionResult, '], length of = ', expressionResult.length );
		var condArgStr1 = expressionResult[ 1 ];
		var operator = expressionResult[ 2 ];
		var condArgStr2 = expressionResult[ 3 ];
		var retVal = false;
		var condArg1 = this.convertConditionalArgumentFromStr( condArgStr1 );
		var condArg2 = this.convertConditionalArgumentFromStr( condArgStr2 );
		//Perform check
		if( operator === '=' ) {
			retVal = (condArg1 === condArg2);
		} else if( operator === '>' ) {
			retVal = (condArg1 > condArg2);
		} else if( operator === '==' ) {
			retVal = (condArg1 === condArg2);
		} else if( operator === '<' ) {
			retVal = (condArg1 < condArg2);
		} else if( operator === '>=' ) {
			retVal = (condArg1 >= condArg2);
		} else if( operator === '<=' ) {
			retVal = (condArg1 <= condArg2);
		} else if( operator === '!=' ) {
			retVal = (condArg1 !== condArg2);
		} else {
			retVal = (condArg1 !== condArg2);
		}
		$log.debug( 'Check: ' + condArg1 + ' ' + operator + ' ' + condArg2 + ' result: ' + retVal );
		return retVal;
	};
	// Splits the result from an if-statement.
	// ALWAYS returns an array with two strings.
	// if there is no else, the second string is empty.
	Parser.prototype.splitConditionalResult = function( textCtnt ) {
		// Splits the conditional section of an if-statemnt in to two results:
		// [if (condition) OUTPUT_IF_TRUE]
		//                 ^ This Bit   ^
		// [if (condition) OUTPUT_IF_TRUE | OUTPUT_IF_FALSE]
		//                 ^          This Bit            ^
		// If there is no OUTPUT_IF_FALSE, returns an empty string for the second option.
		$log.debug( '------------------4444444444444444444444444444444444444444444444444444444444-----------------------' );
		$log.debug( 'Split Conditional input string: ', textCtnt );
		var ret = new Array( '', '' );
		var sectionStart = 0;
		var section = 0;
		var nestLevel = 0;
		for( var i = 0; i < textCtnt.length; i += 1 ) {
			switch( textCtnt.charAt( i ) ) {
				case '[':    //Statement is nested one level deeper
					nestLevel += 1;
					break;
				case ']':    //exited one level of nesting.
					nestLevel -= 1;
					break;
				case '|':                  // At a conditional split
					if( nestLevel === 0 ) { // conditional split is only valid in this context if we\'re not in a nested bracket.
						if( section === 1 ) { // barf if we hit a second '|' that\'s not in brackets
							if( CoC_Settings.haltOnErrors ) {
								throw new Error( 'Nested IF statements still a WIP' );
							}
							ret = [ '<b>Error! Too many options in if statement!</b>',
								'<b>Error! Too many options in if statement!</b>' ];
						} else {
							ret[ section ] = textCtnt.substring( sectionStart, i );
							sectionStart = i + 1;
							section += 1;
						}
					}
					break;
				default:
					break;
			}
		}
		ret[ section ] = textCtnt.substring( sectionStart, textCtnt.length );
		$log.debug( '------------------5555555555555555555555555555555555555555555555555555555555-----------------------' );
		$log.debug( 'Outputs: ', ret );
		return ret;
	};
	// Called to evaluate a if statment string, and return the evaluated result.
	// Returns an empty string ('') if the conditional rvaluates to false, and there is no else
	// option.
	Parser.prototype.parseConditional = function( textCtnt, depth ) {
		// NOTE: enclosing brackets are *not* included in the actual textCtnt string passed into this function
		// they\'re shown in the below examples simply for clarity\'s sake.
		// And because that\'s what the if-statements look like in the raw string passed into the parser
		// The brackets are actually removed earlier on by the recParser() step.
		// this.parseConditional():
		// Takes the contents of an if statement:
		// [if (condition) OUTPUT_IF_TRUE]
		// [if (condition) OUTPUT_IF_TRUE | OUTPUT_IF_FALSE]
		// splits the contents into an array as such:
		// ['condition', 'OUTPUT_IF_TRUE']
		// ['condition', 'OUTPUT_IF_TRUE | OUTPUT_IF_FALSE']
		// Finally, this.evalConditionalStatementStr() is called on the 'condition', the result
		// of which is used to determine which content-section is returned
		//

		// TODO: (NOT YET) Allows nested condition parenthesis, because I\'m masochistic

		// POSSIBLE BUG: A actual statement starting with 'if' could be misinterpreted as an if-statement
		// It\'s unlikely, but I *could* see it happening.
		// I need to do some testing
		// ~~~~Fake-Name
		$log.debug( '------------------2222222222222222222222222222222222222222222222222222222222-----------------------' );
		$log.debug( 'If input string: ', textCtnt );
		var ret = new Array( '', '', '' );	// first string is conditional, second string is the output
		var i = 0;
		var parenthesisCount = 0;
		var condStart = textCtnt.indexOf( '(' );
		if( condStart !== -1 ) { // If we have any open parenthesis
			for( i = condStart; i < textCtnt.length; i += 1 ) {
				if( textCtnt.charAt( i ) === '(' ) {
					parenthesisCount += 1;
				} else if( textCtnt.charAt( i ) === ')' ) {
					parenthesisCount -= 1;
				}
				if( parenthesisCount === 0 ) { // We\'ve found the matching closing bracket for the opening bracket at textCtnt[condStart]
					// Pull out the conditional, and then evaluate it.
					var conditional = this.evalConditionalStatementStr( textCtnt.substring( condStart + 1, i ) );
					// Make sure the contents of the if-statement have been evaluated to a plain-text string before trying to
					// split the base-level if-statement on the '|'
					// And now do the actual splitting.
					var output = this.splitConditionalResult( textCtnt.substring( i + 1, textCtnt.length ) );
					// LOTS of debugging
					$log.debug( 'prefix = \'', ret[ 0 ], '\' conditional = ', conditional, ' content = ', output );
					$log.debug( '-0--------------------------------------------------' );
					$log.debug( 'Content Item 1 = ', output[ 0 ] );
					$log.debug( '-1--------------------------------------------------' );
					$log.debug( 'Item 2 = ', output[ 1 ] );
					$log.debug( '-2--------------------------------------------------' );
					if( conditional ) {
						return this.recParser( output[ 0 ], depth );
					}
					return this.recParser( output[ 1 ], depth );
				}
			}
		} else {
			if( CoC_Settings.haltOnErrors ) {
				throw new Error( 'Invalid if statement!', textCtnt );
			}
			return '<b>Invalid IF Statement<b/>' + textCtnt;
		}
		return '';
	};
	
	// ---------------------------------------------------------------------------------------------------------------------------------------
	// SCENE PARSING ---------------------------------------------------------------------------------------------------------------
	// ---------------------------------------------------------------------------------------------------------------------------------------

	// attempt to return function 'inStr' that is a member of 'localThis'
	// Properly handles nested classes/objects, e.g. localThis.herp.derp
	// is returned by getFuncFromString(localThis, 'herp.derp');
	// returns the relevant function if it exists, null if it does not.
	Parser.prototype.getObjectFromString = function( localThis, inStr ) {
		if( localThis[inStr] ) {
			$log.debug( 'item: ', inStr, ' in: ', localThis );
			return localThis[ inStr ];
		}
		if( inStr.indexOf('.') > 0) { // *should* be > -1, but if the string starts with a dot, it can\'t be a valid reference to a nested class anyways.
			var localReference = inStr.substr( 0, inStr.indexOf('.'));
			var itemName = inStr.substr( inStr.indexOf('.')+1);
			// Debugging, what debugging?
			$log.debug( 'localReference = ', localReference );
			$log.debug( 'itemName = ', itemName );
			$log.debug( 'localThis = "', localThis, '"' );
			$log.debug( 'dereferenced = ', localThis[ localReference ] );
			// If we have the localReference as a member of the localThis, call this function again to further for
			// the item itemName in localThis[localReference]
			// This allows arbitrarily-nested data-structures, by recursing over the . structure in inStr
			if( localThis[localReference] ) {
				$log.debug( 'have localReference:', localThis[ localReference ] );
				return this.getObjectFromString( localThis[ localReference ], itemName );
			}
			return null;
		}
		$log.debug( 'item: ', inStr, ' NOT in: ', localThis );
		return null;
	};
	Parser.prototype.getSceneSectionToInsert = function( inputArg ) {
		var argTemp = inputArg.split( ' ' );
		if( argTemp.length !== 2 ) {
			return '<b>!Not actually a valid insertSection tag:!"' + inputArg + '"!</b>';
		}
		var callName = argTemp[ 0 ];
		var sceneName = argTemp[ 1 ];
		var callNameLower = argTemp[ 0 ].toLowerCase();
		$log.debug( 'Doing lookup for sceneSection tag:', callName, ' scene name: ', sceneName );
		// this should have been checked before calling.
		if( callNameLower !== 'insertsection' ) {
			throw 'Wat?';
		}
		if( this.parserState[sceneName] ) {
			$log.debug( 'Have sceneSection "' + sceneName + '". Parsing and setting up menu' );
			this.buttonNum = 0; // Clear the button number, so we start adding buttons from button 0
			// Split up into multiple variables for debugging (it was crashing at one point. Separating the calls let me delineate what was crashing)
			return $showdown.makeHtml( this.recParser( this.parserState[ sceneName ], 0 ) ); // and then stick it on the display
		}
		return 'Insert sceneSection called with unknown arg "' + sceneName + '". falling back to the debug pane';
	};
	// TODO: Make failed scene button lookups fail in a debuggable manner!
	// this.Parser button event handler
	// This is the event bound to all button events, as well as the function called
	// to enter the parser\'s cached scenes. If you pass recursiveParser a set of scenes including a scene named
	// 'startup', the parser will not exit normally, and will instead enter the 'startup' scene at the completion of parsing the
	// input string.
	//
	// the passed seneName string is preferentially looked-up in the cached scene array, and if there is not a cached scene of name sceneName
	// in the cache, it is then looked for as a member of _ownerClass.
	// if the function name is not found in either context, an error *should* be thrown, but at the moment,
	// it just returns to the debugPane
	//
	Parser.prototype.enterParserScene = function( sceneName ) {
		var ret = '';
		$log.debug( 'Entering parser scene: "' + sceneName + '"' );
		$log.debug( 'Do we have the scene name? ', _.has(this.parserState, sceneName) );
		if( sceneName === 'exit' ) {
			$log.error( 'Enter scene called to exit' );
			//doNextClear(debugPane);
			// TODO:
			// This needs to change to something else anyways. I need to add the ability to
			// tell the parser where to exit to at some point
		} else if( _.has(this.parserState, sceneName) ) {
			$log.debug( 'Have scene "' + sceneName + '". Parsing and setting up menu' );
			EngineCore.menu();
			this.buttonNum = 0; // Clear the button number, so we start adding buttons from button 0
			ret = $showdown.makeHtml( this.recParser( this.parserState[ sceneName ], 0 ) );
			EngineCore.rawOutputText( ret, true );			// and then stick it on the display
			$log.debug( 'Scene contents after markdown: "' + ret + '"' );
		} else if( this.getObjectFromString( CoC, sceneName ) !== null ) {
			$log.debug( 'Have function "' + sceneName + '" in this!. Calling.' );
			this.getObjectFromString( CoC, sceneName )();
		} else {
			$log.error( 'Enter scene called with unknown arg/function "' + sceneName + '". falling back to the debug pane' );
		}
		return ret;
	};
	// Parses the contents of a scene tag, shoves the unprocessed text in the scene object (this.parserState)
	// under the proper name.
	// Scenes tagged as such:
	//
	// [sceneName | scene contents blaugh]
	//
	// This gets placed in parserState so parserState['sceneName'] === 'scene contents blaugh'
	//
	// Note that parsing of the actual scene contents is deferred untill it\'s actually called for display.
	Parser.prototype.parseSceneTag = function( textCtnt ) {
		var sceneCont = textCtnt.substr( textCtnt.indexOf('|')+1);
		var sceneName = _.trim( textCtnt.substring( textCtnt.indexOf(' ') ,textCtnt.indexOf('|')) );
		$log.debug( 'Adding scene with name "' + sceneName + '"' );
		// Cleanup the scene content from spurious leading and trailing space.
		sceneCont = _.trim( sceneCont, '\n' );
		sceneCont = _.trim( sceneCont, '\t' );
		this.parserState[ sceneName ] = _.trim( sceneCont );
	};
	// Evaluates the contents of a button tag, and instantiates the relevant button
	// Current syntax:
	//
	// [button function_name | Button Name]
	// where 'button' is a constant string, 'function_name' is the name of the function pressing the button will call,
	// and 'Button Name' is the text that will be shown on the button.
	// Note that the function name cannot contain spaces (actionscript requires this), and is case-sensitive
	// 'Button name' can contain arbitrary spaces or characters, excepting ']', '[' and '|'
	Parser.prototype.parseButtonTag = function( textCtnt ) {
		// TODO: Allow button positioning!
		var arr = textCtnt.split( '|' );
		if( arr.len > 2 ) {
			throw 'Too many items in button';
		}
		var buttonName = _.trim( arr[ 1 ] );
		var buttonFunc = _.trim( arr[ 0 ].substring( arr[ 0 ].indexOf(' ')));
		EngineCore.addButton( this.buttonNum, buttonName, this.enterParserScene, buttonFunc );
		this.buttonNum += 1;
	};
	// pushes the contents of the passed string into the scene list object if it\'s a scene, or instantiates the named button if it\'s a button
	// command and returns an empty string.
	// if the contents are not a button or scene contents, returns the contents.
	Parser.prototype.evalForSceneControls = function( textCtnt ) {
		$log.debug( 'Checking for scene tags.' );
		if( textCtnt.toLowerCase().indexOf( 'screen' ) === 0 ) {
			$log.debug( 'It\'s a scene' );
			this.parseSceneTag( textCtnt );
			return '';
		} else if( textCtnt.toLowerCase().indexOf( 'button' ) === 0 ) {
			$log.debug( 'It\'s a button add statement' );
			this.parseButtonTag( textCtnt );
			return '';
		}
		return textCtnt;
	};
	Parser.prototype.isIfStatement = function( textCtnt ) {
		return textCtnt.toLowerCase().indexOf( 'if' ) === 0;
	};
	// Called to determine if the contents of a bracket are a parseable statement or not
	// If the contents *are* a parseable, it calls the relevant function to evaluate it
	// if not, it simply returns the contents as passed
	Parser.prototype.parseNonIfStatement = function( textCtnt ) {
		$log.debug( 'Parsing content string: ', textCtnt );
		$log.debug( 'Not an if statement' );
		// Match a single word, with no leading or trailing space
		var singleWordTagRegExp = /^[\w\.]+$/;
		var doubleWordTagRegExp = /^[\w\.]+\s[\w\.]+$/;
		$log.debug( 'string length = ', textCtnt.length );
		if( textCtnt.toLowerCase().indexOf( 'insertsection' ) === 0 ) {
			$log.debug( 'It\'s a scene section insert tag!' );
			return this.getSceneSectionToInsert( textCtnt );
		}
		if( singleWordTagRegExp.exec( textCtnt ) ) {
			$log.debug( 'It\'s a single word!' );
			return this.convertSingleArg( textCtnt );
		}
		if( doubleWordTagRegExp.exec( textCtnt ) ) {
			$log.debug( 'Two-word tag!' );
			return this.convertDoubleArg( textCtnt );
		}
		$log.error( 'Cannot parse content. What?', textCtnt );
		return '<b>!Unknown multi-word tag !</b>';
	};
	// Actual internal parser function.
	// textCtnt is the text you want parsed, depth is a number that reflects the current recursion depth
	// You pass in the string you want parsed, and the parsed result is returned as a string.
	Parser.prototype.recParser = function( textCtnt, depth ) {
		$log.debug( 'Recursion call', depth, '---------------------------------------------+++++++++++++++++++++' );
		$log.debug( 'Parsing contents = ', textCtnt );
		// Depth tracks our recursion depth
		// Basically, we need to handle things differently on the first execution, so we don\'t mistake single-word print-statements for
		// a tag. Therefore, every call of recParser increments depth by 1
		depth += 1;
		textCtnt = String( textCtnt );
		if( textCtnt.length === 0 ) { // Short circuit if we\'ve been passed an empty string
			return '';
		}
		var i = 0;
		var bracketCnt = 0;
		var lastBracket = -1;
		var retStr = '';
		do {
			lastBracket = textCtnt.indexOf( '[', lastBracket + 1 );
			if( textCtnt.charAt( lastBracket - 1 ) !== '\\' && lastBracket !== -1) {
				break;
			}
		} while( lastBracket !== -1 );
		if( lastBracket !== -1 ) { // If we have any open brackets
			for( i = lastBracket; i < textCtnt.length; i++ ) {
				if( textCtnt.charAt( i ) === '[' ) {
					if( textCtnt.charAt( i - 1 ) !== '\\') {
						bracketCnt += 1;
					}
				} else if( textCtnt.charAt( i ) === ']' ) {
					if( textCtnt.charAt( i - 1 ) !== '\\') {
						bracketCnt -= 1;
					}
				}
				if( bracketCnt === 0 ) { // We\'ve found the matching closing bracket for the opening bracket at textCtnt[lastBracket]
					// Only prepend the prefix if it actually has content.
					var prefixTmp = textCtnt.substring( 0, lastBracket );
					$log.debug( 'prefix content = ', prefixTmp );
					retStr += prefixTmp;
					// We know there aren\'t any brackets in the section before the first opening bracket.
					// therefore, we just add it to the returned string
					var tmpStr = this.evalForSceneControls( textCtnt.substring( lastBracket + 1, i ) );
					// this.evalForSceneControls swallows scene controls, so they won\'t get parsed further now.
					// therefore, you could *theoretically* have nested scene pages, though I don\'t know WHY you\'d ever want that.
					if( this.isIfStatement( tmpStr ) ) {
						$log.debug( 'early eval as if' );
						retStr += this.parseConditional( tmpStr, depth );
						$log.debug( '------------------0000000000000000000000000000000000000000000000000000000000000000-----------------------' );
					} else if( tmpStr ) {
						$log.debug( 'Parsing bracket contents = ', tmpStr );
						retStr += this.parseNonIfStatement( this.recParser( tmpStr, depth ), depth );
					}
					// First parse into the text in the brackets (to resolve any nested brackets)
					// then, eval their contents, in case they\'re an if-statement or other control-flow thing
					// I haven\'t implemented yet
					// Only parse the trailing string if it has brackets in it.
					// if not, we need to just return the string as-is.
					// Parsing the trailing string if it doesn\'t have brackets could lead to it being
					// incorrectly interpreted as a multi-word tag (and shit would asplode and shit)
					var postfixTmp = textCtnt.substring( i + 1, textCtnt.length );
					if( postfixTmp.indexOf( '[' ) !== -1 ) {
						$log.debug( 'Need to parse trailing text', postfixTmp );
						retStr += this.recParser( postfixTmp, depth );	// Parse the trailing text (if any)
						// Note: This leads to LOTS of recursion. Since we basically call recParser once per
						// tag, it means that if a body of text has 30 tags, we\'ll end up recursing at least
						// 29 times before finishing.
						// Making this tail-call reursive, or just parsing it flatly may be a much better option in
						// the future, if this does become an issue.
					} else {
						$log.debug( 'No brackets in trailing text', postfixTmp );
						retStr += postfixTmp;
					}
					return retStr;
					// and return the parsed string
				}
			}
		} else {
			// DERP. We should never have brackets around something that ISN\'T a tag intended to be parsed. Therefore, we just need
			// to determine what type of parsing should be done do the tag.
			$log.debug( 'No brackets present in text passed to recParse', textCtnt );
			retStr += textCtnt;
		}
		return retStr;
	};
	// Main parser function.
	// textCtnt is the text you want parsed, depth is a number, which should be 0
	// or not passed at all.
	// You pass in the string you want parsed, and the parsed result is returned as a string.
	Parser.prototype.recursiveParser = function( contents, parseAsMarkdown, prettyQuotes ) {
		if(prettyQuotes === undefined) {
			prettyQuotes = true;
		}
		$log.debug( '------------------ this.Parser called on string -----------------------' );
		// Eventually, when this goes properly class-based, we\'ll add a period, and have parserState.
		// Reset the parser\'s internal state, since we\'re parsing a new string:
		this.parserState = {};
		var ret = '';
		// Run through the parser
		contents = contents.replace( /\\n/g, '\n' );
		ret = this.recParser( contents, 0 );
		$log.debug( 'WARNING: this.Parser intermediate contents = ', ret );
		// Currently, not parsing text as markdown by default because it\'s fucking with the line-endings.
		if( prettyQuotes ) {
			// Convert quotes to prettyQuotes
			ret = this.makeQuotesPrettah( ret );
			// Quote conversion has to go before markdown calls
		}
		if( parseAsMarkdown ) {
			ret = $showdown.makeHtml( ret );
			var regexPCloseTag = /<\/p>/gi;
			ret = ret.replace( regexPCloseTag, '</p>\n' );
			// Finally, add a additional newline after each closing P tag, because flash only
			// outputs one newline per <p></p> tag, apparently flash again feels the need to be a special snowflake
		}
		// cleanup escaped brackets
		ret = ret.replace( /\\\]/g, ']' );
		ret = ret.replace( /\\\[/g, '[' );
		// And repeated spaces (this has to be done after markdown processing)
		ret = ret.replace( /  +/g, ' ' );
		// Finally, if we have a parser-based scene. enter the 'startup' scene.
		if(  this.parserState.startup ) {
			ret = this.enterParserScene( 'startup' );
			// HORRIBLE HACK
			// since we\'re initially called via a outputText command, the content of the first page\'s text will be overwritten
			// when we return. Therefore, in a horrible hack, we return the contents of mainTest.htmlText as the ret value, so
			// the outputText call overwrites the window content with the exact same content.
			CoC.currentText = ret;
		}
		return ret;
	};
	// ---------------------------------------------------------------------------------------------------------------------------------------
	// ---------------------------------------------------------------------------------------------------------------------------------------
	// ---------------------------------------------------------------------------------------------------------------------------------------
	// Make shit look nice
	Parser.prototype.makeQuotesPrettah = function( inStr ) {
		inStr = inStr.replace( /(\w)\'(\w)/g, '$1\u2019$2' )	// Apostrophes
			.replace( /(^|[\r\n 	\.\!\,\?])'([a-zA-Z<>\.\!\,\?])/g, '$1\u201c$2' )	// Opening doubles
			.replace( /([a-zA-Z<>\.\!\,\?])'([\r\n 	\.\!\,\?]|$)/g, '$1\u201d$2' )	// Closing doubles
			.replace( /--/g, '\u2014' );		// em-dashes
		return inStr;
	};
	Parser.prototype.stringToCharacter = function( str ) {
		if( str.length === 1 ) {
			return str;
		}
		return str.slice( 0, 1 );
	};
	Parser.prototype.isUpperCase = function( str ) {
		if( !isNaN( str ) ) {
			return false;
		}
		return str === str.toUpperCase();
	};
	Parser.registerSingleArgConverters = function( name, callback ) {
		Parser.singleArgConverters[name] = callback;
	};
	return Parser;
});