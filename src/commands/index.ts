import { ban } from './ban';
import { debate } from './debate';
import { jail } from './jail';
import { ping } from './ping';
import { purge } from './purge';
import { tag } from './tag';
import { tagEdit } from './tag-edit';
import { tagList } from './tag-list';
import { unban } from './unban';
import { unjail } from './unjail';
import { unwarn } from './unwarn';
import { warn } from './warn';
import { warnList } from './warn-list';

export const commands = [
    ping,
    ban,
    unban,
    purge,
    jail,
    unjail,
    warn,
    warnList,
    tagEdit,
    tag,
    tagList,
    unwarn,
    debate
] as const;
