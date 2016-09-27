'use strict';

angular.module( 'cocjs' ).factory( 'StatsView', function(CoC) {
	function StatsView( mainView ) {
		if( !mainView ) {
			return;
		}
		this.stats = {};
		_.forEach([ 'str', 'tou', 'spe', 'inte', 'lib', 'sens', 'cor', 'lust', 'fatigue', 'HP', 'level', 'XP', 'coreStats', 'gems', 'time' ], function(statType) {
			this.stats[statType] = {};
			this.stats[statType].text = _.capitalize(statType);
			this.stats[statType].num = -1;
			this.stats[statType].bar = -1;
			this.stats[statType].up = false;
			this.stats[statType].down = false;
		});
	}
	// <- statsScreenRefresh
	StatsView.prototype.refresh = function() {
		this.stats.coreStats.text = '<b><u>Name : {NAME}</b>'
			.replace( '{NAME}', CoC.getInstance().player.short );
		this.stats.time.text = "<b><u>Day #: {DAYS}</u></b>\n<b>Time : {HOURS}:00</b>"
			.replace( "{DAYS}", CoC.getInstance().time.days )
			.replace( "{HOURS}", CoC.getInstance().time.hours );
				
		_.forEach( [ 'str', 'tou', 'spe', 'inte', 'lib', 'sens', 'cor', 'fatigue', 'lust' ], function( statName ) {
			this.stats[statName].bar = CoC.getInstance().player[statName] / 100;
			this.stats[statName].num = CoC.getInstance().player[statName];
		} );
		this.stats.HP.bar = CoC.getInstance().player.HP / CoC.getInstance().player.maxHP();
		this.stats.HP.num = CoC.getInstance().player.HP;
		this.stats.level.num = CoC.getInstance().player.level;
		this.stats.XP.num = CoC.getInstance().player.XP;
		this.stats.gems.num = CoC.getInstance().player.gems;
	};
	// <- showStats
	StatsView.prototype.show = function() {
		// make all the stats DOs visible.
		this.refresh();
		this.visible = true;
	};
	// <- hideStats
	StatsView.prototype.hide = function() {
		this.visible = false;
	};
	// <- hideUpDown
	StatsView.prototype.hideUpDown = function() {
		_.forEach( [ 'str', 'tou', 'spe', 'inte', 'lib', 'sens', 'cor', 'lust', 'fatigue', 'HP', 'xp' ], function( statName ) {
			this.stats[statName].up = false;
			this.stats[statName].down = false;
		} );
		this.mainView.hideLevelUp();
	};
	StatsView.prototype.showUpDown = function() {
		function _oldStatNameFor( statName ) {
			return 'old' + statName.charAt( 0 ).toUpperCase() + statName.substr( 1 );
		}
		this.upDownsContainer.visible = true;
		_.forEach( [ 'str', 'tou', 'spe', 'inte', 'lib', 'sens', 'cor', 'lust' ], function( statName ) {
			var oldStatName = _oldStatNameFor( statName );
			if( CoC.getInstance().player[ statName ] > CoC.getInstance().oldStats[ oldStatName ] ) {
				this.showStatUp( statName );
			}
			if( CoC.getInstance().player[ statName ] < CoC.getInstance().oldStats[ oldStatName ] ) {
				this.showStatDown( statName );
			}
		} );
	};
	StatsView.prototype.showStatUp = function( statName ) {
		this.stats[statName].up = true;
		this.stats[statName].down = false;
	};
	StatsView.prototype.showStatDown = function( statName ) {
		this.stats[statName].up = false;
		this.stats[statName].down = true;
	};
	return StatsView;
} );