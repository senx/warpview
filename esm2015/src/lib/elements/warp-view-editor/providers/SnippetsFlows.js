/*
 *  Copyright 2020 SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
export class SnippetsFlows {
}
SnippetsFlows.snippets = {
    macro: {
        prefix: 'macro (example)',
        body: [
            'info = {',
            '  \'name\': \'${1:euclideanDivision}\',',
            '  \'desc\': "',
            '${2:This macro returns the quotient and the remainder of a/b.}',
            '  ",',
            '  \'sig\': [ [ [ ${3:\'a:LONG\', \'b:LONG\'} ], [ ${4:\'q:LONG\', \'r:LONG\'} ] ] ], // Signature',
            '  \'params\': {',
            '    // Signature params description',
            '    ${5:\'b\': \'parameter b TOP of the stack\',',
            '    \'a\': \'parameter a just below on the stack\',',
            '    \'q\': \'the quotient of a/b, N-1 on the stack\',',
            '    \'r\': \'the remainder of a/b, on the TOP of the stack\'}',
            '  },',
            '  \'examples\': [',
            '    <\'',
            '${6:(q, r) = @mymacros/euclideanDivision(10 3);',
            'return { ',
            '  \'quotient is  :\': TOSTRING(q),',
            '  \'remainder is :\': TOSTRING(r)',
            '}',
            '    \'>',
            '  ]',
            '};',
            '',
            'macro =  ${7:(a, b) => {',
            '  INFO(!info);',
            '  context = SAVE();',
            '  TRY(() => {',
            '    // Code of the actual macro',
            '    return ( TOLONG(a / b), a % b);',
            '  },',
            '  () => { // catch any exception',
            '    RETHROW()',
            '  },',
            '  () => { // finally, restore the context',
            '    RESTORE(context)',
            '  })',
            '};',
            '',
            '// Unit tests',
            '${8:(q, r) = @macro(10 3)',
            'ASSERT(q == 3)',
            'ASSERT(r == 1)',
            'ASSERT(TYPEOF(q) == LONG)',
            'ASSERT(TYPEOF(r) == LONG)',
            '',
            'return macro'
        ],
        description: 'Macro'
    },
    'macro(empty)': {
        prefix: 'macro (empty)',
        body: [
            'info = {',
            '  \'name\': \'${1: }\'',
            '  \'desc\': "',
            '${2: }',
            '  ",',
            '  \'sig\': [ [ [   ], [   ] ] ], // Signature',
            '  \'params\': {',
            '    // Signature params description',
            '  },',
            '  \'examples\': [ "',
            '',
            '    " ]',
            '}',
            '',
            'macro = () => {',
            '  !info INFO;',
            '  context = SAVE();',
            '  TRY(() => {',
            '    // Code of the actual macro',
            '    ${3:  }',
            '  },',
            '  () => { // catch any exception',
            '    RETHROW()',
            '  },',
            '  () => { // finally, restore the context',
            '    RESTORE(context)',
            '  });',
            '}',
            '',
            '// Unit tests',
            '',
            'return macro'
        ],
        description: 'Macro'
    },
    fetch: {
        prefix: 'fetch',
        body: [
            'gts = FETCH([ \'TOKEN\', \'className\',  { \'label0\': \'=value0\',  \'label1\': \'~val.\' },  start, timespan ])'
        ]
    },
    bucketize: {
        prefix: 'bucketize',
        body: [
            'bucketizedGts = BUCKETIZE([ ${1:gts}, ${2|MACROBUCKETIZER((data) => { return [tick\\, latitude\\, longitude\\, elevation\\, value]; }),bucketizer.and(),bucketizer.count(),bucketizer.count().exclude-nulls(),bucketizer.count.include-nulls(),bucketizer.count.nonnull(),bucketizer.first(),bucketizer.join(\',\'),bucketizer.join.forbid-nulls(),bucketizer.last(),bucketizer.max(),bucketizer.max.forbid-nulls(),bucketizer.mean(),bucketizer.mean.circular(),bucketizer.mean.circular.exclude-nulls(),bucketizer.mean.exclude-nulls(),bucketizer.median(),bucketizer.min(),bucketizer.min.forbid-nulls(),bucketizer.or(),bucketizer.sum(),bucketizer.sum.forbid-nulls()|}, ${3:lastbucket}, ${4:bucketspan}, ${5:bucketcount} ])'
        ]
    },
    filter: {
        prefix: 'filter',
        body: [
            'filtredGts = FILTER([ ${1:gts}, [${2:labels}], ${3|MACROFILTER((data) => { return gtslist\\, labels_equivalence_class_map; }),filter.byattr({}),filter.byclass(\'\'),filter.bylabels({}),filter.bylabelsattr({}),filter.bymetadata([]),filter.last.eq(filterValue),filter.last.ge(filterValue),filter.last.gt(filterValue),filter.last.le(filterValue),filter.last.lt(filterValue),filter.last.ne(filterValue),filter.latencies(minLatency\\, maxLatency\\, [])|} ]'
        ]
    },
    map: {
        prefix: 'map',
        body: [
            'mappedGts = MAP([ ${1:gts}, ${2|MACROMAPPER((data) => { return [tick\\, latitude\\, longitude\\, elevation\\, value]; }),mapper.abs(),mapper.add(constant),mapper.and(),mapper.ceil(),mapper.count(),mapper.count.exclude-nulls(),mapper.count.include-nulls(),mapper.count.nonnull(),mapper.day(timezone\\|offset),mapper.delta(),mapper.dotproduct([]),mapper.dotproduct.positive([]),mapper.dotproduct.sigmoid([]),mapper.dotproduct.tanh([]),mapper.eq(constant),mapper.exp(constant),mapper.finite(),mapper.first(),mapper.floor(),mapper.ge(threshold),mapper.geo.approximate(resolution),mapper.geo.clear(),mapper.geo.outside(geoZone),mapper.geo.within(geoZone),mapper.gt(threshold),mapper.hdist(),mapper.highest(),mapper.hour(timezone\\|offset),mapper.hspeed(),mapper.join(\',\'),mapper.join.forbid-nulls(\',\'),mapper.kernel.cosine(bandwidth\\, step),mapper.kernel.epanechnikov(bandwidth\\, step),mapper.kernel.gaussian(bandwidth\\, step),mapper.kernel.logistic(bandwidth\\, step),mapper.kernel.quartic(bandwidth\\, step),mapper.kernel.silverman(bandwidth\\, step),mapper.kernel.triangular(bandwidth\\, step),mapper.kernel.tricube(bandwidth\\, step),mapper.kernel.triweight(bandwidth\\, step),mapper.kernel.uniform(bandwidth\\, step),mapper.last(),mapper.le(threshold),mapper.log(constant),mapper.lowest(),mapper.lt(threshold),mapper.mad(),mapper.max(),mapper.max.forbid-nulls(),mapper.max.x(),mapper.mean(),mapper.mean.circular(),mapper.mean.circular.exclude-nulls(),mapper.mean.exclude-nulls(),mapper.median(),mapper.min(),mapper.min.forbid-nulls(),mapper.min.x(),mapper.minute(timezone\\|offset),mapper.mod(modulus),mapper.month(timezone\\|offset),mapper.mul(constant),mapper.ne(constant),mapper.npdf(mu\\, sigma),mapper.or(),mapper.parsedouble(),mapper.percentile(percentile),mapper.pow(constant),mapper.product(),mapper.rate(),mapper.replace(constant),mapper.round(),mapper.sd(bessel),mapper.sd.forbid-nulls(bessel),mapper.second(timezone\\|offset),mapper.sigmoid(),mapper.sqrt(),mapper.sum(),mapper.sum.forbid-nulls(),mapper.tanh(),mapper.tick(),mapper.toboolean(),mapper.todouble(),mapper.tolong(),mapper.tostring(),mapper.truecourse(),mapper.var(bessel),mapper.var.forbid-nulls(bessel),mapper.vdist(),mapper.vspeed(),mapper.weekday(timezone\\|offset),mapper.year(timezone\\|offset),max.tick.sliding.window(),max.time.sliding.window()|}, ${3:pre}, ${4:post}, ${5:occurrences} ])'
        ]
    },
    reduce: {
        prefix: 'reduce',
        body: [
            'reducedGts = REDUCE([ ${1:gts}, [${2:labels}], ${3|MACROREDUCER((data) => { return [tick\\, latitude\\, longitude\\, elevation\\, value]; }),reducer.and(),reducer.and.exclude-nulls(),reducer.argmax(),reducer.argmin(),reducer.count(),reducer.count.exclude-nulls(),reducer.count.include-nulls(),reducer.count.nonnull(),reducer.join(),reducer.join.forbid-nulls(),reducer.join.nonnull(),reducer.join.urlencoded(),reducer.max(),reducer.max.forbid-nulls(),reducer.max.nonnull(),reducer.mean(),reducer.mean.circular(),reducer.mean.circular.exclude-nulls(),reducer.mean.exclude-nulls(),reducer.median(),reducer.min(),reducer.min.forbid-nulls(),reducer.min.nonnull(),reducer.or(),reducer.or.exclude-nulls(),reducer.sd(),reducer.sd.forbid-nulls(),reducer.shannonentropy.0(),reducer.shannonentropy.1(),reducer.sum(),reducer.sum.forbid-nulls(),reducer.sum.nonnull(),reducer.var(),reducer.var.forbid-nulls()|} ]'
        ]
    },
    apply: {
        prefix: 'apply',
        body: [
            'transformedGts = APPLY([ ${1:gts}, [${2:labels}], ${3|op.add(),op.add.ignore-nulls(),op.and(),op.and.ignore-nulls(),op.div(),op.eq(),op.ge(),op.gt(),op.le(),op.lt(),op.mask(),op.mul(),op.mul.ignore-nulls(),op.ne(),op.negmask(),op.or(),op.or.ignore-nulls(),op.sub()|} ])'
        ],
        description: 'Apply framework'
    },
    ift: {
        prefix: 'ift',
        body: [
            'IFT(',
            '  () => { return ${1:condition}; }, ',
            '  () => { return ${2:action_if_true} }',
            ');'
        ],
        description: 'If statement'
    },
    ifte: {
        prefix: 'ifte',
        body: [
            'IFTE(',
            '  () => { return ${1:condition}; }, ',
            '  () => { return ${2:action_if_true} },',
            '  () => { return ${2:action_if_false} }',
            ');'
        ],
        description: 'If then else statement'
    },
    'switch': {
        prefix: 'switch',
        body: [
            'SWITCH(',
            '  () => { return ${1:case_1}; }, { return ${2:action_1}; },',
            '  () => { return ${3:case_2}; }, { return ${4:action_2}; },',
            '  () => { return ${5:case_3}; }, { return ${6:action_3}; },',
            '  () => { return ${7:default}; },',
            '  ${8:number_of_cases}',
            ');'
        ],
        description: 'Switch statement'
    },
    'try': {
        prefix: 'try',
        body: [
            'TRY(',
            '  () => { ${1:try} },',
            '  () => { ${2:catch} },',
            '  () => { ${3:finally} }',
            ');'
        ],
        description: 'Try/Catch statement'
    },
    'while': {
        prefix: 'while',
        body: [
            'WHILE(',
            '  () => { return ${1:condition}; },',
            '  () => { ${2:action_while_true} }',
            ');'
        ],
        description: 'While loop'
    },
    until: {
        prefix: 'until',
        body: [
            'UNTIL(',
            '  () => { ${1:action_until_true} },',
            '  () => { return ${2:condition}; }',
            ');'
        ],
        description: 'Until loop'
    },
    'for': {
        prefix: 'for',
        body: [
            'FOR(${1:initial_value}, ${2:final_value},',
            '  () => { ${3:action} }',
            ');'
        ],
        description: 'For loop'
    },
    foreach: {
        prefix: 'foreach',
        body: [
            'FOREACH(${1:object}, ',
            '  (key, value) => { // object is a map',
            '  (value) => {      // object is a list',
            '    ${2:action}',
            '  }',
            ');'
        ],
        description: 'Foreach loop'
    },
    forstep: {
        prefix: 'forstep',
        body: [
            'FORSTEP(${1:initial_value}, ${2:final_value}, () => { return ${3: + 1}; },',
            '  () => { ${4:action} }',
            ');'
        ],
        description: 'Forstep loop'
    },
    shm: {
        prefix: 'shm',
        body: [
            'MUTEX(() => { // prevent a concurrent execution on the same SHM data',
            '  TRY(() => {',
            '    // try to read data from SHared Memory',
            '    SHMLOAD(\'gtsList\')',
            '  },',
            '  () => {',
            '    // when not found, store data in SHM',
            '    SHMSTORE(\'gtsList\', ${1:FETCH([ token \'classname\' {\\} NOW() d(365) ]))}',
            '  },',
            '  () => {',
            '    // finally, load the reference from SHM and store it ',
            '    gtsList = SHMLOAD(\'gtsList\')',
            '  });',
            '',
            '  // analytics on gtsList',
            '  ${2:gtsList}',
            '',
            '',
            '',
            '}, \'myMutex\');'
        ],
        description: 'Keep fetched data in RAM. You need to enable the SHM extension.'
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU25pcHBldHNGbG93cy5qcyIsInNvdXJjZVJvb3QiOiIvaG9tZS94YXZpZXIvd29ya3NwYWNlL3dhcnB2aWV3LWVkaXRvci9wcm9qZWN0cy93YXJwdmlldy1lZGl0b3ItbmcvIiwic291cmNlcyI6WyJzcmMvbGliL2VsZW1lbnRzL3dhcnAtdmlldy1lZGl0b3IvcHJvdmlkZXJzL1NuaXBwZXRzRmxvd3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7O0dBY0c7QUFFSCxNQUFNLE9BQU8sYUFBYTs7QUFDakIsc0JBQVEsR0FBRztJQUNoQixLQUFLLEVBQUU7UUFDTCxNQUFNLEVBQUUsaUJBQWlCO1FBQ3pCLElBQUksRUFBRTtZQUNKLFVBQVU7WUFDVix5Q0FBeUM7WUFDekMsZUFBZTtZQUNmLGdFQUFnRTtZQUNoRSxNQUFNO1lBQ04sbUdBQW1HO1lBQ25HLGlCQUFpQjtZQUNqQixxQ0FBcUM7WUFDckMsa0RBQWtEO1lBQ2xELHFEQUFxRDtZQUNyRCx1REFBdUQ7WUFDdkQsK0RBQStEO1lBQy9ELE1BQU07WUFDTixtQkFBbUI7WUFDbkIsU0FBUztZQUNULGlEQUFpRDtZQUNqRCxXQUFXO1lBQ1gsb0NBQW9DO1lBQ3BDLG1DQUFtQztZQUNuQyxHQUFHO1lBQ0gsU0FBUztZQUNULEtBQUs7WUFDTCxJQUFJO1lBQ0osRUFBRTtZQUNGLDBCQUEwQjtZQUMxQixnQkFBZ0I7WUFDaEIscUJBQXFCO1lBQ3JCLGVBQWU7WUFDZixpQ0FBaUM7WUFDakMscUNBQXFDO1lBQ3JDLE1BQU07WUFDTixrQ0FBa0M7WUFDbEMsZUFBZTtZQUNmLE1BQU07WUFDTiwyQ0FBMkM7WUFDM0Msc0JBQXNCO1lBQ3RCLE1BQU07WUFDTixJQUFJO1lBQ0osRUFBRTtZQUNGLGVBQWU7WUFDZiwyQkFBMkI7WUFDM0IsZ0JBQWdCO1lBQ2hCLGdCQUFnQjtZQUNoQiwyQkFBMkI7WUFDM0IsMkJBQTJCO1lBQzNCLEVBQUU7WUFDRixjQUFjO1NBQ2Y7UUFDRCxXQUFXLEVB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LEVBQUU7WUFDSiwyQ0FBMkM7WUFDM0MseUJBQXlCO1lBQ3pCLElBQUk7U0FDTDtRQUNELFdBQVcsRUFBRSxVQUFVO0tBQ3hCO0lBQ0QsT0FBTyxFQUFFO1FBQ1AsTUFBTSxFQUFFLFNBQVM7UUFDakIsSUFBSSxFQUFFO1lBQ0osdUJBQXVCO1lBQ3ZCLHdDQUF3QztZQUN4Qyx5Q0FBeUM7WUFDekMsaUJBQWlCO1lBQ2pCLEtBQUs7WUFDTCxJQUFJO1NBQ0w7UUFDRCxXQUFXLEVBQUUsY0FBYztLQUM1QjtJQUNELE9BQU8sRUFBRTtRQUNQLE1BQU0sRUFBRSxTQUFTO1FBQ2pCLElBQUksRUFBRTtZQUNKLDRFQUE0RTtZQUM1RSx5QkFBeUI7WUFDekIsSUFBSTtTQUNMO1FBQ0QsV0FBVyxFQUFFLGNBQWM7S0FDNUI7SUFDRCxHQUFHLEVBQUU7UUFDSCxNQUFNLEVBQUUsS0FBSztRQUNiLElBQUksRUFBRTtZQUNKLHNFQUFzRTtZQUN0RSxlQUFlO1lBQ2YsNENBQTRDO1lBQzVDLDBCQUEwQjtZQUMxQixNQUFNO1lBQ04sV0FBVztZQUNYLDBDQUEwQztZQUMxQyxrRkFBa0Y7WUFDbEYsTUFBTTtZQUNOLFdBQVc7WUFDWCwyREFBMkQ7WUFDM0Qsb0NBQW9DO1lBQ3BDLE9BQU87WUFDUCxFQUFFO1lBQ0YsMkJBQTJCO1lBQzNCLGdCQUFnQjtZQUNoQixFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixrQkFBa0I7U0FDbkI7UUFDRCxXQUFXLEVBQUUsaUVBQWlFO0tBQy9FO0NBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAgQ29weXJpZ2h0IDIwMjAgU2VuWCBTLkEuUy5cbiAqXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmV4cG9ydCBjbGFzcyBTbmlwcGV0c0Zsb3dzIHtcbiAgc3RhdGljIHNuaXBwZXRzID0ge1xuICAgIG1hY3JvOiB7XG4gICAgICBwcmVmaXg6ICdtYWNybyAoZXhhbXBsZSknLFxuICAgICAgYm9keTogW1xuICAgICAgICAnaW5mbyA9IHsnLFxuICAgICAgICAnICBcXCduYW1lXFwnOiBcXCckezE6ZXVjbGlkZWFuRGl2aXNpb259XFwnLCcsXG4gICAgICAgICcgIFxcJ2Rlc2NcXCc6IFwiJyxcbiAgICAgICAgJyR7MjpUaGlzIG1hY3JvIHJldHVybnMgdGhlIHF1b3RpZW50IGFuZCB0aGUgcmVtYWluZGVyIG9mIGEvYi59JyxcbiAgICAgICAgJyAgXCIsJyxcbiAgICAgICAgJyAgXFwnc2lnXFwnOiBbIFsgWyAkezM6XFwnYTpMT05HXFwnLCBcXCdiOkxPTkdcXCd9IF0sIFsgJHs0OlxcJ3E6TE9OR1xcJywgXFwncjpMT05HXFwnfSBdIF0gXSwgLy8gU2lnbmF0dXJlJyxcbiAgICAgICAgJyAgXFwncGFyYW1zXFwnOiB7JyxcbiAgICAgICAgJyAgICAvLyBTaWduYXR1cmUgcGFyYW1zIGRlc2NyaXB0aW9uJyxcbiAgICAgICAgJyAgICAkezU6XFwnYlxcJzogXFwncGFyYW1ldGVyIGIgVE9QIG9mIHRoZSBzdGFja1xcJywnLFxuICAgICAgICAnICAgIFxcJ2FcXCc6IFxcJ3BhcmFtZXRlciBhIGp1c3QgYmVsb3cgb24gdGhlIHN0YWNrXFwnLCcsXG4gICAgICAgICcgICAgXFwncVxcJzogXFwndGhlIHF1b3RpZW50IG9mIGEvYiwgTi0xIG9uIHRoZSBzdGFja1xcJywnLFxuICAgICAgICAnICAgIFxcJ3JcXCc6IFxcJ3RoZSByZW1haW5kZXIgb2YgYS9iLCBvbiB0aGUgVE9QIG9mIHRoZSBzdGFja1xcJ30nLFxuICAgICAgICAnICB9LCcsXG4gICAgICAgICcgIFxcJ2V4YW1wbGVzXFwnOiBbJyxcbiAgICAgICAgJyAgICA8XFwnJyxcbiAgICAgICAgJyR7NjoocSwgcikgPSBAbXltYWNyb3MvZXVjbGlkZWFuRGl2aXNpb24oMTAgMyk7JyxcbiAgICAgICAgJ3JldHVybiB7ICcsXG4gICAgICAgICcgIFxcJ3F1b3RpZW50IGlzICA6XFwnOiBUT1NUUklORyhxKSwnLFxuICAgICAgICAnICBcXCdyZW1haW5kZXIgaXMgOlxcJzogVE9TVFJJTkcociknLFxuICAgICAgICAnfScsXG4gICAgICAgICcgICAgXFwnPicsXG4gICAgICAgICcgIF0nLFxuICAgICAgICAnfTsnLFxuICAgICAgICAnJyxcbiAgICAgICAgJ21hY3JvID0gICR7NzooYSwgYikgPT4geycsXG4gICAgICAgICcgIElORk8oIWluZm8pOycsXG4gICAgICAgICcgIGNvbnRleHQgPSBTQVZFKCk7JyxcbiAgICAgICAgJyAgVFJZKCgpID0+IHsnLFxuICAgICAgICAnICAgIC8vIENvZGUgb2YgdGhlIGFjdHVhbCBtYWNybycsXG4gICAgICAgICcgICAgcmV0dXJuICggVE9MT05HKGEgLyBiKSwgYSAlIGIpOycsXG4gICAgICAgICcgIH0sJyxcbiAgICAgICAgJyAgKCkgPT4geyAvLyBjYXRjaCBhbnkgZXhjZXB0aW9uJyxcbiAgICAgICAgJyAgICBSRVRIUk9XKCknLFxuICAgICAgICAnICB9LCcsXG4gICAgICAgICcgICgpID0+IHsgLy8gZmluYWxseSwgcmVzdG9yZSB0aGUgY29udGV4dCcsXG4gICAgICAgICcgICAgUkVTVE9SRShjb250ZXh0KScsXG4gICAgICAgICcgIH0pJyxcbiAgICAgICAgJ307JyxcbiAgICAgICAgJycsXG4gICAgICAgICcvLyBVbml0IHRlc3RzJyxcbiAgICAgICAgJyR7ODoocSwgcikgPSBAbWFjcm8oMTAgMyknLFxuICAgICAgICAnQVNTRVJUKHEgPT0gMyknLFxuICAgICAgICAnQVNTRVJUKHIgPT0gMSknLFxuICAgICAgICAnQVNTRVJUKFRZUEVPRihxKSA9PSBMT05HKScsXG4gICAgICAgICdBU1NFUlQoVFlQRU9GKHIpID09IExPTkcpJyxcbiAgICAgICAgJycsXG4gICAgICAgICdyZXR1cm4gbWFjcm8nXG4gICAgICBdLFxuICAgICAgZGVzY3JpcHRpb246ICdNYWNybydcbiAgICB9LFxuICAgICdtYWNybyhlbXB0eSknOiB7XG4gICAgICBwcmVmaXg6ICdtYWNybyAoZW1wdHkpJyxcbiAgICAgIGJvZHk6IFtcbiAgICAgICAgJ2luZm8gPSB7JyxcbiAgICAgICAgJyAgXFwnbmFtZVxcJzogXFwnJHsxOiB9XFwnJyxcbiAgICAgICAgJyAgXFwnZGVzY1xcJzogXCInLFxuICAgICAgICAnJHsyOiB9JyxcbiAgICAgICAgJyAgXCIsJyxcbiAgICAgICAgJyAgXFwnc2lnXFwnOiBbIFsgWyAgIF0sIFsgICBdIF0gXSwgLy8gU2lnbmF0dXJlJyxcbiAgICAgICAgJyAgXFwncGFyYW1zXFwnOiB7JyxcbiAgICAgICAgJyAgICAvLyBTaWduYXR1cmUgcGFyYW1zIGRlc2NyaXB0aW9uJyxcbiAgICAgICAgJyAgfSwnLFxuICAgICAgICAnICBcXCdleGFtcGxlc1xcJzogWyBcIicsXG4gICAgICAgICcnLFxuICAgICAgICAnICAgIFwiIF0nLFxuICAgICAgICAnfScsXG4gICAgICAgICcnLFxuICAgICAgICAnbWFjcm8gPSAoKSA9PiB7JyxcbiAgICAgICAgJyAgIWluZm8gSU5GTzsnLFxuICAgICAgICAnICBjb250ZXh0ID0gU0FWRSgpOycsXG4gICAgICAgICcgIFRSWSgoKSA9PiB7JyxcbiAgICAgICAgJyAgICAvLyBDb2RlIG9mIHRoZSBhY3R1YWwgbWFjcm8nLFxuICAgICAgICAnICAgICR7MzogIH0nLFxuICAgICAgICAnICB9LCcsXG4gICAgICAgICcgICgpID0+IHsgLy8gY2F0Y2ggYW55IGV4Y2VwdGlvbicsXG4gICAgICAgICcgICAgUkVUSFJPVygpJyxcbiAgICAgICAgJyAgfSwnLFxuICAgICAgICAnICAoKSA9PiB7IC8vIGZpbmFsbHksIHJlc3RvcmUgdGhlIGNvbnRleHQnLFxuICAgICAgICAnICAgIFJFU1RPUkUoY29udGV4dCknLFxuICAgICAgICAnICB9KTsnLFxuICAgICAgICAnfScsXG4gICAgICAgICcnLFxuICAgICAgICAnLy8gVW5pdCB0ZXN0cycsXG4gICAgICAgICcnLFxuICAgICAgICAncmV0dXJuIG1hY3JvJ1xuICAgICAgXSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnTWFjcm8nXG4gICAgfSxcbiAgICBmZXRjaDoge1xuICAgICAgcHJlZml4OiAnZmV0Y2gnLFxuICAgICAgYm9keTogW1xuICAgICAgICAnZ3RzID0gRkVUQ0goWyBcXCdUT0tFTlxcJywgXFwnY2xhc3NOYW1lXFwnLCAgeyBcXCdsYWJlbDBcXCc6IFxcJz12YWx1ZTBcXCcsICBcXCdsYWJlbDFcXCc6IFxcJ352YWwuXFwnIH0sICBzdGFydCwgdGltZXNwYW4gXSknXG4gICAgICBdXG4gICAgfSxcbiAgICBidWNrZXRpemU6IHtcbiAgICAgIHByZWZpeDogJ2J1Y2tldGl6ZScsXG4gICAgICBib2R5OiBbXG4gICAgICAgICdidWNrZXRpemVkR3RzID0gQlVDS0VUSVpFKFsgJHsxOmd0c30sICR7MnxNQUNST0JVQ0tFVElaRVIoKGRhdGEpID0+IHsgcmV0dXJuIFt0aWNrXFxcXCwgbGF0aXR1ZGVcXFxcLCBsb25naXR1ZGVcXFxcLCBlbGV2YXRpb25cXFxcLCB2YWx1ZV07IH0pLGJ1Y2tldGl6ZXIuYW5kKCksYnVja2V0aXplci5jb3VudCgpLGJ1Y2tldGl6ZXIuY291bnQoKS5leGNsdWRlLW51bGxzKCksYnVja2V0aXplci5jb3VudC5pbmNsdWRlLW51bGxzKCksYnVja2V0aXplci5jb3VudC5ub25udWxsKCksYnVja2V0aXplci5maXJzdCgpLGJ1Y2tldGl6ZXIuam9pbihcXCcsXFwnKSxidWNrZXRpemVyLmpvaW4uZm9yYmlkLW51bGxzKCksYnVja2V0aXplci5sYXN0KCksYnVja2V0aXplci5tYXgoKSxidWNrZXRpemVyLm1heC5mb3JiaWQtbnVsbHMoKSxidWNrZXRpemVyLm1lYW4oKSxidWNrZXRpemVyLm1lYW4uY2lyY3VsYXIoKSxidWNrZXRpemVyLm1lYW4uY2lyY3VsYXIuZXhjbHVkZS1udWxscygpLGJ1Y2tldGl6ZXIubWVhbi5leGNsdWRlLW51bGxzKCksYnVja2V0aXplci5tZWRpYW4oKSxidWNrZXRpemVyLm1pbigpLGJ1Y2tldGl6ZXIubWluLmZvcmJpZC1udWxscygpLGJ1Y2tldGl6ZXIub3IoKSxidWNrZXRpemVyLnN1bSgpLGJ1Y2tldGl6ZXIuc3VtLmZvcmJpZC1udWxscygpfH0sICR7MzpsYXN0YnVja2V0fSwgJHs0OmJ1Y2tldHNwYW59LCAkezU6YnVja2V0Y291bnR9IF0pJ1xuICAgICAgXVxuICAgIH0sXG4gICAgZmlsdGVyOiB7XG4gICAgICBwcmVmaXg6ICdmaWx0ZXInLFxuICAgICAgYm9keTogW1xuICAgICAgICAnZmlsdHJlZEd0cyA9IEZJTFRFUihbICR7MTpndHN9LCBbJHsyOmxhYmVsc31dLCAkezN8TUFDUk9GSUxURVIoKGRhdGEpID0+IHsgcmV0dXJuIGd0c2xpc3RcXFxcLCBsYWJlbHNfZXF1aXZhbGVuY2VfY2xhc3NfbWFwOyB9KSxmaWx0ZXIuYnlhdHRyKHt9KSxmaWx0ZXIuYnljbGFzcyhcXCdcXCcpLGZpbHRlci5ieWxhYmVscyh7fSksZmlsdGVyLmJ5bGFiZWxzYXR0cih7fSksZmlsdGVyLmJ5bWV0YWRhdGEoW10pLGZpbHRlci5sYXN0LmVxKGZpbHRlclZhbHVlKSxmaWx0ZXIubGFzdC5nZShmaWx0ZXJWYWx1ZSksZmlsdGVyLmxhc3QuZ3QoZmlsdGVyVmFsdWUpLGZpbHRlci5sYXN0LmxlKGZpbHRlclZhbHVlKSxmaWx0ZXIubGFzdC5sdChmaWx0ZXJWYWx1ZSksZmlsdGVyLmxhc3QubmUoZmlsdGVyVmFsdWUpLGZpbHRlci5sYXRlbmNpZXMobWluTGF0ZW5jeVxcXFwsIG1heExhdGVuY3lcXFxcLCBbXSl8fSBdJ1xuICAgICAgXVxuICAgIH0sXG4gICAgbWFwOiB7XG4gICAgICBwcmVmaXg6ICdtYXAnLFxuICAgICAgYm9keTogW1xuICAgICAgICAnbWFwcGVkR3RzID0gTUFQKFsgJHsxOmd0c30sICR7MnxNQUNST01BUFBFUigoZGF0YSkgPT4geyByZXR1cm4gW3RpY2tcXFxcLCBsYXRpdHVkZVxcXFwsIGxvbmdpdHVkZVxcXFwsIGVsZXZhdGlvblxcXFwsIHZhbHVlXTsgfSksbWFwcGVyLmFicygpLG1hcHBlci5hZGQoY29uc3RhbnQpLG1hcHBlci5hbmQoKSxtYXBwZXIuY2VpbCgpLG1hcHBlci5jb3VudCgpLG1hcHBlci5jb3VudC5leGNsdWRlLW51bGxzKCksbWFwcGVyLmNvdW50LmluY2x1ZGUtbnVsbHMoKSxtYXBwZXIuY291bnQubm9ubnVsbCgpLG1hcHBlci5kYXkodGltZXpvbmVcXFxcfG9mZnNldCksbWFwcGVyLmRlbHRhKCksbWFwcGVyLmRvdHByb2R1Y3QoW10pLG1hcHBlci5kb3Rwcm9kdWN0LnBvc2l0aXZlKFtdKSxtYXBwZXIuZG90cHJvZHVjdC5zaWdtb2lkKFtdKSxtYXBwZXIuZG90cHJvZHVjdC50YW5oKFtdKSxtYXBwZXIuZXEoY29uc3RhbnQpLG1hcHBlci5leHAoY29uc3RhbnQpLG1hcHBlci5maW5pdGUoKSxtYXBwZXIuZmlyc3QoKSxtYXBwZXIuZmxvb3IoKSxtYXBwZXIuZ2UodGhyZXNob2xkKSxtYXBwZXIuZ2VvLmFwcHJveGltYXRlKHJlc29sdXRpb24pLG1hcHBlci5nZW8uY2xlYXIoKSxtYXBwZXIuZ2VvLm91dHNpZGUoZ2VvWm9uZSksbWFwcGVyLmdlby53aXRoaW4oZ2VvWm9uZSksbWFwcGVyLmd0KHRocmVzaG9sZCksbWFwcGVyLmhkaXN0KCksbWFwcGVyLmhpZ2hlc3QoKSxtYXBwZXIuaG91cih0aW1lem9uZVxcXFx8b2Zmc2V0KSxtYXBwZXIuaHNwZWVkKCksbWFwcGVyLmpvaW4oXFwnLFxcJyksbWFwcGVyLmpvaW4uZm9yYmlkLW51bGxzKFxcJyxcXCcpLG1hcHBlci5rZXJuZWwuY29zaW5lKGJhbmR3aWR0aFxcXFwsIHN0ZXApLG1hcHBlci5rZXJuZWwuZXBhbmVjaG5pa292KGJhbmR3aWR0aFxcXFwsIHN0ZXApLG1hcHBlci5rZXJuZWwuZ2F1c3NpYW4oYmFuZHdpZHRoXFxcXCwgc3RlcCksbWFwcGVyLmtlcm5lbC5sb2dpc3RpYyhiYW5kd2lkdGhcXFxcLCBzdGVwKSxtYXBwZXIua2VybmVsLnF1YXJ0aWMoYmFuZHdpZHRoXFxcXCwgc3RlcCksbWFwcGVyLmtlcm5lbC5zaWx2ZXJtYW4oYmFuZHdpZHRoXFxcXCwgc3RlcCksbWFwcGVyLmtlcm5lbC50cmlhbmd1bGFyKGJhbmR3aWR0aFxcXFwsIHN0ZXApLG1hcHBlci5rZXJuZWwudHJpY3ViZShiYW5kd2lkdGhcXFxcLCBzdGVwKSxtYXBwZXIua2VybmVsLnRyaXdlaWdodChiYW5kd2lkdGhcXFxcLCBzdGVwKSxtYXBwZXIua2VybmVsLnVuaWZvcm0oYmFuZHdpZHRoXFxcXCwgc3RlcCksbWFwcGVyLmxhc3QoKSxtYXBwZXIubGUodGhyZXNob2xkKSxtYXBwZXIubG9nKGNvbnN0YW50KSxtYXBwZXIubG93ZXN0KCksbWFwcGVyLmx0KHRocmVzaG9sZCksbWFwcGVyLm1hZCgpLG1hcHBlci5tYXgoKSxtYXBwZXIubWF4LmZvcmJpZC1udWxscygpLG1hcHBlci5tYXgueCgpLG1hcHBlci5tZWFuKCksbWFwcGVyLm1lYW4uY2lyY3VsYXIoKSxtYXBwZXIubWVhbi5jaXJjdWxhci5leGNsdWRlLW51bGxzKCksbWFwcGVyLm1lYW4uZXhjbHVkZS1udWxscygpLG1hcHBlci5tZWRpYW4oKSxtYXBwZXIubWluKCksbWFwcGVyLm1pbi5mb3JiaWQtbnVsbHMoKSxtYXBwZXIubWluLngoKSxtYXBwZXIubWludXRlKHRpbWV6b25lXFxcXHxvZmZzZXQpLG1hcHBlci5tb2QobW9kdWx1cyksbWFwcGVyLm1vbnRoKHRpbWV6b25lXFxcXHxvZmZzZXQpLG1hcHBlci5tdWwoY29uc3RhbnQpLG1hcHBlci5uZShjb25zdGFudCksbWFwcGVyLm5wZGYobXVcXFxcLCBzaWdtYSksbWFwcGVyLm9yKCksbWFwcGVyLnBhcnNlZG91YmxlKCksbWFwcGVyLnBlcmNlbnRpbGUocGVyY2VudGlsZSksbWFwcGVyLnBvdyhjb25zdGFudCksbWFwcGVyLnByb2R1Y3QoKSxtYXBwZXIucmF0ZSgpLG1hcHBlci5yZXBsYWNlKGNvbnN0YW50KSxtYXBwZXIucm91bmQoKSxtYXBwZXIuc2QoYmVzc2VsKSxtYXBwZXIuc2QuZm9yYmlkLW51bGxzKGJlc3NlbCksbWFwcGVyLnNlY29uZCh0aW1lem9uZVxcXFx8b2Zmc2V0KSxtYXBwZXIuc2lnbW9pZCgpLG1hcHBlci5zcXJ0KCksbWFwcGVyLnN1bSgpLG1hcHBlci5zdW0uZm9yYmlkLW51bGxzKCksbWFwcGVyLnRhbmgoKSxtYXBwZXIudGljaygpLG1hcHBlci50b2Jvb2xlYW4oKSxtYXBwZXIudG9kb3VibGUoKSxtYXBwZXIudG9sb25nKCksbWFwcGVyLnRvc3RyaW5nKCksbWFwcGVyLnRydWVjb3Vyc2UoKSxtYXBwZXIudmFyKGJlc3NlbCksbWFwcGVyLnZhci5mb3JiaWQtbnVsbHMoYmVzc2VsKSxtYXBwZXIudmRpc3QoKSxtYXBwZXIudnNwZWVkKCksbWFwcGVyLndlZWtkYXkodGltZXpvbmVcXFxcfG9mZnNldCksbWFwcGVyLnllYXIodGltZXpvbmVcXFxcfG9mZnNldCksbWF4LnRpY2suc2xpZGluZy53aW5kb3coKSxtYXgudGltZS5zbGlkaW5nLndpbmRvdygpfH0sICR7MzpwcmV9LCAkezQ6cG9zdH0sICR7NTpvY2N1cnJlbmNlc30gXSknXG4gICAgICBdXG4gICAgfSxcbiAgICByZWR1Y2U6IHtcbiAgICAgIHByZWZpeDogJ3JlZHVjZScsXG4gICAgICBib2R5OiBbXG4gICAgICAgICdyZWR1Y2VkR3RzID0gUkVEVUNFKFsgJHsxOmd0c30sIFskezI6bGFiZWxzfV0sICR7M3xNQUNST1JFRFVDRVIoKGRhdGEpID0+IHsgcmV0dXJuIFt0aWNrXFxcXCwgbGF0aXR1ZGVcXFxcLCBsb25naXR1ZGVcXFxcLCBlbGV2YXRpb25cXFxcLCB2YWx1ZV07IH0pLHJlZHVjZXIuYW5kKCkscmVkdWNlci5hbmQuZXhjbHVkZS1udWxscygpLHJlZHVjZXIuYXJnbWF4KCkscmVkdWNlci5hcmdtaW4oKSxyZWR1Y2VyLmNvdW50KCkscmVkdWNlci5jb3VudC5leGNsdWRlLW51bGxzKCkscmVkdWNlci5jb3VudC5pbmNsdWRlLW51bGxzKCkscmVkdWNlci5jb3VudC5ub25udWxsKCkscmVkdWNlci5qb2luKCkscmVkdWNlci5qb2luLmZvcmJpZC1udWxscygpLHJlZHVjZXIuam9pbi5ub25udWxsKCkscmVkdWNlci5qb2luLnVybGVuY29kZWQoKSxyZWR1Y2VyLm1heCgpLHJlZHVjZXIubWF4LmZvcmJpZC1udWxscygpLHJlZHVjZXIubWF4Lm5vbm51bGwoKSxyZWR1Y2VyLm1lYW4oKSxyZWR1Y2VyLm1lYW4uY2lyY3VsYXIoKSxyZWR1Y2VyLm1lYW4uY2lyY3VsYXIuZXhjbHVkZS1udWxscygpLHJlZHVjZXIubWVhbi5leGNsdWRlLW51bGxzKCkscmVkdWNlci5tZWRpYW4oKSxyZWR1Y2VyLm1pbigpLHJlZHVjZXIubWluLmZvcmJpZC1udWxscygpLHJlZHVjZXIubWluLm5vbm51bGwoKSxyZWR1Y2VyLm9yKCkscmVkdWNlci5vci5leGNsdWRlLW51bGxzKCkscmVkdWNlci5zZCgpLHJlZHVjZXIuc2QuZm9yYmlkLW51bGxzKCkscmVkdWNlci5zaGFubm9uZW50cm9weS4wKCkscmVkdWNlci5zaGFubm9uZW50cm9weS4xKCkscmVkdWNlci5zdW0oKSxyZWR1Y2VyLnN1bS5mb3JiaWQtbnVsbHMoKSxyZWR1Y2VyLnN1bS5ub25udWxsKCkscmVkdWNlci52YXIoKSxyZWR1Y2VyLnZhci5mb3JiaWQtbnVsbHMoKXx9IF0nXG4gICAgICBdXG4gICAgfSxcbiAgICBhcHBseToge1xuICAgICAgcHJlZml4OiAnYXBwbHknLFxuICAgICAgYm9keTogW1xuICAgICAgICAndHJhbnNmb3JtZWRHdHMgPSBBUFBMWShbICR7MTpndHN9LCBbJHsyOmxhYmVsc31dLCAkezN8b3AuYWRkKCksb3AuYWRkLmlnbm9yZS1udWxscygpLG9wLmFuZCgpLG9wLmFuZC5pZ25vcmUtbnVsbHMoKSxvcC5kaXYoKSxvcC5lcSgpLG9wLmdlKCksb3AuZ3QoKSxvcC5sZSgpLG9wLmx0KCksb3AubWFzaygpLG9wLm11bCgpLG9wLm11bC5pZ25vcmUtbnVsbHMoKSxvcC5uZSgpLG9wLm5lZ21hc2soKSxvcC5vcigpLG9wLm9yLmlnbm9yZS1udWxscygpLG9wLnN1YigpfH0gXSknXG4gICAgICBdLFxuICAgICAgZGVzY3JpcHRpb246ICdBcHBseSBmcmFtZXdvcmsnXG4gICAgfSxcbiAgICBpZnQ6IHtcbiAgICAgIHByZWZpeDogJ2lmdCcsXG4gICAgICBib2R5OiBbXG4gICAgICAgICdJRlQoJyxcbiAgICAgICAgJyAgKCkgPT4geyByZXR1cm4gJHsxOmNvbmRpdGlvbn07IH0sICcsXG4gICAgICAgICcgICgpID0+IHsgcmV0dXJuICR7MjphY3Rpb25faWZfdHJ1ZX0gfScsXG4gICAgICAgICcpOydcbiAgICAgIF0sXG4gICAgICBkZXNjcmlwdGlvbjogJ0lmIHN0YXRlbWVudCdcbiAgICB9LFxuICAgIGlmdGU6IHtcbiAgICAgIHByZWZpeDogJ2lmdGUnLFxuICAgICAgYm9keTogW1xuICAgICAgICAnSUZURSgnLFxuICAgICAgICAnICAoKSA9PiB7IHJldHVybiAkezE6Y29uZGl0aW9ufTsgfSwgJyxcbiAgICAgICAgJyAgKCkgPT4geyByZXR1cm4gJHsyOmFjdGlvbl9pZl90cnVlfSB9LCcsXG4gICAgICAgICcgICgpID0+IHsgcmV0dXJuICR7MjphY3Rpb25faWZfZmFsc2V9IH0nLFxuICAgICAgICAnKTsnXG4gICAgICBdLFxuICAgICAgZGVzY3JpcHRpb246ICdJZiB0aGVuIGVsc2Ugc3RhdGVtZW50J1xuICAgIH0sXG4gICAgJ3N3aXRjaCc6IHtcbiAgICAgIHByZWZpeDogJ3N3aXRjaCcsXG4gICAgICBib2R5OiBbXG4gICAgICAgICdTV0lUQ0goJyxcbiAgICAgICAgJyAgKCkgPT4geyByZXR1cm4gJHsxOmNhc2VfMX07IH0sIHsgcmV0dXJuICR7MjphY3Rpb25fMX07IH0sJyxcbiAgICAgICAgJyAgKCkgPT4geyByZXR1cm4gJHszOmNhc2VfMn07IH0sIHsgcmV0dXJuICR7NDphY3Rpb25fMn07IH0sJyxcbiAgICAgICAgJyAgKCkgPT4geyByZXR1cm4gJHs1OmNhc2VfM307IH0sIHsgcmV0dXJuICR7NjphY3Rpb25fM307IH0sJyxcbiAgICAgICAgJyAgKCkgPT4geyByZXR1cm4gJHs3OmRlZmF1bHR9OyB9LCcsXG4gICAgICAgICcgICR7ODpudW1iZXJfb2ZfY2FzZXN9JyxcbiAgICAgICAgJyk7J1xuICAgICAgXSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnU3dpdGNoIHN0YXRlbWVudCdcbiAgICB9LFxuICAgICd0cnknOiB7XG4gICAgICBwcmVmaXg6ICd0cnknLFxuICAgICAgYm9keTogW1xuICAgICAgICAnVFJZKCcsXG4gICAgICAgICcgICgpID0+IHsgJHsxOnRyeX0gfSwnLFxuICAgICAgICAnICAoKSA9PiB7ICR7MjpjYXRjaH3CoH0sJyxcbiAgICAgICAgJyAgKCkgPT4geyAkezM6ZmluYWxseX0gfScsXG4gICAgICAgICcpOydcbiAgICAgIF0sXG4gICAgICBkZXNjcmlwdGlvbjogJ1RyeS9DYXRjaCBzdGF0ZW1lbnQnXG4gICAgfSxcbiAgICAnd2hpbGUnOiB7XG4gICAgICBwcmVmaXg6ICd3aGlsZScsXG4gICAgICBib2R5OiBbXG4gICAgICAgICdXSElMRSgnLFxuICAgICAgICAnICAoKSA9PiB7IHJldHVybiAkezE6Y29uZGl0aW9ufTsgfSwnLFxuICAgICAgICAnICAoKSA9PiB7ICR7MjphY3Rpb25fd2hpbGVfdHJ1ZX0gfScsXG4gICAgICAgICcpOydcbiAgICAgIF0sXG4gICAgICBkZXNjcmlwdGlvbjogJ1doaWxlIGxvb3AnXG4gICAgfSxcbiAgICB1bnRpbDoge1xuICAgICAgcHJlZml4OiAndW50aWwnLFxuICAgICAgYm9keTogW1xuICAgICAgICAnVU5USUwoJyxcbiAgICAgICAgJyAgKCkgPT4geyAkezE6YWN0aW9uX3VudGlsX3RydWV9IH0sJyxcbiAgICAgICAgJyAgKCkgPT4geyByZXR1cm4gJHsyOmNvbmRpdGlvbn07IH0nLFxuICAgICAgICAnKTsnXG4gICAgICBdLFxuICAgICAgZGVzY3JpcHRpb246ICdVbnRpbCBsb29wJ1xuICAgIH0sXG4gICAgJ2Zvcic6IHtcbiAgICAgIHByZWZpeDogJ2ZvcicsXG4gICAgICBib2R5OiBbXG4gICAgICAgICdGT1IoJHsxOmluaXRpYWxfdmFsdWV9LCAkezI6ZmluYWxfdmFsdWV9LCcsXG4gICAgICAgICcgICgpID0+IHsgJHszOmFjdGlvbn0gfScsXG4gICAgICAgICcpOydcbiAgICAgIF0sXG4gICAgICBkZXNjcmlwdGlvbjogJ0ZvciBsb29wJ1xuICAgIH0sXG4gICAgZm9yZWFjaDoge1xuICAgICAgcHJlZml4OiAnZm9yZWFjaCcsXG4gICAgICBib2R5OiBbXG4gICAgICAgICdGT1JFQUNIKCR7MTpvYmplY3R9LCAnLFxuICAgICAgICAnICAoa2V5LCB2YWx1ZSkgPT4geyAvLyBvYmplY3QgaXMgYSBtYXAnLFxuICAgICAgICAnICAodmFsdWUpID0+IHsgICAgICAvLyBvYmplY3QgaXMgYSBsaXN0JyxcbiAgICAgICAgJyAgICAkezI6YWN0aW9ufScsXG4gICAgICAgICcgIH0nLFxuICAgICAgICAnKTsnXG4gICAgICBdLFxuICAgICAgZGVzY3JpcHRpb246ICdGb3JlYWNoIGxvb3AnXG4gICAgfSxcbiAgICBmb3JzdGVwOiB7XG4gICAgICBwcmVmaXg6ICdmb3JzdGVwJyxcbiAgICAgIGJvZHk6IFtcbiAgICAgICAgJ0ZPUlNURVAoJHsxOmluaXRpYWxfdmFsdWV9LCAkezI6ZmluYWxfdmFsdWV9LCAoKSA9PiB7IHJldHVybiAkezM6ICsgMX07IH0sJyxcbiAgICAgICAgJyAgKCkgPT4geyAkezQ6YWN0aW9ufSB9JyxcbiAgICAgICAgJyk7J1xuICAgICAgXSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRm9yc3RlcCBsb29wJ1xuICAgIH0sXG4gICAgc2htOiB7XG4gICAgICBwcmVmaXg6ICdzaG0nLFxuICAgICAgYm9keTogW1xuICAgICAgICAnTVVURVgoKCkgPT4geyAvLyBwcmV2ZW50IGEgY29uY3VycmVudCBleGVjdXRpb24gb24gdGhlIHNhbWUgU0hNIGRhdGEnLFxuICAgICAgICAnICBUUlkoKCkgPT4geycsXG4gICAgICAgICcgICAgLy8gdHJ5IHRvIHJlYWQgZGF0YSBmcm9tIFNIYXJlZCBNZW1vcnknLFxuICAgICAgICAnICAgIFNITUxPQUQoXFwnZ3RzTGlzdFxcJyknLFxuICAgICAgICAnICB9LCcsXG4gICAgICAgICcgICgpID0+IHsnLFxuICAgICAgICAnICAgIC8vIHdoZW4gbm90IGZvdW5kLCBzdG9yZSBkYXRhIGluIFNITScsXG4gICAgICAgICcgICAgU0hNU1RPUkUoXFwnZ3RzTGlzdFxcJywgJHsxOkZFVENIKFsgdG9rZW4gXFwnY2xhc3NuYW1lXFwnIHtcXFxcfSBOT1coKSBkKDM2NSkgXSkpfScsXG4gICAgICAgICcgIH0sJyxcbiAgICAgICAgJyAgKCkgPT4geycsXG4gICAgICAgICcgICAgLy8gZmluYWxseSwgbG9hZCB0aGUgcmVmZXJlbmNlIGZyb20gU0hNIGFuZCBzdG9yZSBpdCAnLFxuICAgICAgICAnICAgIGd0c0xpc3QgPSBTSE1MT0FEKFxcJ2d0c0xpc3RcXCcpJyxcbiAgICAgICAgJyAgfSk7JyxcbiAgICAgICAgJycsXG4gICAgICAgICcgIC8vIGFuYWx5dGljcyBvbiBndHNMaXN0JyxcbiAgICAgICAgJyAgJHsyOmd0c0xpc3R9JyxcbiAgICAgICAgJycsXG4gICAgICAgICcnLFxuICAgICAgICAnJyxcbiAgICAgICAgJ30sIFxcJ215TXV0ZXhcXCcpOydcbiAgICAgIF0sXG4gICAgICBkZXNjcmlwdGlvbjogJ0tlZXAgZmV0Y2hlZCBkYXRhIGluIFJBTS4gWW91IG5lZWQgdG8gZW5hYmxlIHRoZSBTSE0gZXh0ZW5zaW9uLidcbiAgICB9XG4gIH07XG59XG4iXX0=