'use strict';

angular.module('cocjs').factory('ConsumableLib', function (SimpleConsumable, Mutations, CoC, BeeHoney, BimboLiqueur, DeBimbo, HairExtensionSerum, GroPlus, KitsuneGift, LustStick, OvipositionElixir, PhoukaWhiskey, Reducto, RizzaRoot, WingStick, Utils) {
	var ConsumableLib = {DEFAULT_VALUE: 6};
	/**
	 * A handy function to create SimpleConsumables (useable by any player, effect is a function accepting player:Player,
	 * shortName, longName, description and value are const)
	 * @param id id. Must be String 7 chars long
	 * @param shortName shortName, null to use id as shortName
	 * @param longName null to use shortName as longName
	 * @param effect function(player:Player) called to produce effect
	 * @param description null to use longName as description
	 */
	function mk(id, shortName,longName, effect, description, value) {
		if(value === undefined) {
			value = ConsumableLib.DEFAULT_VALUE;
		}
		return new SimpleConsumable(id,shortName,longName,effect,value,description);
	}
	ConsumableLib.AUBURND = mk('AuburnD','AuburnD', 'a vial of auburn hair dye', Utils.curry(Mutations.hairDye, 'auburn'),'This bottle of dye will allow you to change the color of your hair.  Of course if you don\'t have hair, using this would be a waste.');
	ConsumableLib.B__BOOK = mk('B. Book','B. Book', 'a small book with a midnight-black cover', Mutations.blackSpellbook, 'This solid black book is totally unmarked, saved for a blood red clasp that holds the covers closed until you are ready to read it.  The pages are edged with gold, like some of the fancy books in the monastary back home.', 40);
	ConsumableLib.B_GOSSR = mk('B.Gossr','B.Gossr', 'a bundle of black, gossamer webbing', Utils.curry(Mutations.sweetGossamer, 1), 'These strands of gooey black gossamer seem quite unlike the normal silk that driders produce.  It smells sweet and is clearly edible, but who knows what it might do to you?');
	ConsumableLib.BC_BEER = mk('BC Beer','BC Beer', 'a mug of Black Cat Beer', function(player){CoC.getInstance().scenes.telAdre.niamh.blackCatBeerEffects(player);}, 'A capped mug containing an alcoholic drink secreted from the breasts of Niamh.  It smells tasty.', 1);
	ConsumableLib.BEEHONY = new BeeHoney(false, false);
	ConsumableLib.BIMBOCH = mk('BimboCh','BimboCh', 'a bottle of bimbo champagne', Utils.curry(function(player){CoC.getInstance().scenes.telAdre.niamh.bimboChampagne(player,true,true);}), null, 1);
	ConsumableLib.BIMBOLQ = new BimboLiqueur();
	ConsumableLib.BLACK_D = mk('Black D','Black D', 'a vial of black hair dye', Utils.curry(Mutations.hairDye, 'black'),'This bottle of dye will allow you to change the color of your hair.  Of course if you don\'t have hair, using this would be a waste.');
	ConsumableLib.BLACKEG = mk('BlackEg','BlackEg', 'a rubbery black egg', Utils.curry(Mutations.blackRubberEgg, false), 'This is an oblong egg, not much different from a chicken egg in appearance (save for the color).  Something tells you it\'s more than just food.');
	ConsumableLib.BLACKPP = mk('BlackPp','BlackPp', 'a solid black canine pepper', Utils.curry(Mutations.caninePepper, 3), 'This solid black canine pepper is smooth and shiny, but something about it doesn\'t seem quite right...', 10);
	ConsumableLib.BLOND_D = mk('Blond D','Blond D', 'a vial of blonde hair dye', Utils.curry(Mutations.hairDye, 'blonde'),'This bottle of dye will allow you to change the color of your hair.  Of course if you don\'t have hair, using this would be a waste.');
	ConsumableLib.BLUEDYE = mk('BlueDye','BlueDye', 'a vial of blue hair dye', Utils.curry(Mutations.hairDye, 'dark blue'),'This bottle of dye will allow you to change the color of your hair.  Of course if you don\'t have hair, using this would be a waste.');
	ConsumableLib.BLUEEGG = mk('BlueEgg','BlueEgg', 'a blue and white mottled egg', Utils.curry(Mutations.blueEgg, false), 'This is an oblong egg, not much different from a chicken egg in appearance (save for the color).  Something tells you it\'s more than just food.');
	ConsumableLib.BROBREW = mk('BroBrew','BroBrew', 'a can of Bro Brew', Mutations.broBrew, 'This aluminum can is labelled as \'Bro Brew\'.  It even has a picture of a muscly, bare-chested man flexing on it.  A small label in the corner displays: "Demon General\'s Warning: Bro Brew\'s effects are as potent (and irreversible) as they are refreshing."');
	ConsumableLib.BROWN_D = mk('Brown D','Brown D', 'a vial of brown hair dye', Utils.curry(Mutations.hairDye, 'brown'),'This bottle of dye will allow you to change the color of your hair.  Of course if you don\'t have hair, using this would be a waste.');
	ConsumableLib.BROWNEG = mk('BrownEg','BrownEg', 'a brown and white mottled egg', Utils.curry(Mutations.brownEgg, false), 'This is an oblong egg, not much different from a chicken egg in appearance (save for the color).  Something tells you it\'s more than just food.');
	ConsumableLib.BULBYPP = mk('BulbyPp','BulbyPp', 'a bulbous pepper', Utils.curry(Mutations.caninePepper, 5), 'This bulbous pepper has a slightly different shape than the other canine peppers, with two large orb-like protrusions at the base.', 10);
	ConsumableLib.CANINEP = mk('CanineP','CanineP', 'a Canine pepper', Utils.curry(Mutations.caninePepper,0), 'The pepper is shiny and red, bulbous at the base but long and narrow at the tip.  It smells spicy.');
	ConsumableLib.CCUPCAK = mk('CCupcak','CCupcak', 'a gigantic, chocolate cupcake', Mutations.giantChocolateCupcake, null, 250);
	ConsumableLib.CERUL_P = mk('Cerul P','Cerulean P.', 'a cerulean-tinted potion', Mutations.ceruleanPotion, 'This is a mysterious bottle filled with a sky-blue liquid that sloshes gently inside.  Supposedly it will make you irresistible, though to what or who you cannot say.');
	ConsumableLib.COAL___ = mk('Coal   ','Coal   ', 'two pieces of coal', Mutations.coal,null);
	ConsumableLib.DBLPEPP = mk('DblPepp','DblPepp', 'a double canine pepper', Utils.curry(Mutations.caninePepper, 2), 'This canine pepper is actually two that have grown together due to some freak coincidence.', 10);
	ConsumableLib.DEBIMBO = new DeBimbo();
	ConsumableLib.DRGNEGG = mk('DrgnEgg','DrgnEgg','an unfertilized dragon egg', Mutations.eatEmberEgg,'A large, solid egg, easily the size of your clenched fist.  Its shell color is reddish-white, with blue splotches.');
	ConsumableLib.DRYTENT = mk('DryTent','DryTent', 'a shriveled tentacle', Mutations.shriveledTentacle, 'A dried tentacle from one of the lake anemones.  It\'s probably edible, but the stingers are still a little active.');
	ConsumableLib.ECTOPLS = mk('EctoPls','EctoPls', 'a bottle of ectoplasm', Mutations.ectoplasm, 'The green-tinted, hardly corporeal substance flows like a liquid inside its container. It makes you feel... uncomfortable, as you observe it.');
	ConsumableLib.EQUINUM = mk('Equinum','Equinum', 'a vial of Equinum', Mutations.equinum, 'This is a long flared vial with a small label that reads, "<i>Equinum</i>".  It is likely this potion is tied to horses in some way.');
	ConsumableLib.EXTSERM = new HairExtensionSerum();
	ConsumableLib.F_DRAFT = mk('F.Draft','F.Draft', 'a vial of roiling red fluid labeled "Fuck Draft"', Utils.curry(Mutations.lustDraft, true), 'This vial of red fluid bubbles constantly inside the glass, as if eager to escape.  It smells very strongly, though its odor is difficult to identify.  The word "Fuck" is inscribed on the side of the vial.');
	ConsumableLib.FISHFIL = mk('FishFil','FishFil', 'a fish fillet', Mutations.fishFillet, 'A perfectly cooked piece of fish.  You\'re not sure what type of fish is, since you\'re fairly certain "delicious" is not a valid species.');
	ConsumableLib.FOXBERY = mk('FoxBery','Fox Berry', 'a fox berry', Utils.curry(Mutations.foxTF,false), 'This large orange berry is heavy in your hands.  It may have gotten its name from its bright orange coloration.  You\'re certain it is no mere fruit.');
	ConsumableLib.FRRTFRT = mk('Frrtfrt','Frrtfrt','a ferret fruit', Mutations.ferretTF, 'This fruit is curved oddly, just like the tree it came from.  The skin is fuzzy and brown, like the skin of a peach.');
	ConsumableLib.FOXJEWL = mk('FoxJewl','Fox Jewel', 'a fox jewel', Utils.curry(Mutations.foxJewel,false), 'A shining teardrop-shaped jewel.  An eerie blue flame dances beneath the surface.');
	ConsumableLib.GLDSEED = mk('GldSeed','GoldenSeed', 'a golden seed', Utils.curry(Mutations.goldenSeed,0),'This seed looks and smells absolutely delicious.  Though it has an unusual color, the harpies prize these nuts as delicious treats.  Eating one might induce some physical transformations.');
	ConsumableLib.GODMEAD = mk('GodMead','GodMead', 'a pint of god\'s mead', Mutations.godMead,null);
	ConsumableLib.GOB_ALE = mk('Gob.Ale','Gob.Ale', 'a flagon of potent goblin ale', Mutations.goblinAle, 'This sealed flagon of \'Goblin Ale\' sloshes noisily with alcoholic brew.  Judging by the markings on the flagon, it\'s a VERY strong drink, and not to be trifled with.');
	ConsumableLib.GRAYDYE = mk('GrayDye','GrayDye', 'a vial of gray hair dye', Utils.curry(Mutations.hairDye, 'gray'),'This bottle of dye will allow you to change the color of your hair.  Of course if you don\'t have hair, using this would be a waste.');
	ConsumableLib.GREEN_D = mk('Green D','Green D', 'a vial of green hair dye', Utils.curry(Mutations.hairDye, 'green'),'This bottle of dye will allow you to change the color of your hair.  Of course if you don\'t have hair, using this would be a waste.');
	ConsumableLib.GROPLUS = new GroPlus();
	ConsumableLib.HUMMUS_ = mk('Hummus ','Hummus ', 'a blob of cheesy-looking hummus', Mutations.Hummus, 'This pile of hummus doesn\'t look that clean, and you really don\'t remember where you got it from.  It looks bland.  So bland that you feel blander just by looking at it.');
	ConsumableLib.IMPFOOD = mk('ImpFood','ImpFood', 'a parcel of imp food', Mutations.impFood, 'This is a small parcel of reddish-brown bread stuffed with some kind of meat.  It smells delicious.');
	ConsumableLib.INCUBID = mk('IncubiD','IncubiD', 'an Incubi draft', Utils.curry(Mutations.incubiDraft, true), 'The cork-topped flask swishes with a slimy looking off-white fluid, purported to give incubi-like powers.  A stylized picture of a humanoid with a huge penis is etched into the glass.');
	ConsumableLib.IZYMILK = mk('IzyMilk','IzyMilk', 'a bottle of Isabella\'s milk', Mutations.isabellaMilk, 'This is a bottle of Isabella\'s milk.  Isabella seems fairly certain it will invigorate you.');
	ConsumableLib.KANGAFT = mk('KangaFt','KangaFruit', 'a piece of kanga fruit', Utils.curry(Mutations.kangaFruit,0),'A yellow, fibrous, tubular pod.  A split in the end reveals many lumpy, small seeds inside.  The smell of mild fermentation wafts from them.');
	ConsumableLib.KITGIFT = new KitsuneGift();
	ConsumableLib.KNOTTYP = mk('KnottyP','KnottyP', 'a knotty canine pepper', Utils.curry(Mutations.caninePepper, 4), 'This knotted pepper is very swollen, with a massive, distended knot near the base.', 10);
	ConsumableLib.L_DRAFT = mk('L.Draft','LustDraft', 'a vial of roiling bubble-gum pink fluid', Utils.curry(Mutations.lustDraft,false), 'This vial of bright pink fluid bubbles constantly inside the glass, as if eager to escape.  It smells very sweet, and has "Lust" inscribed on the side of the vial.', 20);
	ConsumableLib.L_BLKEG = mk('L.BlkEg','L.BlkEg', 'a large rubbery black egg', Utils.curry(Mutations.blackRubberEgg, true), 'This is an oblong egg, not much different from an ostrich egg in appearance (save for the color).  Something tells you it\'s more than just food.  For all you know, it could turn you into rubber!');
	ConsumableLib.L_BLUEG = mk('L.BluEg','L.BluEg', 'a large blue and white mottled egg', Utils.curry(Mutations.blueEgg, true),'This is an oblong egg, not much different from an ostrich egg in appearance (save for the color).  Something tells you it\'s more than just food.');
	ConsumableLib.L_BRNEG = mk('L.BrnEg','L.BrnEg', 'a large brown and white mottled egg', Utils.curry(Mutations.brownEgg, true),'This is an oblong egg, not much different from an ostrich egg in appearance (save for the color).  Something tells you it\'s more than just food.');
	ConsumableLib.L_PNKEG = mk('L.PnkEg','L.PnkEg', 'a large pink and white mottled egg', Utils.curry(Mutations.pinkEgg, true),'This is an oblong egg, not much different from an ostrich egg in appearance (save for the color).  Something tells you it\'s more than just food.');
	ConsumableLib.L_PRPEG = mk('L.PrpEg','L.PrpEg', 'a large purple and white mottled egg', Utils.curry(Mutations.purpleEgg, true),'This is an oblong egg, not much different from an ostrich egg in appearance (save for the color).  Something tells you it\'s more than just food.');
	ConsumableLib.L_WHTEG = mk('L.WhtEg','L.WhtEg', 'a large white egg', Utils.curry(Mutations.whiteEgg, true), 'This is an oblong egg, not much different from an ostrich egg in appearance.  Something tells you it\'s more than just food.');
	ConsumableLib.LABOVA_ = mk('LaBova ','La Bova', 'a bottle containing a misty fluid labeled "LaBova"', Utils.curry(Mutations.laBova,true,false), 'A bottle containing a misty fluid with a grainy texture, it has a long neck and a ball-like base.  The label has a stylized picture of a well endowed cowgirl nursing two guys while they jerk themselves off.');
	ConsumableLib.LACTAID = mk('Lactaid','Lactaid', 'a pink bottle labelled "Lactaid"', Mutations.lactaid, 'Judging by the name printed on this bottle, \'Lactaid\' probably has an effect on the ability to lactate, and you doubt that effect is a reduction.');
	ConsumableLib.LARGEPP = mk('LargePp','LargePp', 'an overly large canine pepper', Utils.curry(Mutations.caninePepper, 1), 'This large canine pepper is much bigger than any normal peppers you\'ve seen.', 10);
	ConsumableLib.LUSTSTK = new LustStick();
	ConsumableLib.M__MILK = mk('M. Milk','M. Milk', 'a clear bottle of milk from Marble', Mutations.useMarbleMilk, 'A clear bottle of milk from Marble\'s breasts. It smells delicious.');
	ConsumableLib.MAGSEED = mk('MagSeed','MagSeed', 'a magically-enhanced golden seed', Utils.curry(Mutations.goldenSeed, 1),'This seed glows with power.  It\'s been enhanced by Lumi to unlock its full potential, allowing it to transform you more easily.');
	ConsumableLib.MGHTYVG = mk('MghtyVg','MghtyVg', 'a mightily enhanced piece of kanga fruit', Utils.curry(Mutations.kangaFruit, 1),'A yellow, fibrous, tubular pod.  A split in the end reveals many lumpy, small seeds inside.  The smell of mild fermentation wafts from them.  It glows slightly from Lumi\'s enhancements.');
	ConsumableLib.MOUSECO = mk('MouseCo','MouseCo', 'a handful of mouse cocoa', Mutations.mouseCocoa, 'A handful of rare aromatic beans with sharp creases in the middle, making them look like small mouse ears.  Allegedly very popular and plentiful before the mice-folk were wiped out.');
	ConsumableLib.MINOBLO = mk('MinoBlo','MinoBlo', 'a vial of Minotaur blood', Mutations.minotaurBlood, 'You\'ve got a scratched up looking vial full of bright red minotaur blood.  Any time you move it around it seems to froth up, as if eager to escape.');
	ConsumableLib.MINOCUM = mk('MinoCum','MinoCum', 'a sealed bottle of minotaur cum', Mutations.minotaurCum, 'This bottle of minotaur cum looks thick and viscous.  You know it has narcotic properties, but aside from that its effects are relatively unknown.', 60);
	ConsumableLib.MYSTJWL = mk('MystJwl','MystJwl', 'a mystic jewel', Utils.curry(Mutations.foxJewel, true), 'The flames within this jewel glow brighter than before, and have taken on a sinister purple hue.  It has been enhanced to increase its potency, allowing it to transform you more easily, but may have odd side-effects...', 20);
	ConsumableLib.NUMBROX = mk('NumbRox','Numb Rox', 'a strange packet of candy called \'Numb Rocks\'', Mutations.numbRocks, 'This packet of innocuous looking \'candy\' guarantees to reduce troublesome sensations and taste delicious.', 15);
	ConsumableLib.NPNKEGG = mk('NPnkEgg','NPnkEgg', 'a neon pink egg', Utils.curry(Mutations.neonPinkEgg,false), 'This is an oblong egg with an unnatural neon pink coloration.  It tingles in your hand with odd energies that make you feel as if you could jump straight into the sky.');
	ConsumableLib.ORANGDY = mk('OrangDy','OrangDy', 'a vial of brilliant orange hair dye', Utils.curry(Mutations.hairDye, 'bright orange'),'This bottle of dye will allow you to change the color of your hair.  Of course if you don\'t have hair, using this would be a waste.');
	ConsumableLib.OVIELIX = new OvipositionElixir();
	ConsumableLib.P_DRAFT = mk('P.Draft','P.Draft', 'an untainted Incubi draft', Utils.curry(Mutations.incubiDraft, false), 'The cork-topped flask swishes with a slimy looking off-white fluid, purported to give incubi-like powers.  A stylized picture of a humanoid with a huge penis is etched into the glass. Rathazul has purified this to prevent corruption upon use.', 20);
	ConsumableLib.P_LBOVA = mk('P.LBova','P.LBova', 'a bottle containing a white fluid labeled "Pure LaBova"', Utils.curry(Mutations.laBova, false, false),'A bottle containing a misty fluid with a grainy texture; it has a long neck and a ball-like base.  The label has a stylized picture of a well-endowed cow-girl nursing two guys while they jerk themselves off. It has been purified by Rathazul.');
	ConsumableLib.P_PEARL = mk('P.Pearl','P.Pearl', 'a pure pearl', Mutations.purePearl, null,1000);
	ConsumableLib.P_S_MLK = mk('P.S.Mlk','P.S.Mlk', 'an untainted bottle of Succubi milk', Utils.curry(Mutations.succubiMilk, false), 'This milk-bottle is filled to the brim with a creamy white milk of dubious origin.  A pink label proudly labels it as "<i>Succubi Milk</i>".  In small text at the bottom of the label it reads: "<i>To bring out the succubus in YOU!</i>"  Purified by Rathazul to prevent corruption.', 20);
	ConsumableLib.P_WHSKY = new PhoukaWhiskey();
	ConsumableLib.PEPPWHT = mk('PeppWht','PeppWht', 'a vial of peppermint white', function(player){CoC.getInstance().peppermintWhite(player);}, 'This tightly corked glass bottle gives off a pepperminty smell and reminds you of the winter holidays.  How odd.', 120);
	ConsumableLib.PINKDYE = mk('PinkDye','PinkDye', 'a vial of bright pink hair dye', Utils.curry(Mutations.hairDye, 'neon pink'),'This bottle of dye will allow you to change the color of your hair.  Of course if you don\'t have hair, using this would be a waste.');
	ConsumableLib.PINKEGG = mk('PinkEgg','PinkEgg', 'a pink and white mottled egg', Utils.curry(Mutations.pinkEgg, false),'This is an oblong egg, not much different from a chicken egg in appearance (save for the color).  Something tells you it\'s more than just food.');
	ConsumableLib.PRFRUIT = mk('PrFruit','PrFruit', 'a purple fruit', Mutations.purpleFruitEssrayle, 'This sweet-smelling produce looks like an eggplant, but feels almost squishy, and rubbery to the touch. Holding it to your ear, you think you can hear some fluid sloshing around inside.');
	ConsumableLib.PROBOVA = mk('ProBova','ProBova', 'a bottle containing a misty fluid labeled "ProBova"', Utils.curry(Mutations.laBova, true, true), 'This cloudy potion has been enhanced by the alchemist Lumi to imbue its drinker with cow-like attributes.');
	ConsumableLib.PSDELIT = mk('PSDelit','PSDelit', 'an untainted bottle of "Succubi\'s Delight"', Utils.curry(Mutations.succubisDelight, false),  'This precious fluid is often given to men a succubus intends to play with for a long time.  It has been partially purified by Rathazul to prevent corruption.', 20);
	ConsumableLib.PURHONY = new BeeHoney(true, false);
	ConsumableLib.PURPDYE = mk('PurpDye','PurpDye', 'a vial of purple hair dye', Utils.curry(Mutations.hairDye, 'purple'),'This bottle of dye will allow you to change the color of your hair.  Of course if you don\'t have hair, using this would be a waste.');
	ConsumableLib.PURPEAC = mk('PurPeac','PurPeac', 'a pure peach', Mutations.purityPeach, 'This is a peach from Minerva\'s spring, yellowy-orange with red stripes all over it.', 10);
	ConsumableLib.PURPLEG = mk('PurplEg','PurplEg', 'a purple and white mottled egg', Utils.curry(Mutations.purpleEgg, false),'This is an oblong egg, not much different from a chicken egg in appearance (save for the color).  Something tells you it\'s more than just food.');
	ConsumableLib.RED_DYE = mk('Red Dye','Red Dye', 'a vial of red hair dye', Utils.curry(Mutations.hairDye, 'red'),'This bottle of dye will allow you to change the color of your hair.  Of course if you don\'t have hair, using this would be a waste.');
	ConsumableLib.REPTLUM = mk('Reptlum','Reptlum', 'a vial of Reptilum', Mutations.reptilum, 'This is a rounded bottle with a small label that reads, "<i>Reptilum</i>".  It is likely this potion is tied to reptiles in some way.');
	ConsumableLib.REDUCTO = new Reducto();
	ConsumableLib.RINGFIG = mk('RingFig','RingFig','a ringtail fig', Mutations.ringtailFig,'A dried fig with two lobes and thin dark rings just below its stem.  The skin is wrinkly and it looks vaguely like a bulging scrotum.');
	ConsumableLib.RIZZART = new RizzaRoot();
	ConsumableLib.S_DREAM = mk('S.Dream','S.Dream', 'a bottle of \'Succubus\' Dream\'', Mutations.succubisDream, 'This precious fluid is often given to men a succubus intends to play with for a long time, though this batch has been enhanced by Lumi to have even greater potency.');
	ConsumableLib.S_GOSSR = mk('S.Gossr','S.Gossr', 'a bundle of pink, gossamer webbing', Utils.curry(Mutations.sweetGossamer,0), 'These strands of gooey pink gossamer seem quite unlike the normal silk that spider-morphs produce.  It smells sweet and is clearly edible, but who knows what it might do to you?');
	ConsumableLib.SDELITE = mk('SDelite','Sucb.Delite', 'a bottle of \'Succubi\'s Delight\'', Utils.curry(Mutations.succubisDelight, true),'This precious fluid is often given to men a succubus intends to play with for a long time.');
	ConsumableLib.SENSDRF = mk('SensDrf','Sens. Draft', 'a bottle of sensitivity draft', Mutations.sensitivityDraft, 'This carefully labelled potion is a \'Sensitivity Draft\', and if the diagrams are any indication, it will make your body more sensitive.', 15);
	ConsumableLib.SHARK_T = mk('Shark.T','Shark.T', 'a sharp shark tooth', Utils.curry(Mutations.sharkTooth,0), 'A glinting white tooth, very sharp and intimidating.');
	ConsumableLib.SHEEPMK = mk('SheepMk','SheepMk', 'a bottle of sheep milk', Mutations.sheepMilk,'This bottle of sheep milk is said to have corruption-fighting properties.  It may be useful.');
	ConsumableLib.SMART_T = mk('Smart T','Scholars T.', 'a cup of scholar\'s tea', Mutations.scholarsTea, 'This powerful brew supposedly has mind-strengthening effects.');
	ConsumableLib.SNAKOIL = mk('SnakOil', 'SnakOil', 'a vial of snake oil', Mutations.snakeOil, 'A vial the size of your fist made of dark brown glass. It contains what appears to be an oily, yellowish liquid. The odor is abominable.');
	ConsumableLib.SPHONEY = new BeeHoney(false, true);
	ConsumableLib.SUCMILK = mk('SucMilk','SucMilk', 'a bottle of Succubi milk', Utils.curry(Mutations.succubiMilk, true), 'This milk-bottle is filled to the brim with a creamy white milk of dubious origin.  A pink label proudly labels it as "<i>Succubi Milk</i>".  In small text at the bottom of the label it reads: "<i>To bring out the succubus in YOU!</i>"');
	ConsumableLib.TRAPOIL = mk('TrapOil','TrapOil', 'a vial of trap oil', Mutations.trapOil, 'A round, opaque glass vial filled with a clear, viscous fluid.  It has a symbol inscribed on it, a circle with a cross and arrow pointing out of it in opposite directions.  It looks and smells entirely innocuous.');
	ConsumableLib.TSCROLL = mk('TScroll','TScroll', 'a tattered scroll', Mutations.tatteredScroll, 'This tattered scroll is written in strange symbols, yet you have the feeling that if you tried to, you could decipher it.');
	ConsumableLib.TSTOOTH = mk('TSTooth','TSTooth', 'a glowing tiger shark tooth', Utils.curry(Mutations.sharkTooth, 1),'This looks like a normal shark tooth, though with an odd purple glow.');
	ConsumableLib.VITAL_T = mk('Vital T','Vitality T.', 'a vitality tincture', Mutations.vitalityTincture, 'This potent tea is supposedly good for strengthening the body.');
	ConsumableLib.VIXVIGR = mk('VixVigr','VixVigr', 'a bottle labelled "Vixen\'s Vigor"', Utils.curry(Mutations.foxTF, true), 'This small medicine bottle contains something called "Vixen\'s Vigor", supposedly distilled from common fox-berries.  It is supposed to be a great deal more potent, and a small warning label warns of "extra boobs", whatever that means.', 30);
	ConsumableLib.W__BOOK = mk('W. Book','W. Book', 'a small book with a pristine white cover', Mutations.whiteSpellbook, 'This white book is totally unmarked, and the cover is devoid of any lettering or title.  A shiny brass clasp keeps the covers closed until you are ready to read it.', 40);
	ConsumableLib.W_FRUIT = mk('W.Fruit','W.Fruit', 'a piece of whisker-fruit', Mutations.catTransformation, 'This small, peach-sized fruit has tiny whisker-like protrusions growing from the sides.');
	ConsumableLib.W_STICK = new WingStick();
	ConsumableLib.WETCLTH = mk('WetClth','WetClth', 'a wet cloth dripping with slippery slime', Mutations.gooGasmic, 'Dripping with a viscous slime, you\'ve no doubt rubbing this cloth on your body would have some kind of strange effect.');
	ConsumableLib.WHITEDY = mk('WhiteDy','WhiteDy', 'a vial of white hair dye', Utils.curry(Mutations.hairDye, 'white'), 'This bottle of dye will allow you to change the color of your hair.  Of course if you don\'t have hair, using this would be a waste.');
	ConsumableLib.WHITEEG = mk('WhiteEg', 'WhiteEg', 'a milky-white egg', Utils.curry(Mutations.whiteEgg, false), 'This is an oblong egg, not much different from a chicken egg in appearance.  Something tells you it\'s more than just food.');
	ConsumableLib.PRNPKR = mk('PrnsPkr', 'PrnsPkr', 'a vial of pinkish fluid', Mutations.princessPucker, 'A vial filled with a viscous pink liquid.');
	ConsumableLib.HRBCNT = mk('HrblCnt', 'HrblCnt', 'a bundle of verdant green leaves', Mutations.herbalContraceptive, 'A small bundle of verdant green leaves.');
	ConsumableLib.LARGE_EGGS = [ConsumableLib.L_BLKEG,ConsumableLib.L_BLUEG,ConsumableLib.L_BRNEG,ConsumableLib.L_PNKEG,ConsumableLib.L_PRPEG,ConsumableLib.L_WHTEG];
	ConsumableLib.SMALL_EGGS = [ConsumableLib.BLACKEG,ConsumableLib.BLUEEGG,ConsumableLib.BROWNEG,ConsumableLib.PINKEGG,ConsumableLib.PURPLEG,ConsumableLib.WHITEEG];
	return ConsumableLib;
});
