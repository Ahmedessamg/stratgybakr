import { useTranslation } from 'react-i18next';
import { FileText, Upload, X } from 'lucide-react';
import { Control, FieldValues, Path, Controller } from 'react-hook-form';
import { CardContent, Input, Textarea } from '../../../components/ui';
import { StrategicPlanAttachment } from '../../../services/supabase/strategicPlan/strategicPlan.service';
import './PlanInfoCard.scss';

interface PlanInfoCardProps<T extends FieldValues = FieldValues> {
  control: Control<T>;
  alwaysOpen?: boolean;
  hideToggle?: boolean;
}

const PlanInfoCard = <T extends FieldValues = FieldValues>({ control, alwaysOpen, hideToggle }: PlanInfoCardProps<T>) => {
  const { t } = useTranslation();

  const handleFileChange = (files: FileList | null, onChange: (value: (File | StrategicPlanAttachment)[]) => void, currentAttachments: (File | StrategicPlanAttachment)[]) => {
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      onChange([...currentAttachments, ...newFiles]);
    }
  };

  const handleRemoveAttachment = (index: number, onChange: (value: (File | StrategicPlanAttachment)[]) => void, onDeleteChange: (value: string[]) => void, currentAttachments: (File | StrategicPlanAttachment)[], currentAttachmentsToDelete: string[]) => {
    const attachment = currentAttachments[index];
    
    // If it's an existing attachment (has id), add to delete list
    if ('id' in attachment) {
      onDeleteChange([...currentAttachmentsToDelete, attachment.id]);
    }
    
    // Remove from attachments array
    const newAttachments = currentAttachments.filter((_, i) => i !== index);
    onChange(newAttachments);
  };

  return (
        <CardContent
          title={t('strategicPlan.form.planData')}
          subtitle={t('strategicPlan.form.planDataCaption')}
          icon={<FileText />}
          defaultOpen={true}
          alwaysOpen={alwaysOpen}
          hideToggle={hideToggle}
        >
      <div className="space-y-2">
        <Input
          name={"name" as Path<T>}
          control={control}
          label={t('strategicPlan.form.planName')}
          placeholder={t('strategicPlan.form.planNamePlaceholder')}
          required
          rules={{ required: t('validation.required') }}
        />

        <Textarea
          name={"description" as Path<T>}
          control={control}
          label={t('strategicPlan.form.description')}
          placeholder={t('strategicPlan.form.descriptionPlaceholder')}
          rows={4}
        />

            <div className="plan-attachments">
              <label className="plan-attachments__label">
                {t('strategicPlan.form.attachments')}
              </label>
              
              <Controller
                name={"attachments" as Path<T>}
                control={control}
                defaultValue={[] as any}
                render={({ field: { value: attachments, onChange } }) => (
                  <Controller
                    name={"attachmentsToDelete" as Path<T>}
                    control={control}
                    defaultValue={[] as any}
                    render={({ field: { value: attachmentsToDelete, onChange: onDeleteChange } }) => (
                      <div>
                        {/* File Upload Area */}
                        <div className="plan-attachments__upload">
                          <input
                            type="file"
                            id="plan-file-upload"
                            className="plan-attachments__input"
                            onChange={(e) => handleFileChange(e.target.files, onChange, attachments)}
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
                            multiple
                          />
                          <label htmlFor="plan-file-upload" className="plan-attachments__button">
                            <Upload size={20} className="plan-attachments__icon" />
                            <span className="plan-attachments__text">
                              {t('strategicPlan.form.chooseFile')}
                            </span>
                          </label>
                        </div>

                        {/* Display Attachments */}
                        {attachments && attachments.length > 0 && (
                          <div className="plan-attachments__list">
                            {attachments.map((attachment: File | StrategicPlanAttachment, index: number) => (
                              <div key={index} className="plan-attachments__item">
                                <span className="plan-attachments__item-name">
                                  {'name' in attachment ? attachment.name : attachment.file_name}
                                </span>
                                <button
                                  type="button"
                                  className="plan-attachments__remove-btn"
                                  onClick={() => handleRemoveAttachment(index, onChange, onDeleteChange, attachments, attachmentsToDelete)}
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  />
                )}
              />
            </div>
      </div>
    </CardContent>
  );
};

export default PlanInfoCard;

