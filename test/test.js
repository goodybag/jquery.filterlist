$(function () {

	QUnit.test("search values", function( assert ) {
		var $filter = $('.search-filter');
		var result;
		var cases = [
			{ input: 'aus', expected: ['Austin, TX'] }
		, { input: 'tx',  expected: ['Austin, TX', 'Houston, TX'] }
		, { input: 12,    expected: [] }
		, { input: ',',   expected: [] }
		, { input: '#π˚∆',expected: [] }
		];

		cases.forEach(function (c) {
			$filter.val(c.input);
			$filter.trigger('keyup');

			var results = $('.region-list > li:visible').map(function () { return $(this).data('name'); });
			results = [].slice.call(results);
			assert.deepEqual(c.expected, results, 'test input: '+c.input)
		})
	});

});

