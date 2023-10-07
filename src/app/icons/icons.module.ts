import { NgModule } from '@angular/core';

import { FeatherModule } from 'angular-feather';
import {HelpCircle, Mail,Trash2,LogOut, ArrowLeft , Server,AlertCircle, Clock, X, Code, Info,RefreshCw, Database, Download, File, Grid, Activity, GitCommit, Plus, Sliders, Zap, ChevronDown, ChevronUp, Send, Truck } from 'angular-feather/icons';

// Select some icons (use an object, not an array)
const icons = {
    Server,
    Clock,
    X,
    Code,
    Database,
    Download,
    File,
    Grid,
    Activity,
    GitCommit,
    Plus,
    Sliders,
    Zap,
    ChevronDown,
    ChevronUp,
    Send,
    Info,
    RefreshCw,
    AlertCircle,
    ArrowLeft,
    LogOut,
    Trash2,
    Mail,
    HelpCircle
};

@NgModule({
    imports: [
        FeatherModule.pick(icons)
    ],
    exports: [
        FeatherModule
    ]
})
export class IconsModule { }