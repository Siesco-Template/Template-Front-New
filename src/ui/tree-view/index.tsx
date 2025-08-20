import type { SVGProps } from 'react';
import { FC } from 'react';

import { TreeCollection, TreeView, UseTreeViewReturn } from '@ark-ui/react/tree-view';

import './tree-view.css';

export interface I_TreeNode {
    id: string;
    name: string;
    icon?: FC<SVGProps<SVGSVGElement>>;
    children?: I_TreeNode[];
}
export const flattenTree = (root: I_TreeNode): I_TreeNode[] => {
    const result: I_TreeNode[] = [];
    const stack: I_TreeNode[] = [root];

    while (stack.length > 0) {
        const node = stack.pop()!;
        result.push(node);

        if (node.children) {
            for (let i = node.children.length - 1; i >= 0; i--) {
                stack.push(node.children[i]);
            }
        }
    }

    return result;
};

interface I_TreeProps {
    className?: string;
    label?: string;
    treeView: UseTreeViewReturn<I_TreeNode>;
    collection: TreeCollection<I_TreeNode>;
    onClickItem?: (node: I_TreeNode) => void;
    selectedValue?: string[];
}

export const S_Tree = ({ className, label, treeView, collection, onClickItem }: I_TreeProps) => {
    return (
        <TreeView.RootProvider value={treeView} className={className}>
            {label && <TreeView.Label>{label}</TreeView.Label>}
            <TreeView.Tree>
                {collection.rootNode.children?.map((node, index) => (
                    <TreeNode key={node.id} node={node} indexPath={[index]} onClickItem={onClickItem} />
                ))}
            </TreeView.Tree>
        </TreeView.RootProvider>
    );
};

const TreeNode = (props: TreeView.NodeProviderProps<I_TreeNode> & Pick<I_TreeProps, 'onClickItem'>) => {
    const { node, indexPath } = props;
    return (
        <TreeView.NodeProvider key={node.id} node={node} indexPath={indexPath}>
            {node.children ? (
                <TreeView.Branch>
                    <TreeView.BranchControl>
                        <TreeView.BranchText>
                            {node?.icon && <node.icon width={20} height={20} />}
                            {node.name}
                        </TreeView.BranchText>
                        {/* <TreeView.BranchIndicator>
							<DirectionDownIcon width={20} height={20}/>
						</TreeView.BranchIndicator> */}
                    </TreeView.BranchControl>
                    <TreeView.BranchContent>
                        <TreeView.BranchIndentGuide />
                        {node.children.map((child, index) => (
                            <TreeNode key={child.id} node={child} indexPath={[...indexPath, index]} />
                        ))}
                    </TreeView.BranchContent>
                </TreeView.Branch>
            ) : (
                <TreeView.Item
                    onClick={() => props?.onClickItem && props?.onClickItem({ id: node.id, name: node.name })}
                >
                    <TreeView.ItemText>
                        {node?.icon && <node.icon width={20} height={20} />}
                        {node.name}
                    </TreeView.ItemText>
                </TreeView.Item>
            )}
        </TreeView.NodeProvider>
    );
};
