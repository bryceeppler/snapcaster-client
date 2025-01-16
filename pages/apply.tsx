import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle } from "lucide-react"

const formSchema = z.object({
  ownerName: z.string().min(2, "Store owner name is required"),
  storeName: z.string().min(2, "Store name is required"),
  storeUrl: z.string().url("Please enter a valid URL"),
  email: z.string().email("Please enter a valid email address"),
  address: z.string().min(10, "Please enter a complete address"),
  inventorySystem: z.string(),
  otherInventorySystem: z.string().optional(),
  tcgs: z.array(z.string()).min(1, "Please select at least one TCG"),
  questions: z.string(),
})

const tcgOptions = [
  { id: "mtg", label: "Magic: The Gathering" },
  { id: "pokemon", label: "Pokemon" },
  { id: "yugioh", label: "Yugioh" },
  { id: "lorcana", label: "Lorcana" },
  { id: "onepiece", label: "One Piece" },
]

const inventorySystemOptions = [
  { id: "binderpos", label: "Binder POS" },
  { id: "storepass", label: "StorePass" },
  { id: "crystalcommerce", label: "Crystal Commerce" },
  { id: "other", label: "Other" },
];

export default function StoreRegistrationForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tcgs: [],
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    fetch("/api/apply", {
      method: "POST",
      body: JSON.stringify(values),
    });
  }

  return (
    <div className="container max-w-2xl py-10">
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Add your store to Snapcaster</CardTitle>
          <CardDescription className="text-center">
            Thanks for considering adding your store to Snapcaster! We are always looking to expand and
            include more local game stores and smaller businesses in our database. <span className="font-bold">Adding your store to Snapcaster is completely free!</span> 
          </CardDescription>
          <CardDescription className="text-center">
            Please fill out this form to get started, and we will be in touch!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="ownerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store Owner Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Store Owner Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="storeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Store Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="storeUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store Address (Street, City, Postal Code)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter your complete store address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="inventorySystem"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inventory Management System</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="What system do you use to manage inventory?" />
                        </SelectTrigger>
                        <SelectContent>
                          {inventorySystemOptions.map((option) => (
                            <SelectItem key={option.id} value={option.id}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.watch("inventorySystem") === "other" && (
                <FormField
                  control={form.control}
                  name="otherInventorySystem"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other Inventory System</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter your inventory system" {...field} />
                      </FormControl>
                      <FormMessage />
                      <div className="flex flex-row gap-2 text-sm justify-center border border-red-500 rounded-md p-2 bg-red-50 text-red-500">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                        We cannot guarantee that your inventory system will be supported, but we will do our best to make it work. Please provide as much information as possible.
                      </div>
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="tcgs"
                render={() => (
                  <FormItem>
                    <FormLabel>What TCGs do you sell?</FormLabel>
                    <div className="grid grid-cols-2 gap-4">
                      {tcgOptions.map((tcg) => (
                        <FormField
                          key={tcg.id}
                          control={form.control}
                          name="tcgs"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={tcg.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(tcg.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, tcg.id])
                                        : field.onChange(
                                            field.value?.filter((value) => value !== tcg.id)
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{tcg.label}</FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="questions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Questions?</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Any questions or additional information?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <p className="text-center text-sm text-muted-foreground">
                  If you need any additional information, feel free to email us at info@snapcaster.gg
                </p>
                <div className="flex justify-center">
                  <Button type="submit">Submit</Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

