import { Button, Group, type MantineColor, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { type Icon, IconCancel } from '@tabler/icons-react';
import { usePrompts } from './PromptsProvider';

export const ArchivateRestoreDelete = ({
  type,
  label,
  icon: Icon,
  color,
}: {
  type: 'archivate' | 'restore' | 'delete';
  label: string;
  icon: Icon;
  color?: MantineColor;
}) => {
  const { prompts, updatePrompts, deletePrompts, selectedIds, setSelectedIds } =
    usePrompts();
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Button
        size="xs"
        variant="light"
        color={color}
        leftSection={<Icon size={16} />}
        disabled={!selectedIds.length}
        rightSection={selectedIds.length > 0 ? selectedIds.length : null}
        onClick={open}
      >
        {label}
      </Button>

      <Modal opened={opened} onClose={close} centered withCloseButton={false}>
        <Group>
          <Text>Уверены?</Text>

          <Button
            ml="auto"
            size="xs"
            variant="light"
            leftSection={<IconCancel size={16} />}
            onClick={close}
          >
            Отмена
          </Button>

          <Button
            size="xs"
            color={color}
            leftSection={<Icon size={16} />}
            rightSection={selectedIds.length}
            onClick={() => {
              const selected = prompts.filter((i) =>
                selectedIds.includes(i.id),
              );

              switch (type) {
                case 'archivate':
                  {
                    updatePrompts(
                      selected.map((i) => ({
                        id: i.id,
                        archived: true,
                        enabled: false,
                      })),
                    );
                    notifications.show({
                      message:
                        selected.length === 1
                          ? `Промт выключен и отпрален в архив`
                          : `Промты выключены и отпралены в архив`,
                      color: 'green',
                    });
                  }
                  break;
                case 'restore':
                  {
                    updatePrompts(
                      selected.map((i) => ({ id: i.id, archived: false })),
                    );
                    notifications.show({
                      message:
                        selected.length === 1
                          ? `Промт восстановлен`
                          : `Промты восстановлены`,
                      color: 'green',
                    });
                  }
                  break;
                case 'delete':
                  {
                    deletePrompts(selectedIds);
                    notifications.show({
                      message:
                        selected.length === 1
                          ? `Промт удален`
                          : `Промты удалены`,
                      color: 'green',
                    });
                  }
                  break;
              }
              setSelectedIds([]);
              close();
            }}
          >
            {label}
          </Button>
        </Group>
      </Modal>
    </>
  );
};
