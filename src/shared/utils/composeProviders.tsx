import { ReactElement, ReactNode } from 'react';

type Provider = ({ children }: { children: ReactNode }) => ReactElement | null;

export default function composeProviders(providers: Provider[]) {
    return function ComposedProviders({ children }: { children: ReactNode }): ReactElement | null {
        return providers.reduceRight((acc, Provider) => <Provider>{acc}</Provider>, children as ReactElement);
    };
}
