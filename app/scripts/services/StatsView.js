'use strict';

angular.module( 'cocjs' ).factory( 'StatsView', function(CoC) {
	function StatsView( mainView ) {
		if( !mainView ) {
			return;
		}
		this.stats = {};
		var that = this;
		_.forEach([ 'str', 'tou', 'spe', 'inte', 'lib', 'sens', 'cor', 'lust', 'fatigue', 'HP', 'level', 'XP', 'coreStats', 'gems', 'time' ], function(statType) {
			that.stats[statType] = {};
			that.stats[statType].text = _.capitalize(statType);
			that.stats[statType].num = -1;
			that.stats[statType].bar = -1;
			that.stats[statType].up = false;
			that.stats[statType].down = false;
		});
	}
	// <- statsScreenRefresh
	StatsView.prototype.refresh = function() {
		this.stats.coreStats.text = '<b><u>Name : {NAME}</b>'
			.replace( '{NAME}', CoC.player.short );
		this.stats.time.text = "<b><u>Day #: {DAYS}</u></b>\n<b>Time : {HOURS}:00</b>"
			.replace( "{DAYS}", CoC.time.days )
			.replace( "{HOURS}", CoC.time.hours );
				
		_.forEach( [ 'str', 'tou', 'spe', 'inte', 'lib', 'sens', 'cor', 'fatigue', 'lust' ], function( statName ) {
			this.stats[statName].bar = CoC.player[statName] / 100;
			this.stats[statName].num = CoC.player[statName];
		} );
		this.stats.HP.bar = CoC.player.HP / CoC.player.maxHP();
		this.stats.HP.num = CoC.player.HP;
		this.stats.level.num = CoC.player.level;
		this.stats.XP.num = CoC.player.XP;
		this.stats.gems.num = CoC.player.gems;
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
			if( CoC.player[ statName ] > CoC.oldStats[ oldStatName ] ) {
				this.showStatUp( statName );
			}
			if( CoC.player[ statName ] < CoC.oldStats[ oldStatName ] ) {
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