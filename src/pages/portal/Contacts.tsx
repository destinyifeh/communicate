"use client";

import { ClientLayout } from "@/components/layouts/ClientLayout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Edit,
  Loader2,
  Mail,
  MessageSquare,
  MoreVertical,
  Phone,
  Plus,
  Search,
  Tag,
  Trash2,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contactService } from "@/services/contact.service";
import type { Contact } from "@/types/contact";

type ChannelFilter = "all" | "sms" | "whatsapp" | "email" | "voice";

const channelIcons: Record<string, React.ReactNode> = {
  sms: <MessageSquare className="h-3.5 w-3.5" />,
  whatsapp: <MessageSquare className="h-3.5 w-3.5" />,
  email: <Mail className="h-3.5 w-3.5" />,
  voice: <Phone className="h-3.5 w-3.5" />,
};

const channelColors: Record<string, string> = {
  sms: "bg-blue-500",
  whatsapp: "bg-green-500",
  email: "bg-cyan-500",
  voice: "bg-orange-500",
};

const channelLabels: Record<string, string> = {
  sms: "SMS",
  whatsapp: "WhatsApp",
  email: "Email",
  voice: "Voice",
};

const tagColors: Record<string, string> = {
  VIP: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  "Repeat Customer": "bg-green-500/10 text-green-600 dark:text-green-400",
  "New Lead": "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  Support: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  Escalated: "bg-red-500/10 text-red-600 dark:text-red-400",
  Business: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  Customer: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
  Purchased: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  "High Priority": "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  Partnership: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  Appointment: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  "Email Preferred": "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
};

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  notes: string;
  preferredChannel: string;
  tags: string;
}

const emptyFormData: ContactFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  notes: "",
  preferredChannel: "",
  tags: "",
};

