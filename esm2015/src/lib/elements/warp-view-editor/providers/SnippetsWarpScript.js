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
export class SnippetsWarpScript {
}
SnippetsWarpScript.snippets = {
    macro: {
        prefix: 'macro (example)',
        body: [
            '{',
            '  \'name\' \'${1:euclideanDivision}\'',
            '  \'desc\' ',
            '  <\'',
            '${2:This macro returns the quotient and the remainder of a/b.}',
            '  \'>',
            '  \'sig\' [ [ [ ${3:\'a:LONG\' \'b:LONG\'} ] [ ${4:\'q:LONG\' \'r:LONG\'} ] ] ] // Signature',
            '  \'params\' {',
            '    // Signature params description',
            '    ${5:\'b\' \'parameter b TOP of the stack\'',
            '    \'a\' \'parameter a just below on the stack\'',
            '    \'q\' \'the quotient of a/b, N-1 on the stack\'',
            '    \'r\' \'the remainder of a/b, on the TOP of the stack\'}',
            '  }',
            '  \'examples\' [',
            '    <\'',
            '${6:10 3 @mymacros/euclideanDivision [ \'q\' \'r\' ] STORE',
            '\'quotient is  :\' \\$q TOSTRING +',
            '\'remainder is :\' \\$r TOSTRING +}',
            '    \'>',
            '  ]',
            '} \'info\' STORE',
            '',
            '<%',
            '  !\\$info INFO',
            '  SAVE \'context\' STORE',
            '  <%',
            '    // Code of the actual macro',
            '    ${7:[ \'a\' \'b\' ] STORE',
            '    \\$a \\$b / TOLONG',
            '    \\$a \\$b %}',
            '      ',
            '  %>',
            '  <% // catch any exception',
            '    RETHROW',
            '  %>',
            '  <% // finally, restore the context',
            '    \\$context RESTORE',
            '  %> TRY',
            '%>',
            '\'macro\' STORE',
            '',
            '// Unit tests',
            '${8:10 3 @macro [ \'q\' \'r\' ] STORE',
            '\\$q 3 == ASSERT',
            '\\$r 1 == ASSERT',
            '\\$q TYPEOF \'LONG\' == ASSERT',
            '\\$r TYPEOF \'LONG\' == ASSERT}',
            '',
            '\\$macro'
        ],
        description: 'Macro'
    },
    'macro(empty)': {
        prefix: 'macro (empty)',
        body: [
            '{',
            '  \'name\' \'${1: }\'',
            '  \'desc\' ',
            '  <\'',
            '${2: }',
            '  \'>',
            '  \'sig\' [ [ [   ] [   ] ] ] // Signature',
            '  \'params\' {',
            '    // Signature params description',
            '  }',
            '  \'examples\' [',
            '    <\'',
            '',
            '    \'>',
            '  ]',
            '} \'info\' STORE',
            '',
            '<%',
            '  !\\$info INFO',
            '  SAVE \'context\' STORE',
            '  <%',
            '    // Code of the actual macro',
            '    ${3:  }',
            '  %>',
            '  <% // catch any exception',
            '    RETHROW',
            '  %>',
            '  <% // finally, restore the context',
            '    \\$context RESTORE',
            '  %> TRY',
            '%>',
            '\'macro\' STORE',
            '',
            '// Unit tests',
            '',
            '\\$macro'
        ],
        description: 'Macro'
    },
    fetch: {
        prefix: 'fetch',
        body: [
            '[ \'TOKEN\' \'className\'  { \'label0\' \'=value0\'  \'label1\' \'~val.\' }  start timespan ] FETCH'
        ]
    },
    bucketize: {
        prefix: 'bucketize',
        body: [
            '[ ${1:gts} ${2|MACROBUCKETIZER,bucketizer.and,bucketizer.count,bucketizer.count.exclude-nulls,bucketizer.count.include-nulls,bucketizer.count.nonnull,bucketizer.first,bucketizer.join,bucketizer.join.forbid-nulls,bucketizer.last,bucketizer.max,bucketizer.max.forbid-nulls,bucketizer.mean,bucketizer.mean.circular,bucketizer.mean.circular.exclude-nulls,bucketizer.mean.exclude-nulls,bucketizer.median,bucketizer.min,bucketizer.min.forbid-nulls,bucketizer.or,bucketizer.sum,bucketizer.sum.forbid-nulls|} ${3:lastbucket} ${4:bucketspan} ${5:bucketcount} ] BUCKETIZE'
        ]
    },
    filter: {
        prefix: 'filter',
        body: [
            '[ ${1:gts} [${2:labels}] ${3|MACROFILTER,filter.byattr,filter.byclass,filter.bylabels,filter.bylabelsattr,filter.bymetadata,filter.last.eq,filter.last.ge,filter.last.gt,filter.last.le,filter.last.lt,filter.last.ne,filter.latencies|} ] FILTER'
        ]
    },
    map: {
        prefix: 'map',
        body: [
            '[ ${1:gts} ${2|MACROMAPPER,mapper.abs,mapper.add,mapper.and,mapper.ceil,mapper.count,mapper.count.exclude-nulls,mapper.count.include-nulls,mapper.count.nonnull,mapper.day,mapper.delta,mapper.dotproduct,mapper.dotproduct.positive,mapper.dotproduct.sigmoid,mapper.dotproduct.tanh,mapper.eq,mapper.exp,mapper.finite,mapper.first,mapper.floor,mapper.ge,mapper.geo.approximate,mapper.geo.clear,mapper.geo.outside,mapper.geo.within,mapper.gt,mapper.hdist,mapper.highest,mapper.hour,mapper.hspeed,mapper.join,mapper.join.forbid-nulls,mapper.kernel.cosine,mapper.kernel.epanechnikov,mapper.kernel.gaussian,mapper.kernel.logistic,mapper.kernel.quartic,mapper.kernel.silverman,mapper.kernel.triangular,mapper.kernel.tricube,mapper.kernel.triweight,mapper.kernel.uniform,mapper.last,mapper.le,mapper.log,mapper.lowest,mapper.lt,mapper.mad,mapper.max,mapper.max.forbid-nulls,mapper.max.x,mapper.mean,mapper.mean.circular,mapper.mean.circular.exclude-nulls,mapper.mean.exclude-nulls,mapper.median,mapper.min,mapper.min.forbid-nulls,mapper.min.x,mapper.minute,mapper.mod,mapper.month,mapper.mul,mapper.ne,mapper.npdf,mapper.or,mapper.parsedouble,mapper.percentile,mapper.pow,mapper.product,mapper.rate,mapper.replace,mapper.round,mapper.sd,mapper.sd.forbid-nulls,mapper.second,mapper.sigmoid,mapper.sqrt,mapper.sum,mapper.sum.forbid-nulls,mapper.tanh,mapper.tick,mapper.toboolean,mapper.todouble,mapper.tolong,mapper.tostring,mapper.truecourse,mapper.var,mapper.var.forbid-nulls,mapper.vdist,mapper.vspeed,mapper.weekday,mapper.year,max.tick.sliding.window,max.time.sliding.window|} ${3:pre} ${4:post} ${5:occurrences} ] MAP'
        ]
    },
    reduce: {
        prefix: 'reduce',
        body: [
            '[ ${1:gts} [${2:labels}] ${3|MACROREDUCER,reducer.and,reducer.and.exclude-nulls,reducer.argmax,reducer.argmin,reducer.count,reducer.count.exclude-nulls,reducer.count.include-nulls,reducer.count.nonnull,reducer.join,reducer.join.forbid-nulls,reducer.join.nonnull,reducer.join.urlencoded,reducer.max,reducer.max.forbid-nulls,reducer.max.nonnull,reducer.mean,reducer.mean.circular,reducer.mean.circular.exclude-nulls,reducer.mean.exclude-nulls,reducer.median,reducer.min,reducer.min.forbid-nulls,reducer.min.nonnull,reducer.or,reducer.or.exclude-nulls,reducer.sd,reducer.sd.forbid-nulls,reducer.shannonentropy.0,reducer.shannonentropy.1,reducer.sum,reducer.sum.forbid-nulls,reducer.sum.nonnull,reducer.var,reducer.var.forbid-nulls|} ] REDUCE'
        ]
    },
    apply: {
        prefix: 'apply',
        body: [
            '[ ${1:gts} [${2:labels}] ${3|OP,op.add,op.add.ignore-nulls,op.and,op.and.ignore-nulls,op.div,op.eq,op.ge,op.gt,op.le,op.lt,op.mask,op.mul,op.mul.ignore-nulls,op.ne,op.negmask,op.or,op.or.ignore-nulls,op.sub|} ] APPLY'
        ],
        description: 'Apply framework'
    },
    ift: {
        prefix: 'ift',
        body: [
            '<% ${1:condition} %>',
            '<% ${2:action_if_true} %>',
            'IFT'
        ],
        description: 'If statement'
    },
    ifte: {
        prefix: 'ifte',
        body: [
            '<% ${1:condition} %>',
            '<% ${2:action_if_true} %>',
            '<% ${3:action_if_false} %>',
            'IFTE'
        ],
        description: 'If then else statement'
    },
    'switch': {
        prefix: 'switch',
        body: [
            '<% ${1:case_1} %> <% ${2:action_1} %>',
            '<% ${3:case_2} %> <% ${4:action_2} %>',
            '<% ${5:case_3} %> <% ${6:action_3} %>',
            '<% ${7:default} %>',
            '${8:number_of_cases}',
            'SWITCH'
        ],
        description: 'Switch statement'
    },
    'try': {
        prefix: 'try',
        body: [
            '<% ${1:try} %>',
            '<% ${2:catch} %>',
            '<% ${3:finally} %>',
            'TRY'
        ],
        description: 'Try/Catch statement'
    },
    'while': {
        prefix: 'while',
        body: [
            '<% ${1:condition} %>',
            '<% ${2:action_while_true} %>',
            'WHILE'
        ],
        description: 'While loop'
    },
    until: {
        prefix: 'until',
        body: [
            '<% ${1:action_until_true} %>',
            '<% ${2:condition} %>',
            'UNTIL'
        ],
        description: 'Until loop'
    },
    'for': {
        prefix: 'for',
        body: [
            '${1:initial_value} ${2:final_value}',
            '<% ${3:action} %>',
            'FOR'
        ],
        description: 'For loop'
    },
    foreach: {
        prefix: 'foreach',
        body: [
            '${1:object}',
            '<% ',
            '  //[ \'key\' \'value\' ] STORE // object is a map',
            '  //[ \'value\' ] STORE // object is a list',
            '  ${2:action}',
            '%>',
            'FOREACH'
        ],
        description: 'Foreach loop'
    },
    forstep: {
        prefix: 'forstep',
        body: [
            '${1:initial_value} ${2:final_value} <% ${3:1 +} %>',
            '<% ${4:action} %>',
            'FORSTEP'
        ],
        description: 'Forstep loop'
    },
    shm: {
        prefix: 'shm',
        body: [
            '<%',
            '  <%',
            '    //try to read data from SHared Memory',
            '    \'gtsList\' SHMLOAD DROP',
            '  %>',
            '  <%',
            '    //when not found, store data in SHM',
            '    ${1:[ \\$token \'classname\' {\\} NOW 365 d ] FETCH} \'gtsList\' SHMSTORE',
            '  %>',
            '  <%',
            '    //finally, load the reference from SHM and store it ',
            '    \'gtsList\' SHMLOAD \'gtsList\' STORE',
            '  %> TRY',
            '',
            '  //analytics on \\$gtsList',
            '  ${2:\\$gtsList}',
            '',
            '',
            '',
            '%> \'myMutex\' MUTEX //prevent a concurrent execution on the same SHM data'
        ],
        description: 'Keep fetched data in RAM. You need to enable the SHM extension.'
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU25pcHBldHNXYXJwU2NyaXB0LmpzIiwic291cmNlUm9vdCI6Ii9ob21lL3hhdmllci93b3Jrc3BhY2Uvd2FycHZpZXctZWRpdG9yL3Byb2plY3RzL3dhcnB2aWV3LWVkaXRvci1uZy8iLCJzb3VyY2VzIjpbInNyYy9saWIvZWxlbWVudHMvd2FycC12aWV3LWVkaXRvci9wcm92aWRlcnMvU25pcHBldHNXYXJwU2NyaXB0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7OztHQWNHO0FBRUgsTUFBTSxPQUFPLGtCQUFrQjs7QUFFdEIsMkJBQVEsR0FBRztJQUNoQixLQUFLLEVBQUU7UUFDTCxNQUFNLEVBQUUsaUJBQWlCO1FBQ3pCLElBQUksRUFBRTtZQUNKLEdBQUc7WUFDSCx1Q0FBdUM7WUFDdkMsYUFBYTtZQUNiLE9BQU87WUFDUCxnRUFBZ0U7WUFDaEUsT0FBTztZQUNQLDhGQUE4RjtZQUM5RixnQkFBZ0I7WUFDaEIscUNBQXFDO1lBQ3JDLGdEQUFnRDtZQUNoRCxtREFBbUQ7WUFDbkQscURBQXFEO1lBQ3JELDhEQUE4RDtZQUM5RCxLQUFLO1lBQ0wsa0JBQWtCO1lBQ2xCLFNBQVM7WUFDVCw0REFBNEQ7WUFDNUQsb0NBQW9DO1lBQ3BDLHFDQUFxQztZQUNyQyxTQUFTO1lBQ1QsS0FBSztZQUNMLGtCQUFrQjtZQUNsQixFQUFFO1lBQ0YsSUFBSTtZQUNKLGlCQUFpQjtZQUNqQiwwQkFBMEI7WUFDMUIsTUFBTTtZQUNOLGlDQUFpQztZQUNqQywrQkFBK0I7WUFDL0Isd0JBQXdCO1lBQ3hCLGtCQUFrQjtZQUNsQixRQUFRO1lBQ1IsTUFBTTtZQUNOLDZCQUE2QjtZQUM3QixhQUFhO1lBQ2IsTUFBTTtZQUNOLHNDQUFzQztZQUN0Qyx3QkFBd0I7WUFDeEIsVUFBVTtZQUNWLElBQUk7WUFDSixpQkFBaUI7WUFDakIsRUFBRTtZQUNGLGVBQWU7WUFDZix1Q0FBdUM7WUFDdkMsa0JBQWtCO1lBQ2xCLGtCQUFrQjtZQUNsQixnQ0FBZ0M7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QUssRUFBRTtRQUNMLE1BQU0sRUFBRSxLQUFLO1FBQ2IsSUFBSSxFQUFFO1lBQ0oscUNBQXFDO1lBQ3JDLG1CQUFtQjtZQUNuQixLQUFLO1NBQ047UUFDRCxXQUFXLEVBQUUsVUFBVTtLQUN4QjtJQUNELE9BQU8sRUFBRTtRQUNQLE1BQU0sRUFBRSxTQUFTO1FBQ2pCLElBQUksRUFBRTtZQUNKLGFBQWE7WUFDYixLQUFLO1lBQ0wsb0RBQW9EO1lBQ3BELDZDQUE2QztZQUM3QyxlQUFlO1lBQ2YsSUFBSTtZQUNKLFNBQVM7U0FDVjtRQUNELFdBQVcsRUFBRSxjQUFjO0tBQzVCO0lBQ0QsT0FBTyxFQUFFO1FBQ1AsTUFBTSxFQUFFLFNBQVM7UUFDakIsSUFBSSxFQUFFO1lBQ0osb0RBQW9EO1lBQ3BELG1CQUFtQjtZQUNuQixTQUFTO1NBQ1Y7UUFDRCxXQUFXLEVBQUUsY0FBYztLQUM1QjtJQUNELEdBQUcsRUFBRTtRQUNILE1BQU0sRUFBRSxLQUFLO1FBQ2IsSUFBSSxFQUFFO1lBQ0osSUFBSTtZQUNKLE1BQU07WUFDTiwyQ0FBMkM7WUFDM0MsOEJBQThCO1lBQzlCLE1BQU07WUFDTixNQUFNO1lBQ04seUNBQXlDO1lBQ3pDLCtFQUErRTtZQUMvRSxNQUFNO1lBQ04sTUFBTTtZQUNOLDBEQUEwRDtZQUMxRCwyQ0FBMkM7WUFDM0MsVUFBVTtZQUNWLEVBQUU7WUFDRiw2QkFBNkI7WUFDN0IsbUJBQW1CO1lBQ25CLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLDRFQUE0RTtTQUM3RTtRQUNELFdBQVcsRUFBRSxpRUFBaUU7S0FDL0U7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqICBDb3B5cmlnaHQgMjAyMCBTZW5YIFMuQS5TLlxuICpcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuZXhwb3J0IGNsYXNzIFNuaXBwZXRzV2FycFNjcmlwdCB7XG5cbiAgc3RhdGljIHNuaXBwZXRzID0ge1xuICAgIG1hY3JvOiB7XG4gICAgICBwcmVmaXg6ICdtYWNybyAoZXhhbXBsZSknLFxuICAgICAgYm9keTogW1xuICAgICAgICAneycsXG4gICAgICAgICcgIFxcJ25hbWVcXCcgXFwnJHsxOmV1Y2xpZGVhbkRpdmlzaW9ufVxcJycsXG4gICAgICAgICcgIFxcJ2Rlc2NcXCcgJyxcbiAgICAgICAgJyAgPFxcJycsXG4gICAgICAgICckezI6VGhpcyBtYWNybyByZXR1cm5zIHRoZSBxdW90aWVudCBhbmQgdGhlIHJlbWFpbmRlciBvZiBhL2IufScsXG4gICAgICAgICcgIFxcJz4nLFxuICAgICAgICAnICBcXCdzaWdcXCcgWyBbIFsgJHszOlxcJ2E6TE9OR1xcJyBcXCdiOkxPTkdcXCd9IF0gWyAkezQ6XFwncTpMT05HXFwnIFxcJ3I6TE9OR1xcJ30gXSBdIF0gLy8gU2lnbmF0dXJlJyxcbiAgICAgICAgJyAgXFwncGFyYW1zXFwnIHsnLFxuICAgICAgICAnICAgIC8vIFNpZ25hdHVyZSBwYXJhbXMgZGVzY3JpcHRpb24nLFxuICAgICAgICAnICAgICR7NTpcXCdiXFwnIFxcJ3BhcmFtZXRlciBiIFRPUCBvZiB0aGUgc3RhY2tcXCcnLFxuICAgICAgICAnICAgIFxcJ2FcXCcgXFwncGFyYW1ldGVyIGEganVzdCBiZWxvdyBvbiB0aGUgc3RhY2tcXCcnLFxuICAgICAgICAnICAgIFxcJ3FcXCcgXFwndGhlIHF1b3RpZW50IG9mIGEvYiwgTi0xIG9uIHRoZSBzdGFja1xcJycsXG4gICAgICAgICcgICAgXFwnclxcJyBcXCd0aGUgcmVtYWluZGVyIG9mIGEvYiwgb24gdGhlIFRPUCBvZiB0aGUgc3RhY2tcXCd9JyxcbiAgICAgICAgJyAgfScsXG4gICAgICAgICcgIFxcJ2V4YW1wbGVzXFwnIFsnLFxuICAgICAgICAnICAgIDxcXCcnLFxuICAgICAgICAnJHs2OjEwIDMgQG15bWFjcm9zL2V1Y2xpZGVhbkRpdmlzaW9uIFsgXFwncVxcJyBcXCdyXFwnIF0gU1RPUkUnLFxuICAgICAgICAnXFwncXVvdGllbnQgaXMgIDpcXCcgXFxcXCRxIFRPU1RSSU5HICsnLFxuICAgICAgICAnXFwncmVtYWluZGVyIGlzIDpcXCcgXFxcXCRyIFRPU1RSSU5HICt9JyxcbiAgICAgICAgJyAgICBcXCc+JyxcbiAgICAgICAgJyAgXScsXG4gICAgICAgICd9IFxcJ2luZm9cXCcgU1RPUkUnLFxuICAgICAgICAnJyxcbiAgICAgICAgJzwlJyxcbiAgICAgICAgJyAgIVxcXFwkaW5mbyBJTkZPJyxcbiAgICAgICAgJyAgU0FWRSBcXCdjb250ZXh0XFwnIFNUT1JFJyxcbiAgICAgICAgJyAgPCUnLFxuICAgICAgICAnICAgIC8vIENvZGUgb2YgdGhlIGFjdHVhbCBtYWNybycsXG4gICAgICAgICcgICAgJHs3OlsgXFwnYVxcJyBcXCdiXFwnIF0gU1RPUkUnLFxuICAgICAgICAnICAgIFxcXFwkYSBcXFxcJGIgLyBUT0xPTkcnLFxuICAgICAgICAnICAgIFxcXFwkYSBcXFxcJGIgJX0nLFxuICAgICAgICAnICAgICAgJyxcbiAgICAgICAgJyAgJT4nLFxuICAgICAgICAnICA8JSAvLyBjYXRjaCBhbnkgZXhjZXB0aW9uJyxcbiAgICAgICAgJyAgICBSRVRIUk9XJyxcbiAgICAgICAgJyAgJT4nLFxuICAgICAgICAnICA8JSAvLyBmaW5hbGx5LCByZXN0b3JlIHRoZSBjb250ZXh0JyxcbiAgICAgICAgJyAgICBcXFxcJGNvbnRleHQgUkVTVE9SRScsXG4gICAgICAgICcgICU+IFRSWScsXG4gICAgICAgICclPicsXG4gICAgICAgICdcXCdtYWNyb1xcJyBTVE9SRScsXG4gICAgICAgICcnLFxuICAgICAgICAnLy8gVW5pdCB0ZXN0cycsXG4gICAgICAgICckezg6MTAgMyBAbWFjcm8gWyBcXCdxXFwnIFxcJ3JcXCcgXSBTVE9SRScsXG4gICAgICAgICdcXFxcJHEgMyA9PSBBU1NFUlQnLFxuICAgICAgICAnXFxcXCRyIDEgPT0gQVNTRVJUJyxcbiAgICAgICAgJ1xcXFwkcSBUWVBFT0YgXFwnTE9OR1xcJyA9PSBBU1NFUlQnLFxuICAgICAgICAnXFxcXCRyIFRZUEVPRiBcXCdMT05HXFwnID09IEFTU0VSVH0nLFxuICAgICAgICAnJyxcbiAgICAgICAgJ1xcXFwkbWFjcm8nXG4gICAgICBdLFxuICAgICAgZGVzY3JpcHRpb246ICdNYWNybydcbiAgICB9LFxuICAgICdtYWNybyhlbXB0eSknOiB7XG4gICAgICBwcmVmaXg6ICdtYWNybyAoZW1wdHkpJyxcbiAgICAgIGJvZHk6IFtcbiAgICAgICAgJ3snLFxuICAgICAgICAnICBcXCduYW1lXFwnIFxcJyR7MTogfVxcJycsXG4gICAgICAgICcgIFxcJ2Rlc2NcXCcgJyxcbiAgICAgICAgJyAgPFxcJycsXG4gICAgICAgICckezI6IH0nLFxuICAgICAgICAnICBcXCc+JyxcbiAgICAgICAgJyAgXFwnc2lnXFwnIFsgWyBbICAgXSBbICAgXSBdIF0gLy8gU2lnbmF0dXJlJyxcbiAgICAgICAgJyAgXFwncGFyYW1zXFwnIHsnLFxuICAgICAgICAnICAgIC8vIFNpZ25hdHVyZSBwYXJhbXMgZGVzY3JpcHRpb24nLFxuICAgICAgICAnICB9JyxcbiAgICAgICAgJyAgXFwnZXhhbXBsZXNcXCcgWycsXG4gICAgICAgICcgICAgPFxcJycsXG4gICAgICAgICcnLFxuICAgICAgICAnICAgIFxcJz4nLFxuICAgICAgICAnICBdJyxcbiAgICAgICAgJ30gXFwnaW5mb1xcJyBTVE9SRScsXG4gICAgICAgICcnLFxuICAgICAgICAnPCUnLFxuICAgICAgICAnICAhXFxcXCRpbmZvIElORk8nLFxuICAgICAgICAnICBTQVZFIFxcJ2NvbnRleHRcXCcgU1RPUkUnLFxuICAgICAgICAnICA8JScsXG4gICAgICAgICcgICAgLy8gQ29kZSBvZiB0aGUgYWN0dWFsIG1hY3JvJyxcbiAgICAgICAgJyAgICAkezM6ICB9JyxcbiAgICAgICAgJyAgJT4nLFxuICAgICAgICAnICA8JSAvLyBjYXRjaCBhbnkgZXhjZXB0aW9uJyxcbiAgICAgICAgJyAgICBSRVRIUk9XJyxcbiAgICAgICAgJyAgJT4nLFxuICAgICAgICAnICA8JSAvLyBmaW5hbGx5LCByZXN0b3JlIHRoZSBjb250ZXh0JyxcbiAgICAgICAgJyAgICBcXFxcJGNvbnRleHQgUkVTVE9SRScsXG4gICAgICAgICcgICU+IFRSWScsXG4gICAgICAgICclPicsXG4gICAgICAgICdcXCdtYWNyb1xcJyBTVE9SRScsXG4gICAgICAgICcnLFxuICAgICAgICAnLy8gVW5pdCB0ZXN0cycsXG4gICAgICAgICcnLFxuICAgICAgICAnXFxcXCRtYWNybydcbiAgICAgIF0sXG4gICAgICBkZXNjcmlwdGlvbjogJ01hY3JvJ1xuICAgIH0sXG4gICAgZmV0Y2g6IHtcbiAgICAgIHByZWZpeDogJ2ZldGNoJyxcbiAgICAgIGJvZHk6IFtcbiAgICAgICAgJ1sgXFwnVE9LRU5cXCcgXFwnY2xhc3NOYW1lXFwnICB7IFxcJ2xhYmVsMFxcJyBcXCc9dmFsdWUwXFwnICBcXCdsYWJlbDFcXCcgXFwnfnZhbC5cXCcgfSAgc3RhcnQgdGltZXNwYW4gXSBGRVRDSCdcbiAgICAgIF1cbiAgICB9LFxuICAgIGJ1Y2tldGl6ZToge1xuICAgICAgcHJlZml4OiAnYnVja2V0aXplJyxcbiAgICAgIGJvZHk6IFtcbiAgICAgICAgJ1sgJHsxOmd0c30gJHsyfE1BQ1JPQlVDS0VUSVpFUixidWNrZXRpemVyLmFuZCxidWNrZXRpemVyLmNvdW50LGJ1Y2tldGl6ZXIuY291bnQuZXhjbHVkZS1udWxscyxidWNrZXRpemVyLmNvdW50LmluY2x1ZGUtbnVsbHMsYnVja2V0aXplci5jb3VudC5ub25udWxsLGJ1Y2tldGl6ZXIuZmlyc3QsYnVja2V0aXplci5qb2luLGJ1Y2tldGl6ZXIuam9pbi5mb3JiaWQtbnVsbHMsYnVja2V0aXplci5sYXN0LGJ1Y2tldGl6ZXIubWF4LGJ1Y2tldGl6ZXIubWF4LmZvcmJpZC1udWxscyxidWNrZXRpemVyLm1lYW4sYnVja2V0aXplci5tZWFuLmNpcmN1bGFyLGJ1Y2tldGl6ZXIubWVhbi5jaXJjdWxhci5leGNsdWRlLW51bGxzLGJ1Y2tldGl6ZXIubWVhbi5leGNsdWRlLW51bGxzLGJ1Y2tldGl6ZXIubWVkaWFuLGJ1Y2tldGl6ZXIubWluLGJ1Y2tldGl6ZXIubWluLmZvcmJpZC1udWxscyxidWNrZXRpemVyLm9yLGJ1Y2tldGl6ZXIuc3VtLGJ1Y2tldGl6ZXIuc3VtLmZvcmJpZC1udWxsc3x9ICR7MzpsYXN0YnVja2V0fSAkezQ6YnVja2V0c3Bhbn0gJHs1OmJ1Y2tldGNvdW50fSBdIEJVQ0tFVElaRSdcbiAgICAgIF1cbiAgICB9LFxuICAgIGZpbHRlcjoge1xuICAgICAgcHJlZml4OiAnZmlsdGVyJyxcbiAgICAgIGJvZHk6IFtcbiAgICAgICAgJ1sgJHsxOmd0c30gWyR7MjpsYWJlbHN9XSAkezN8TUFDUk9GSUxURVIsZmlsdGVyLmJ5YXR0cixmaWx0ZXIuYnljbGFzcyxmaWx0ZXIuYnlsYWJlbHMsZmlsdGVyLmJ5bGFiZWxzYXR0cixmaWx0ZXIuYnltZXRhZGF0YSxmaWx0ZXIubGFzdC5lcSxmaWx0ZXIubGFzdC5nZSxmaWx0ZXIubGFzdC5ndCxmaWx0ZXIubGFzdC5sZSxmaWx0ZXIubGFzdC5sdCxmaWx0ZXIubGFzdC5uZSxmaWx0ZXIubGF0ZW5jaWVzfH0gXSBGSUxURVInXG4gICAgICBdXG4gICAgfSxcbiAgICBtYXA6IHtcbiAgICAgIHByZWZpeDogJ21hcCcsXG4gICAgICBib2R5OiBbXG4gICAgICAgICdbICR7MTpndHN9ICR7MnxNQUNST01BUFBFUixtYXBwZXIuYWJzLG1hcHBlci5hZGQsbWFwcGVyLmFuZCxtYXBwZXIuY2VpbCxtYXBwZXIuY291bnQsbWFwcGVyLmNvdW50LmV4Y2x1ZGUtbnVsbHMsbWFwcGVyLmNvdW50LmluY2x1ZGUtbnVsbHMsbWFwcGVyLmNvdW50Lm5vbm51bGwsbWFwcGVyLmRheSxtYXBwZXIuZGVsdGEsbWFwcGVyLmRvdHByb2R1Y3QsbWFwcGVyLmRvdHByb2R1Y3QucG9zaXRpdmUsbWFwcGVyLmRvdHByb2R1Y3Quc2lnbW9pZCxtYXBwZXIuZG90cHJvZHVjdC50YW5oLG1hcHBlci5lcSxtYXBwZXIuZXhwLG1hcHBlci5maW5pdGUsbWFwcGVyLmZpcnN0LG1hcHBlci5mbG9vcixtYXBwZXIuZ2UsbWFwcGVyLmdlby5hcHByb3hpbWF0ZSxtYXBwZXIuZ2VvLmNsZWFyLG1hcHBlci5nZW8ub3V0c2lkZSxtYXBwZXIuZ2VvLndpdGhpbixtYXBwZXIuZ3QsbWFwcGVyLmhkaXN0LG1hcHBlci5oaWdoZXN0LG1hcHBlci5ob3VyLG1hcHBlci5oc3BlZWQsbWFwcGVyLmpvaW4sbWFwcGVyLmpvaW4uZm9yYmlkLW51bGxzLG1hcHBlci5rZXJuZWwuY29zaW5lLG1hcHBlci5rZXJuZWwuZXBhbmVjaG5pa292LG1hcHBlci5rZXJuZWwuZ2F1c3NpYW4sbWFwcGVyLmtlcm5lbC5sb2dpc3RpYyxtYXBwZXIua2VybmVsLnF1YXJ0aWMsbWFwcGVyLmtlcm5lbC5zaWx2ZXJtYW4sbWFwcGVyLmtlcm5lbC50cmlhbmd1bGFyLG1hcHBlci5rZXJuZWwudHJpY3ViZSxtYXBwZXIua2VybmVsLnRyaXdlaWdodCxtYXBwZXIua2VybmVsLnVuaWZvcm0sbWFwcGVyLmxhc3QsbWFwcGVyLmxlLG1hcHBlci5sb2csbWFwcGVyLmxvd2VzdCxtYXBwZXIubHQsbWFwcGVyLm1hZCxtYXBwZXIubWF4LG1hcHBlci5tYXguZm9yYmlkLW51bGxzLG1hcHBlci5tYXgueCxtYXBwZXIubWVhbixtYXBwZXIubWVhbi5jaXJjdWxhcixtYXBwZXIubWVhbi5jaXJjdWxhci5leGNsdWRlLW51bGxzLG1hcHBlci5tZWFuLmV4Y2x1ZGUtbnVsbHMsbWFwcGVyLm1lZGlhbixtYXBwZXIubWluLG1hcHBlci5taW4uZm9yYmlkLW51bGxzLG1hcHBlci5taW4ueCxtYXBwZXIubWludXRlLG1hcHBlci5tb2QsbWFwcGVyLm1vbnRoLG1hcHBlci5tdWwsbWFwcGVyLm5lLG1hcHBlci5ucGRmLG1hcHBlci5vcixtYXBwZXIucGFyc2Vkb3VibGUsbWFwcGVyLnBlcmNlbnRpbGUsbWFwcGVyLnBvdyxtYXBwZXIucHJvZHVjdCxtYXBwZXIucmF0ZSxtYXBwZXIucmVwbGFjZSxtYXBwZXIucm91bmQsbWFwcGVyLnNkLG1hcHBlci5zZC5mb3JiaWQtbnVsbHMsbWFwcGVyLnNlY29uZCxtYXBwZXIuc2lnbW9pZCxtYXBwZXIuc3FydCxtYXBwZXIuc3VtLG1hcHBlci5zdW0uZm9yYmlkLW51bGxzLG1hcHBlci50YW5oLG1hcHBlci50aWNrLG1hcHBlci50b2Jvb2xlYW4sbWFwcGVyLnRvZG91YmxlLG1hcHBlci50b2xvbmcsbWFwcGVyLnRvc3RyaW5nLG1hcHBlci50cnVlY291cnNlLG1hcHBlci52YXIsbWFwcGVyLnZhci5mb3JiaWQtbnVsbHMsbWFwcGVyLnZkaXN0LG1hcHBlci52c3BlZWQsbWFwcGVyLndlZWtkYXksbWFwcGVyLnllYXIsbWF4LnRpY2suc2xpZGluZy53aW5kb3csbWF4LnRpbWUuc2xpZGluZy53aW5kb3d8fSAkezM6cHJlfSAkezQ6cG9zdH0gJHs1Om9jY3VycmVuY2VzfSBdIE1BUCdcbiAgICAgIF1cbiAgICB9LFxuICAgIHJlZHVjZToge1xuICAgICAgcHJlZml4OiAncmVkdWNlJyxcbiAgICAgIGJvZHk6IFtcbiAgICAgICAgJ1sgJHsxOmd0c30gWyR7MjpsYWJlbHN9XSAkezN8TUFDUk9SRURVQ0VSLHJlZHVjZXIuYW5kLHJlZHVjZXIuYW5kLmV4Y2x1ZGUtbnVsbHMscmVkdWNlci5hcmdtYXgscmVkdWNlci5hcmdtaW4scmVkdWNlci5jb3VudCxyZWR1Y2VyLmNvdW50LmV4Y2x1ZGUtbnVsbHMscmVkdWNlci5jb3VudC5pbmNsdWRlLW51bGxzLHJlZHVjZXIuY291bnQubm9ubnVsbCxyZWR1Y2VyLmpvaW4scmVkdWNlci5qb2luLmZvcmJpZC1udWxscyxyZWR1Y2VyLmpvaW4ubm9ubnVsbCxyZWR1Y2VyLmpvaW4udXJsZW5jb2RlZCxyZWR1Y2VyLm1heCxyZWR1Y2VyLm1heC5mb3JiaWQtbnVsbHMscmVkdWNlci5tYXgubm9ubnVsbCxyZWR1Y2VyLm1lYW4scmVkdWNlci5tZWFuLmNpcmN1bGFyLHJlZHVjZXIubWVhbi5jaXJjdWxhci5leGNsdWRlLW51bGxzLHJlZHVjZXIubWVhbi5leGNsdWRlLW51bGxzLHJlZHVjZXIubWVkaWFuLHJlZHVjZXIubWluLHJlZHVjZXIubWluLmZvcmJpZC1udWxscyxyZWR1Y2VyLm1pbi5ub25udWxsLHJlZHVjZXIub3IscmVkdWNlci5vci5leGNsdWRlLW51bGxzLHJlZHVjZXIuc2QscmVkdWNlci5zZC5mb3JiaWQtbnVsbHMscmVkdWNlci5zaGFubm9uZW50cm9weS4wLHJlZHVjZXIuc2hhbm5vbmVudHJvcHkuMSxyZWR1Y2VyLnN1bSxyZWR1Y2VyLnN1bS5mb3JiaWQtbnVsbHMscmVkdWNlci5zdW0ubm9ubnVsbCxyZWR1Y2VyLnZhcixyZWR1Y2VyLnZhci5mb3JiaWQtbnVsbHN8fSBdIFJFRFVDRSdcbiAgICAgIF1cbiAgICB9LFxuICAgIGFwcGx5OiB7XG4gICAgICBwcmVmaXg6ICdhcHBseScsXG4gICAgICBib2R5OiBbXG4gICAgICAgICdbICR7MTpndHN9IFskezI6bGFiZWxzfV0gJHszfE9QLG9wLmFkZCxvcC5hZGQuaWdub3JlLW51bGxzLG9wLmFuZCxvcC5hbmQuaWdub3JlLW51bGxzLG9wLmRpdixvcC5lcSxvcC5nZSxvcC5ndCxvcC5sZSxvcC5sdCxvcC5tYXNrLG9wLm11bCxvcC5tdWwuaWdub3JlLW51bGxzLG9wLm5lLG9wLm5lZ21hc2ssb3Aub3Isb3Aub3IuaWdub3JlLW51bGxzLG9wLnN1Ynx9IF0gQVBQTFknXG4gICAgICBdLFxuICAgICAgZGVzY3JpcHRpb246ICdBcHBseSBmcmFtZXdvcmsnXG4gICAgfSxcbiAgICBpZnQ6IHtcbiAgICAgIHByZWZpeDogJ2lmdCcsXG4gICAgICBib2R5OiBbXG4gICAgICAgICc8JSAkezE6Y29uZGl0aW9ufSAlPicsXG4gICAgICAgICc8JSAkezI6YWN0aW9uX2lmX3RydWV9ICU+JyxcbiAgICAgICAgJ0lGVCdcbiAgICAgIF0sXG4gICAgICBkZXNjcmlwdGlvbjogJ0lmIHN0YXRlbWVudCdcbiAgICB9LFxuICAgIGlmdGU6IHtcbiAgICAgIHByZWZpeDogJ2lmdGUnLFxuICAgICAgYm9keTogW1xuICAgICAgICAnPCUgJHsxOmNvbmRpdGlvbn0gJT4nLFxuICAgICAgICAnPCUgJHsyOmFjdGlvbl9pZl90cnVlfSAlPicsXG4gICAgICAgICc8JSAkezM6YWN0aW9uX2lmX2ZhbHNlfSAlPicsXG4gICAgICAgICdJRlRFJ1xuICAgICAgXSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnSWYgdGhlbiBlbHNlIHN0YXRlbWVudCdcbiAgICB9LFxuICAgICdzd2l0Y2gnOiB7XG4gICAgICBwcmVmaXg6ICdzd2l0Y2gnLFxuICAgICAgYm9keTogW1xuICAgICAgICAnPCUgJHsxOmNhc2VfMX0gJT4gPCUgJHsyOmFjdGlvbl8xfSAlPicsXG4gICAgICAgICc8JSAkezM6Y2FzZV8yfSAlPiA8JSAkezQ6YWN0aW9uXzJ9ICU+JyxcbiAgICAgICAgJzwlICR7NTpjYXNlXzN9ICU+IDwlICR7NjphY3Rpb25fM30gJT4nLFxuICAgICAgICAnPCUgJHs3OmRlZmF1bHR9ICU+JyxcbiAgICAgICAgJyR7ODpudW1iZXJfb2ZfY2FzZXN9JyxcbiAgICAgICAgJ1NXSVRDSCdcbiAgICAgIF0sXG4gICAgICBkZXNjcmlwdGlvbjogJ1N3aXRjaCBzdGF0ZW1lbnQnXG4gICAgfSxcbiAgICAndHJ5Jzoge1xuICAgICAgcHJlZml4OiAndHJ5JyxcbiAgICAgIGJvZHk6IFtcbiAgICAgICAgJzwlICR7MTp0cnl9ICU+JyxcbiAgICAgICAgJzwlICR7MjpjYXRjaH0gJT4nLFxuICAgICAgICAnPCUgJHszOmZpbmFsbHl9ICU+JyxcbiAgICAgICAgJ1RSWSdcbiAgICAgIF0sXG4gICAgICBkZXNjcmlwdGlvbjogJ1RyeS9DYXRjaCBzdGF0ZW1lbnQnXG4gICAgfSxcbiAgICAnd2hpbGUnOiB7XG4gICAgICBwcmVmaXg6ICd3aGlsZScsXG4gICAgICBib2R5OiBbXG4gICAgICAgICc8JSAkezE6Y29uZGl0aW9ufSAlPicsXG4gICAgICAgICc8JSAkezI6YWN0aW9uX3doaWxlX3RydWV9ICU+JyxcbiAgICAgICAgJ1dISUxFJ1xuICAgICAgXSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnV2hpbGUgbG9vcCdcbiAgICB9LFxuICAgIHVudGlsOiB7XG4gICAgICBwcmVmaXg6ICd1bnRpbCcsXG4gICAgICBib2R5OiBbXG4gICAgICAgICc8JSAkezE6YWN0aW9uX3VudGlsX3RydWV9ICU+JyxcbiAgICAgICAgJzwlICR7Mjpjb25kaXRpb259ICU+JyxcbiAgICAgICAgJ1VOVElMJ1xuICAgICAgXSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVW50aWwgbG9vcCdcbiAgICB9LFxuICAgICdmb3InOiB7XG4gICAgICBwcmVmaXg6ICdmb3InLFxuICAgICAgYm9keTogW1xuICAgICAgICAnJHsxOmluaXRpYWxfdmFsdWV9ICR7MjpmaW5hbF92YWx1ZX0nLFxuICAgICAgICAnPCUgJHszOmFjdGlvbn0gJT4nLFxuICAgICAgICAnRk9SJ1xuICAgICAgXSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRm9yIGxvb3AnXG4gICAgfSxcbiAgICBmb3JlYWNoOiB7XG4gICAgICBwcmVmaXg6ICdmb3JlYWNoJyxcbiAgICAgIGJvZHk6IFtcbiAgICAgICAgJyR7MTpvYmplY3R9JyxcbiAgICAgICAgJzwlICcsXG4gICAgICAgICcgIC8vWyBcXCdrZXlcXCcgXFwndmFsdWVcXCcgXSBTVE9SRSAvLyBvYmplY3QgaXMgYSBtYXAnLFxuICAgICAgICAnICAvL1sgXFwndmFsdWVcXCcgXSBTVE9SRSAvLyBvYmplY3QgaXMgYSBsaXN0JyxcbiAgICAgICAgJyAgJHsyOmFjdGlvbn0nLFxuICAgICAgICAnJT4nLFxuICAgICAgICAnRk9SRUFDSCdcbiAgICAgIF0sXG4gICAgICBkZXNjcmlwdGlvbjogJ0ZvcmVhY2ggbG9vcCdcbiAgICB9LFxuICAgIGZvcnN0ZXA6IHtcbiAgICAgIHByZWZpeDogJ2ZvcnN0ZXAnLFxuICAgICAgYm9keTogW1xuICAgICAgICAnJHsxOmluaXRpYWxfdmFsdWV9ICR7MjpmaW5hbF92YWx1ZX0gPCUgJHszOjEgK30gJT4nLFxuICAgICAgICAnPCUgJHs0OmFjdGlvbn0gJT4nLFxuICAgICAgICAnRk9SU1RFUCdcbiAgICAgIF0sXG4gICAgICBkZXNjcmlwdGlvbjogJ0ZvcnN0ZXAgbG9vcCdcbiAgICB9LFxuICAgIHNobToge1xuICAgICAgcHJlZml4OiAnc2htJyxcbiAgICAgIGJvZHk6IFtcbiAgICAgICAgJzwlJyxcbiAgICAgICAgJyAgPCUnLFxuICAgICAgICAnICAgIC8vdHJ5IHRvIHJlYWQgZGF0YSBmcm9tIFNIYXJlZCBNZW1vcnknLFxuICAgICAgICAnICAgIFxcJ2d0c0xpc3RcXCcgU0hNTE9BRCBEUk9QJyxcbiAgICAgICAgJyAgJT4nLFxuICAgICAgICAnICA8JScsXG4gICAgICAgICcgICAgLy93aGVuIG5vdCBmb3VuZCwgc3RvcmUgZGF0YSBpbiBTSE0nLFxuICAgICAgICAnICAgICR7MTpbIFxcXFwkdG9rZW4gXFwnY2xhc3NuYW1lXFwnIHtcXFxcfSBOT1cgMzY1IGQgXSBGRVRDSH0gXFwnZ3RzTGlzdFxcJyBTSE1TVE9SRScsXG4gICAgICAgICcgICU+JyxcbiAgICAgICAgJyAgPCUnLFxuICAgICAgICAnICAgIC8vZmluYWxseSwgbG9hZCB0aGUgcmVmZXJlbmNlIGZyb20gU0hNIGFuZCBzdG9yZSBpdCAnLFxuICAgICAgICAnICAgIFxcJ2d0c0xpc3RcXCcgU0hNTE9BRCBcXCdndHNMaXN0XFwnIFNUT1JFJyxcbiAgICAgICAgJyAgJT4gVFJZJyxcbiAgICAgICAgJycsXG4gICAgICAgICcgIC8vYW5hbHl0aWNzIG9uIFxcXFwkZ3RzTGlzdCcsXG4gICAgICAgICcgICR7MjpcXFxcJGd0c0xpc3R9JyxcbiAgICAgICAgJycsXG4gICAgICAgICcnLFxuICAgICAgICAnJyxcbiAgICAgICAgJyU+IFxcJ215TXV0ZXhcXCcgTVVURVggLy9wcmV2ZW50IGEgY29uY3VycmVudCBleGVjdXRpb24gb24gdGhlIHNhbWUgU0hNIGRhdGEnXG4gICAgICBdLFxuICAgICAgZGVzY3JpcHRpb246ICdLZWVwIGZldGNoZWQgZGF0YSBpbiBSQU0uIFlvdSBuZWVkIHRvIGVuYWJsZSB0aGUgU0hNIGV4dGVuc2lvbi4nXG4gICAgfVxuICB9O1xufVxuIl19