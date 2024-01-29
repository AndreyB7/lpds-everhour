'use client'
import { EverhourTask } from "../../../../types/types";
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { Box, Flex, Text } from "@radix-ui/themes";
import { SxProps } from "@mui/system";

type Props = {
  data: EverhourTask[]
}

const content = (task: EverhourTask) => {
  return (
    <Flex gap={ '2' } justify={ 'between' }>
      <Box>
        <Text>{ task.name }</Text>
      </Box>
      <Flex gap={ '2' }>
        <Flex style={ { minWidth: "80px" } }>
          <Text>{task.status}</Text>
        </Flex>
        { task.groupTimeSum &&
          <Flex className={ 'time task-total' } justify={ "end" } align={ "center" }>
            <Text>{ task.groupTimeSum }</Text>
          </Flex> }
        <Flex className={ 'time task-time' } justify={ "end" } align={ "center" }>
          <Text>{ task.timeSum }</Text>
        </Flex>
      </Flex>
    </Flex>
  )
}

const renderTree = (data: EverhourTask[]): any => {
  return (<>
    { data.map(task => {
      return (
        <TreeItem key={ task.id } className={ task.children ? 'root' : 'child' } nodeId={ task.id }
                  label={ content(task) }>
          { task.children && renderTree(task.children) }
        </TreeItem>
      )
    }) }
  </>)
}

const treeStyles = [
  { '.MuiTreeItem-content': { borderBottom: '1px solid transparent', marginBottom: '5px' } },
  {
    '.MuiTreeItem-content:hover': {
      backgroundColor: 'transparent',
      opacity: '.75',
      borderBottom: '1px solid #faaf40',
    }
  },
  { '.MuiTreeItem-content.Mui-focused': { backgroundColor: 'transparent' } },
  { '.root .child .rt-Text': { fontSize: '85%' } },
  { '.time': { minWidth: '80px', width: '100%', textAlign: 'right' } },
  { '.root>.MuiTreeItem-content .task-time': { display: 'none' } },
  { '.root>.MuiTreeItem-content.Mui-expanded .task-time': { display: 'flex', fontSize: '85%' } },
  { '.root>.MuiTreeItem-content.Mui-expanded .task-total': { display: 'none' } },
  { '.MuiTreeItem-iconContainer': { alignSelf: 'start', lineHeight: '21px' } }
] as SxProps

const Tree = ({ data }: Props) => {
  return (
    <TreeView
      defaultCollapseIcon={ '-' }
      defaultExpandIcon={ '+' }
      disableSelection={ true }
      sx={ treeStyles }
    >
      { renderTree(data) }
    </TreeView>
  );
};

export default Tree;