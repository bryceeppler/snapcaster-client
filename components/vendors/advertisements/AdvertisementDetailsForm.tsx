import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Save, Link as LinkIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import type {
  AdvertisementWithImages} from '@/types/advertisements';
import {
  AdvertisementPosition
} from '@/types/advertisements';


// Form schema for advertisement validation
const advertisementFormSchema = z.object({
  target_url: z.string().url({
    message: 'Please enter a valid URL. (e.g. https://snapcaster.ca)'
  }),
  position: z.nativeEnum(AdvertisementPosition),
  alt_text: z.string().min(3, {
    message: 'Alt text must be at least 3 characters.'
  }),
  start_date: z.date(),
  end_date: z.date().nullable().optional()
});

export type AdvertisementFormValues = z.infer<typeof advertisementFormSchema>;

interface AdvertisementDetailsFormProps {
  advertisement: AdvertisementWithImages;
  isActive: boolean;
  onSubmit: (values: AdvertisementFormValues) => Promise<void>;
  isPending: boolean;
}

export function AdvertisementDetailsForm({
  advertisement,
  isActive,
  onSubmit,
  isPending
}: AdvertisementDetailsFormProps) {
  const [formHasChanges, setFormHasChanges] = useState(false);

  const form = useForm<AdvertisementFormValues>({
    resolver: zodResolver(advertisementFormSchema),
    defaultValues: {
      target_url: advertisement.target_url,
      position: advertisement.position,
      alt_text: advertisement.alt_text,
      start_date: new Date(advertisement.start_date),
      end_date: advertisement.end_date ? new Date(advertisement.end_date) : null
    }
  });

  // Watch all the form values to detect changes
  const formValues = form.watch();

  // This effect runs when form values change to detect if the form has been modified
  useEffect(() => {
    // Check if basic text/select fields have changed
    const urlChanged = formValues.target_url !== advertisement.target_url;
    const positionChanged = formValues.position !== advertisement.position;
    const altTextChanged = formValues.alt_text !== advertisement.alt_text;

    // For date fields, we need to compare the date strings
    const formStartDate = formValues.start_date
      ? format(formValues.start_date, 'yyyy-MM-dd')
      : null;
    const adStartDate = advertisement.start_date
      ? format(new Date(advertisement.start_date), 'yyyy-MM-dd')
      : null;
    const startDateChanged = formStartDate !== adStartDate;

    const formEndDate = formValues.end_date
      ? format(formValues.end_date, 'yyyy-MM-dd')
      : null;
    const adEndDate = advertisement.end_date
      ? format(new Date(advertisement.end_date), 'yyyy-MM-dd')
      : null;
    const endDateChanged = formEndDate !== adEndDate;

    // Update the state based on whether any fields have changed
    setFormHasChanges(
      urlChanged ||
        positionChanged ||
        altTextChanged ||
        startDateChanged ||
        endDateChanged
    );
  }, [formValues, advertisement]);

  return (
    <Card className="overflow-hidden border-0 shadow-sm">
      <CardHeader className="border-b bg-muted/20 p-4 md:px-5">
        <div className="flex items-center gap-1.5">
          <div
            className={`h-1.5 w-1.5 rounded-full ${
              isActive ? 'bg-green-500' : 'bg-gray-300'
            }`}
          />
          <CardTitle className="text-sm font-medium md:text-base">
            Details
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4 md:p-5">
        <form
          id="edit-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label
              htmlFor="target_url"
              className="text-xs font-medium md:text-sm"
            >
              Target URL
            </Label>
            <p className="text-xs text-muted-foreground">
              The URL where users will be directed when they click on the
              advertisement.
            </p>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
                <LinkIcon className="h-3 w-3 text-muted-foreground" />
              </div>
              <Input
                id="target_url"
                placeholder="https://example.com"
                className="h-8 pl-8 text-xs md:h-9 md:text-sm"
                {...form.register('target_url')}
              />
            </div>
            {form.formState.errors.target_url && (
              <p className="text-xs font-medium text-destructive">
                {form.formState.errors.target_url.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="position"
              className="text-xs font-medium md:text-sm"
            >
              Position
            </Label>
            <p className="text-xs text-muted-foreground">
              {advertisement.position === AdvertisementPosition.TOP_BANNER
                ? 'Top banner ads appear fixed on the top of the page on desktop and mobile devices. You can upload multiple images for a banner ad. We recommend having a mobile and desktop image.'
                : advertisement.position === AdvertisementPosition.LEFT_BANNER
                ? 'Side banner ads appear fixed on the left side of the page on desktop devices. You can upload multiple images for a banner ad.'
                : advertisement.position === AdvertisementPosition.RIGHT_BANNER
                ? 'Side banner ads appear fixed on the right side of the page on desktop devices. You can upload multiple images for a banner ad.'
                : advertisement.position === AdvertisementPosition.FEED
                ? 'Feed ads appear within the search results. You can upload multiple images for a feed ad.'
                : 'Unknown'}
            </p>
            <Controller
              control={form.control}
              name="position"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={advertisement.position}
                  disabled
                >
                  <SelectTrigger className="h-8 text-xs md:h-9 md:text-sm">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(AdvertisementPosition).map((pos) => (
                      <SelectItem
                        key={pos}
                        value={pos}
                        className="text-xs md:text-sm"
                      >
                        {pos.replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {form.formState.errors.position && (
              <p className="text-xs font-medium text-destructive">
                {form.formState.errors.position.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="alt_text"
              className="text-xs font-medium md:text-sm"
            >
              Alt Text
            </Label>
            <p className="text-xs text-muted-foreground">
              Alt text is used to describe the advertisement to visually
              impaired users, and is used as a fallback for images that are not
              loaded.
            </p>
            <Input
              id="alt_text"
              placeholder="Brief description of the advertisement"
              className="h-8 text-xs md:h-9 md:text-sm"
              {...form.register('alt_text')}
            />
            {form.formState.errors.alt_text && (
              <p className="text-xs font-medium text-destructive">
                {form.formState.errors.alt_text.message}
              </p>
            )}
          </div>

          {/* <div className="space-y-3 pt-2">
            <div className="flex items-center gap-1.5">
              <CalendarIcon className="h-3 w-3 text-muted-foreground" />
              <p className="text-xs font-medium md:text-sm">Schedule</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Set the start and end dates for the advertisement. This is useful
              if you have a specific time frame for when the advertisement
              should be displayed.
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="start_date" className="text-xs md:text-sm">
                  Start Date
                </Label>
                <Controller
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="start_date"
                          variant="outline"
                          className={`h-8 w-full justify-start text-left text-xs md:h-9 md:text-sm ${
                            !field.value ? 'text-muted-foreground' : ''
                          }`}
                        >
                          <CalendarIcon className="mr-1.5 h-3 w-3 md:h-3.5 md:w-3.5" />
                          {field.value ? (
                            format(field.value, 'PP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="end_date" className="text-xs md:text-sm">
                  End Date{' '}
                  <span className="font-normal text-muted-foreground">
                    (Optional)
                  </span>
                </Label>
                <Controller
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="end_date"
                          variant="outline"
                          className={`h-8 w-full justify-start text-left text-xs md:h-9 md:text-sm ${
                            !field.value ? 'text-muted-foreground' : ''
                          }`}
                        >
                          <CalendarIcon className="mr-1.5 h-3 w-3 md:h-3.5 md:w-3.5" />
                          {field.value ? (
                            format(field.value, 'PP')
                          ) : (
                            <span>No end date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          initialFocus
                          disabled={(date) =>
                            date < (form.getValues().start_date || new Date())
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
              </div>
            </div>
          </div> */}

          <div className="pt-2">
            <Button
              type="submit"
              form="edit-form"
              disabled={
                isPending || form.formState.isSubmitting || !formHasChanges
              }
              className={`h-8 w-full text-xs sm:w-auto md:h-9 md:text-sm ${
                !formHasChanges ? 'cursor-not-allowed opacity-50' : ''
              }`}
            >
              <Save className="mr-1.5 h-3 w-3 md:h-3.5 md:w-3.5" />
              {isPending
                ? 'Saving...'
                : formHasChanges
                ? 'Save Changes'
                : 'No Changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
