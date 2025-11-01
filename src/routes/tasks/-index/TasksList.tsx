import { Grid, Paper, Text } from '@mantine/core';
import { Link } from '@tanstack/react-router';
import classes from '../../styles.module.css';
import { useTasks } from './TasksProvider';

export const TasksList = () => {
  const { tasks } = useTasks();

  return tasks.map((task) => (
    <Link
      key={task.id}
      to="/tasks/$taskId"
      params={{ taskId: task.id }}
      preload="intent"
      reloadDocument={true}
      className={classes.routerLink}
    >
      <Paper radius="md" withBorder className={classes.hoverPaper}>
        <Grid px="md" py="xs" align="center">
          <Grid.Col span="auto">
            <Text lh={1}>{task.title}</Text>
          </Grid.Col>
        </Grid>
      </Paper>
    </Link>
  ));
};