export default function Contacts() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [channelFilter, setChannelFilter] = useState<ChannelFilter>("all");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>(emptyFormData);

  // Fetch contacts from API
  const { data: contactsResponse, isLoading } = useQuery({
    queryKey: ["contacts", searchQuery],
    queryFn: () => contactService.getContacts({ search: searchQuery || undefined }),
  });

  // Filter out auto-created contacts without names (e.g., from voice calls)
  const contacts = (contactsResponse?.data || []).filter((contact) => {
    // If contact has a name, always show it
    if (contact.firstName || contact.lastName) return true;
    // If contact was auto-created from voice without a name, hide it
    if (contact.source === 'voice') return false;
    // Show all other contacts
    return true;
  });

  // Create contact mutation
  const createMutation = useMutation({
    mutationFn: contactService.createContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      setShowAddDialog(false);
      setFormData(emptyFormData);
      toast.success("Contact added successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add contact");
    },
  });

  // Update contact mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      contactService.updateContact(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      setShowEditDialog(false);
      setSelectedContact(null);
      setFormData(emptyFormData);
      toast.success("Contact updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update contact");
    },
  });

  // Delete contact mutation
  const deleteMutation = useMutation({
    mutationFn: contactService.deleteContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      setShowDeleteDialog(false);
      setSelectedContact(null);
      toast.success("Contact deleted");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete contact");
    },
  });

  const filteredContacts = contacts.filter((contact) => {
    const matchesChannel =
      channelFilter === "all" || contact.source === channelFilter;
    return matchesChannel;
  });

  const totalContacts = contacts.length;
  const contactsWithEmail = contacts.filter((c) => c.email).length;
  const contactsThisMonth = contacts.filter((c) => {
    const createdDate = new Date(c.createdAt);
    const now = new Date();
    return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear();
  }).length;

  const handleAddContact = () => {
    if (!formData.phone) {
      toast.error("Phone number is required");
      return;
    }

    createMutation.mutate({
      firstName: formData.firstName || undefined,
      lastName: formData.lastName || undefined,
      email: formData.email || undefined,
      phone: formData.phone,
      tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()) : undefined,
      notes: formData.notes || undefined,
      source: "manual",
    });
  };

  const handleEditContact = () => {
    if (!selectedContact || !formData.phone) {
      toast.error("Phone number is required");
      return;
    }

    updateMutation.mutate({
      id: selectedContact.id,
      data: {
        firstName: formData.firstName || undefined,
        lastName: formData.lastName || undefined,
        email: formData.email || undefined,
        phone: formData.phone,
        tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()) : undefined,
        notes: formData.notes || undefined,
      },
    });
  };

  const handleDeleteContact = () => {
    if (!selectedContact) return;
    deleteMutation.mutate(selectedContact.id);
  };

  const openEditDialog = (contact: Contact) => {
    setSelectedContact(contact);
    setFormData({
      firstName: contact.firstName || "",
      lastName: contact.lastName || "",
      email: contact.email || "",
      phone: contact.phone,
      company: contact.company || "",
      notes: contact.notes || "",
      preferredChannel: contact.source || "",
      tags: (contact.tags || []).join(", "),
    });
    setShowEditDialog(true);
  };

  const openDeleteDialog = (contact: Contact) => {
    setSelectedContact(contact);
    setShowDeleteDialog(true);
  };

  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Contacts</h1>
            <p className="text-muted-foreground">Manage your contacts and leads</p>
          </div>
          <Button onClick={() => setShowAddDialog(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Contact
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Contacts</p>
                    <p className="text-3xl font-black">{totalContacts}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">With Email</p>
                    <p className="text-3xl font-black">{contactsWithEmail}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-cyan-500/10 flex items-center justify-center">
                    <Mail className="h-6 w-6 text-cyan-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Added This Month</p>
                    <p className="text-3xl font-black">{contactsThisMonth}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Plus className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
                {(["all", "sms", "whatsapp", "email", "voice"] as ChannelFilter[]).map(
                  (channel) => (
                    <Button
                      key={channel}
                      variant={channelFilter === channel ? "default" : "outline"}
                      size="sm"
                      onClick={() => setChannelFilter(channel)}
                      className="shrink-0"
                    >
                      {channel === "all" ? "All" : channelLabels[channel]}
                    </Button>
                  )
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contacts List */}
        <Card>
          <CardHeader>
            <CardTitle>All Contacts</CardTitle>
            <CardDescription>
              {filteredContacts.length} contact{filteredContacts.length !== 1 && "s"} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              {isLoading ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Loader2 className="h-12 w-12 mx-auto mb-3 animate-spin opacity-30" />
                  <p className="font-medium">Loading contacts...</p>
                </div>
              ) : filteredContacts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No contacts found</p>
                  <p className="text-sm">Try adjusting your search or filters</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredContacts.map((contact, index) => (
                    <motion.div
                      key={contact.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
                    >
                      <div className="relative shrink-0">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {contact.firstName?.[0] || contact.phone[0]}
                            {contact.lastName?.[0] || ""}
                          </AvatarFallback>
                        </Avatar>
                        {contact.source && (
                          <div
                            className={cn(
                              "absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full flex items-center justify-center text-white",
                              channelColors[contact.source] || "bg-gray-500"
                            )}
                          >
                            {channelIcons[contact.source] || <User className="h-3 w-3" />}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">
                            {contact.firstName || contact.lastName
                              ? `${contact.firstName || ""} ${contact.lastName || ""}`.trim()
                              : contact.phone}
                          </span>
                          {contact.company && (
                            <span className="text-sm text-muted-foreground hidden sm:inline">
                              - {contact.company}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {contact.phone}
                          </span>
                          {contact.email && (
                            <span className="flex items-center gap-1 hidden md:flex">
                              <Mail className="h-3 w-3" />
                              {contact.email}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 mt-2 flex-wrap">
                          {(contact.tags || []).slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className={cn("text-[10px] px-1.5 py-0", tagColors[tag] || "")}
                            >
                              {tag}
                            </Badge>
                          ))}
                          {(contact.tags || []).length > 3 && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                              +{(contact.tags || []).length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="text-right hidden sm:block">
                        <p className="text-xs text-muted-foreground">
                          Source: {contact.source || "unknown"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="shrink-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(contact)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/portal/inbox?phone=${encodeURIComponent(contact.phone)}`)}>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/portal/call-center?call=${encodeURIComponent(contact.phone)}`)}>
                            <Phone className="h-4 w-4 mr-2" />
                            Call
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => openDeleteDialog(contact)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </motion.div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Add Contact Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Add New Contact
              </DialogTitle>
              <DialogDescription>
                Add a new contact to your address book
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 555-0123"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Company Name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferredChannel">Preferred Channel</Label>
                <Select
                  value={formData.preferredChannel}
                  onValueChange={(value) => setFormData({ ...formData, preferredChannel: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select channel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="voice">Voice</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="VIP, Customer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Add any notes about this contact..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddContact} disabled={createMutation.isPending}>
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Contact"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Contact Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Edit Contact
              </DialogTitle>
              <DialogDescription>Update contact information</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editFirstName">First Name *</Label>
                  <Input
                    id="editFirstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editLastName">Last Name</Label>
                  <Input
                    id="editLastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editPhone">Phone Number *</Label>
                <Input
                  id="editPhone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editEmail">Email</Label>
                <Input
                  id="editEmail"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editCompany">Company</Label>
                <Input
                  id="editCompany"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editPreferredChannel">Preferred Channel</Label>
                <Select
                  value={formData.preferredChannel}
                  onValueChange={(value) => setFormData({ ...formData, preferredChannel: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select channel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="voice">Voice</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editTags">Tags (comma separated)</Label>
                <Input
                  id="editTags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editNotes">Notes</Label>
                <Textarea
                  id="editNotes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditContact} disabled={updateMutation.isPending}>
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Contact</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete{" "}
                <span className="font-semibold">
                  {selectedContact?.firstName || selectedContact?.phone} {selectedContact?.lastName || ""}
                </span>
                ? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteContact} disabled={deleteMutation.isPending}>
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ClientLayout>
  );
}
