/*
 *  Copyright 2020  SenX S.A.S.
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
 *
 */

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GettingStartedComponent} from './demo/getting-started/getting-started.component';
import {MainDemoComponent} from './demo/main-demo/main-demo.component';
import {SmallTestsComponent} from './demo/small-tests/small-tests.component';

const routes: Routes = [

  {path: 'getting-started', component: GettingStartedComponent},
  {path: 'demo/:component', component: MainDemoComponent},
  {path: 'small', component: SmallTestsComponent},
  {
    path: '',
    redirectTo: '/getting-started',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,
    {
      anchorScrolling: 'enabled'
    }
  )],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
