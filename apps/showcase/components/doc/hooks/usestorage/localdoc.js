import { DocSectionCode } from '@/components/doc/common/docsectioncode';
import { DocSectionText } from '@/components/doc/common/docsectiontext';
import { useLocalStorage } from '@/components/lib/hooks/Hooks';
import { Button } from 'primereact/button';

export function LocalDoc(props) {
    const [count, setCount] = useLocalStorage(0, 'count');

    const code = {
        basic: `
const [count, setCount] = useLocalStorage(0, 'count');
        `,
        javascript: `
import React from 'react';
import { Button } from 'primereact/button';
import { useLocalStorage } from 'primereact/hooks';

export default function LocalDemo() {
    const [count, setCount] = useLocalStorage(0, 'count');

    return (
        <div className="card flex flex-col items-center">
            <span className="font-bold text-4xl mb-8">{count}</span>
            <div className="flex flex-wrap gap-4">
                <Button icon="pi pi-plus" className="p-button-outlined p-button-rounded p-button-success" onClick={() => setCount(count + 1)}></Button>
                <Button icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger" onClick={() => setCount(0)}></Button>
            </div>
        </div>
    )
}
        `,
        typescript: `
import React from 'react';
import { Button } from 'primereact/button';
import { useLocalStorage } from 'primereact/hooks';

export default function LocalDemo() {
    const [count, setCount] = useLocalStorage(0, 'count');

    return (
        <div className="card flex flex-col items-center">
            <span className="font-bold text-4xl mb-8">{count}</span>
            <div className="flex flex-wrap gap-4">
                <Button icon="pi pi-plus" className="p-button-outlined p-button-rounded p-button-success" onClick={() => setCount(count + 1)}></Button>
                <Button icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger" onClick={() => setCount(0)}></Button>
            </div>
        </div>
    )
}
        `
    };

    return (
        <>
            <DocSectionText {...props}>
                <p>Refresh to page to view the persisted value.</p>
            </DocSectionText>
            <div className="card flex flex-col items-center">
                <span className="font-bold text-4xl mb-8">{count}</span>
                <div className="flex flex-wrap gap-4">
                    <Button icon="pi pi-plus" className="p-button-outlined p-button-rounded p-button-success" onClick={() => setCount(count + 1)} />
                    <Button icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger" onClick={() => setCount(0)} />
                </div>
            </div>
            <DocSectionCode code={code} />
        </>
    );
}