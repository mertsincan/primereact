import { DocSectionCode } from '@/components/doc/common/docsectioncode';
import { DocSectionText } from '@/components/doc/common/docsectiontext';
import { SplitButton } from '@/components/lib/splitbutton/SplitButton';
import { useRouter } from 'next/router';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';

export function RoundedDoc(props) {
    const router = useRouter();
    const toast = useRef(null);
    const items = [
        {
            label: 'Update',
            icon: 'pi pi-refresh',
            command: () => {
                toast.current.show({ severity: 'success', summary: 'Updated', detail: 'Data Updated' });
            }
        },
        {
            label: 'Delete',
            icon: 'pi pi-times',
            command: () => {
                toast.current.show({ severity: 'warn', summary: 'Delete', detail: 'Data Deleted' });
            }
        },
        {
            label: 'React Website',
            icon: 'pi pi-external-link',
            command: () => {
                window.location.href = 'https://reactjs.org/';
            }
        },
        {
            label: 'Upload',
            icon: 'pi pi-upload',
            command: () => {
                router.push('/fileupload');
            }
        }
    ];

    const save = () => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Data Saved' });
    };

    const code = {
        basic: `
<Toast ref={toast}></Toast>
<SplitButton label="Save" icon="pi pi-plus" onClick={save} model={items} rounded />
<SplitButton label="Save" icon="pi pi-plus" onClick={save} model={items} severity="secondary" rounded />
<SplitButton label="Save" icon="pi pi-plus" onClick={save} model={items} severity="success" rounded />
<SplitButton label="Save" icon="pi pi-plus" onClick={save} model={items} severity="info" rounded />
<SplitButton label="Save" icon="pi pi-plus" onClick={save} model={items} severity="warning" rounded />
<SplitButton label="Save" icon="pi pi-plus" onClick={save} model={items} severity="help" rounded />
<SplitButton label="Save" icon="pi pi-plus" onClick={save} model={items} severity="danger" rounded />
<SplitButton label="Save" icon="pi pi-plus" onClick={save} model={items} severity="contrast" rounded />
        `,
        javascript: `
import React, { useRef } from 'react';
//import { useRouter } from 'next/router';
import { SplitButton } from 'primereact/splitbutton';
import { Toast } from 'primereact/toast';

export default function RoundedDemo() {
    //const router = useRouter();
    const toast = useRef(null);
    const items = [
        {
            label: 'Update',
            icon: 'pi pi-refresh',
            command: () => {
                toast.current.show({ severity: 'success', summary: 'Updated', detail: 'Data Updated' });
            }
        },
        {
            label: 'Delete',
            icon: 'pi pi-times',
            command: () => {
                toast.current.show({ severity: 'warn', summary: 'Delete', detail: 'Data Deleted' });
            }
        },
        {
            label: 'React Website',
            icon: 'pi pi-external-link',
            command: () => {
                window.location.href = 'https://reactjs.org/';
            }
        },
        {
            label: 'Upload',
            icon: 'pi pi-upload',
            command: () => {
                //router.push('/fileupload');
            }
        }
    ];

    const save = () => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Data Saved' });
    };

    return (
        <div className="card flex justify-center">
            <Toast ref={toast}></Toast>
            <SplitButton label="Save" icon="pi pi-plus" onClick={save} model={items} rounded />
            <SplitButton label="Save" icon="pi pi-plus" onClick={save} model={items} severity="secondary" rounded />
            <SplitButton label="Save" icon="pi pi-plus" onClick={save} model={items} severity="success" rounded />
            <SplitButton label="Save" icon="pi pi-plus" onClick={save} model={items} severity="info" rounded />
            <SplitButton label="Save" icon="pi pi-plus" onClick={save} model={items} severity="warning" rounded />
            <SplitButton label="Save" icon="pi pi-plus" onClick={save} model={items} severity="help" rounded />
            <SplitButton label="Save" icon="pi pi-plus" onClick={save} model={items} severity="danger" rounded />
            <SplitButton label="Save" icon="pi pi-plus" onClick={save} model={items} severity="contrast" rounded />
        </div>
    )
}
        `,
        typescript: `
import React, { useRef } from 'react';
//import { useRouter } from 'next/router';
import { SplitButton } from 'primereact/splitbutton';
import { MenuItem } from 'primereact/menuitem';
import { Toast } from 'primereact/toast';

export default function RoundedDemo() {
    //const router = useRouter();
    const toast = useRef<Toast>(null);
    const items: MenuItem[] = [
        {
            label: 'Update',
            icon: 'pi pi-refresh',
            command: () => {
                toast.current.show({ severity: 'success', summary: 'Updated', detail: 'Data Updated' });
            }
        },
        {
            label: 'Delete',
            icon: 'pi pi-times',
            command: () => {
                toast.current.show({ severity: 'warn', summary: 'Delete', detail: 'Data Deleted' });
            }
        },
        {
            label: 'React Website',
            icon: 'pi pi-external-link',
            command: () => {
                window.location.href = 'https://reactjs.org/';
            }
        },
        {
            label: 'Upload',
            icon: 'pi pi-upload',
            command: () => {
                //router.push('/fileupload');
            }
        }
    ];

    const save = () => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Data Saved' });
    };

    return (
        <div className="card flex justify-center">
            <Toast ref={toast}></Toast>
            <SplitButton label="Save" icon="pi pi-plus" onClick={save} model={items} rounded />
            <SplitButton label="Save" icon="pi pi-plus" onClick={save} model={items} severity="secondary" rounded />
            <SplitButton label="Save" icon="pi pi-plus" onClick={save} model={items} severity="success" rounded />
            <SplitButton label="Save" icon="pi pi-plus" onClick={save} model={items} severity="info" rounded />
            <SplitButton label="Save" icon="pi pi-plus" onClick={save} model={items} severity="warning" rounded />
            <SplitButton label="Save" icon="pi pi-plus" onClick={save} model={items} severity="help" rounded />
            <SplitButton label="Save" icon="pi pi-plus" onClick={save} model={items} severity="danger" rounded />
            <SplitButton label="Save" icon="pi pi-plus" onClick={save} model={items} severity="contrast" rounded />
        </div>
    )
}
        `
    };

    return (
        <>
            <DocSectionText {...props}>
                <p>Rounded buttons have a circular border radius.</p>
            </DocSectionText>
            <div className="card flex flex-wrap justify-center gap-4">
                <Toast ref={toast} />
                <SplitButton label="Save" icon="pi pi-plus" onClick={save} model={items} rounded />
                <SplitButton label="Save" icon="pi pi-plus" onClick={save} model={items} severity="secondary" rounded />
                <SplitButton label="Save" icon="pi pi-plus" onClick={save} model={items} severity="success" rounded />
                <SplitButton label="Save" icon="pi pi-plus" onClick={save} model={items} severity="info" rounded />
                <SplitButton label="Save" icon="pi pi-plus" onClick={save} model={items} severity="warning" rounded />
                <SplitButton label="Save" icon="pi pi-plus" onClick={save} model={items} severity="help" rounded />
                <SplitButton label="Save" icon="pi pi-plus" onClick={save} model={items} severity="danger" rounded />
                <SplitButton label="Save" icon="pi pi-plus" onClick={save} model={items} severity="contrast" rounded />
            </div>
            <DocSectionCode code={code} />
        </>
    );
}