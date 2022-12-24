import { useModals } from '@mantine/modals';
import { TablerIcon } from '@tabler/icons';
import { useTranslation } from 'next-i18next';
import { useConfigContext } from '../../../../../../config/provider';
import { useConfigStore } from '../../../../../../config/store';
import { IWidget, IWidgetDefinition } from '../../../../../../widgets/widgets';
import { useEditModeStore } from '../../../../Views/useEditModeStore';
import { GenericAvailableElementType } from '../Shared/GenericElementType';

interface WidgetElementTypeProps {
  id: string;
  image: string | TablerIcon;
  disabled?: boolean;
  widget: IWidgetDefinition;
}

export const WidgetElementType = ({ id, image, disabled, widget }: WidgetElementTypeProps) => {
  const { closeModal } = useModals();
  const { t } = useTranslation(`modules/${id}`);
  const { name: configName, config } = useConfigContext();
  const updateConfig = useConfigStore((x) => x.updateConfig);
  const isEditMode = useEditModeStore((x) => x.enabled);

  if (!configName) return null;

  const getLowestWrapper = () => config?.wrappers.sort((a, b) => a.position - b.position)[0];

  const handleAddition = async () => {
    updateConfig(
      configName,
      (prev) => ({
        ...prev,
        widgets: [
          ...prev.widgets.filter((w) => w.id !== widget.id),
          {
            id: widget.id,
            properties: Object.entries(widget.options).reduce((prev, [k, v]) => {
              const newPrev = prev;
              newPrev[k] = v.defaultValue;
              return newPrev;
            }, {} as IWidget<string, any>['properties']),
            area: {
              type: 'wrapper',
              properties: {
                id: getLowestWrapper()?.id ?? '',
              },
            },
            shape: {
              location: {
                x: 0,
                y: 0,
              },
              size: {
                width: widget.gridstack.minWidth,
                height: widget.gridstack.minHeight,
              },
            },
          },
        ],
      }),
      true,
      !isEditMode
    );

    closeModal('selectElement');
  };

  return (
    <GenericAvailableElementType
      name={t('descriptor.name')}
      description={t('descriptor.description')}
      image={image}
      disabled={disabled}
      handleAddition={handleAddition}
    />
  );
};
