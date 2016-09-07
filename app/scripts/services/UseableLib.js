﻿'use strict';

angular.module('cocjs').factory('UseableLib', function (CoC, SimpleUseable) {
	return {
		B_CHITN : new SimpleUseable('B.Chitn', 'B.Chitn', 'a large shard of chitinous plating', 6, 'A perfect piece of black chitin from a bee-girl.  It still has some fuzz on it.', 'You look over the scale carefully but cannot find a use for it.  Maybe someone else will know how to use it.'),
		GLDSTAT : new SimpleUseable('GldStat', 'GldStat', 'a golden statue', 600, 'An intricate golden idol of an androgynous humanoid figure with nine long tails.  It probably had some spiritual significance to its owner.', '', CoC.scenes.forest.kitsuneScene.kitsuneStatue),
		GREENGL : new SimpleUseable('GreenGl', 'GreenGl', 'a clump of green gel', 6, 'This tough substance has no obvious use that you can discern.', 'You examine the gel thoroughly, noting it is tough and resiliant, yet extremely pliable.  Somehow you know eating it would not be a good idea.'),
		T_SSILK : new SimpleUseable('T.SSilk', 'T.SSilk', 'a bundle of tough spider-silk', 6, 'This bundle of fibrous silk is incredibly tough and strong, though somehow not sticky in the slightest.  You have no idea how to work these tough little strands into anything usable.  Perhaps one of this land\'s natives might have an idea?', 'You look over the tough webbing, confusion evident in your expression.  There\'s really nothing practical you can do with these yourself.  It might be best to find someone more familiar with the odd materials in this land to see if they can make sense of it.')
	};
});
