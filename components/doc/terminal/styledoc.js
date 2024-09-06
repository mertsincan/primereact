import { DocSectionText } from '@/components/doc/common/docsectiontext';
import Link from 'next/link';

export function StyleDoc() {
    return (
        <>
            <DocSectionText id="style" label="Style">
                <p>
                    Following is the list of structural style classes, for theming classes visit{' '}
                    <Link legacyBehavior href="/theming">
                        theming
                    </Link>{' '}
                    page.
                </p>
            </DocSectionText>
            <div className="doc-tablewrapper">
                <table className="doc-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Element</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>p-terminal</td>
                            <td>Container element.</td>
                        </tr>
                        <tr>
                            <td>p-terminal-content</td>
                            <td>Content of terminal.</td>
                        </tr>
                        <tr>
                            <td>p-terminal-prompt</td>
                            <td>Prompt text.</td>
                        </tr>
                        <tr>
                            <td>p-terminal-response</td>
                            <td>Command response.</td>
                        </tr>
                        <tr>
                            <td>p-terminal-input</td>
                            <td>Input element to enter commands.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}
