import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { Field, FieldLabel } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { useCreateServer, useJoinServer } from '#/hooks/useServerQueries'
import { ApiError } from '#/lib/api'
import { serverService } from '#/services/server.service'
import { useNavigate } from '@tanstack/react-router'
import { ImagePlus } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

type Mode = 'pick' | 'create' | 'join'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateServerDialog({ open, onOpenChange }: Props) {
  const [mode, setMode] = useState<Mode>('pick')
  const navigate = useNavigate()
  const createServer = useCreateServer()
  const joinServer = useJoinServer()

  function handleClose() {
    onOpenChange(false)
    setTimeout(() => setMode('pick'), 200)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-110 max-w-[95vw] p-6">
        {mode === 'pick' && <PickMode onPick={setMode} />}
        {mode === 'create' && (
          <CreateMode
            onBack={() => setMode('pick')}
            onClose={handleClose}
            mutation={createServer}
            onSuccess={(serverId) => {
              handleClose()
              navigate({ to: `/server/${serverId}` })
            }}
          />
        )}
        {mode === 'join' && (
          <JoinMode
            onBack={() => setMode('pick')}
            onClose={handleClose}
            mutation={joinServer}
            onSuccess={(serverId) => {
              handleClose()
              navigate({ to: `/server/${serverId}` })
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

function PickMode({ onPick }: { onPick: (mode: Mode) => void }) {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-center text-xl">Add a Server</DialogTitle>
        <p className="text-center text-sm text-muted-foreground">
          Create your own or join an existing one with an invite code.
        </p>
      </DialogHeader>
      <div className="mt-2 flex flex-col gap-3">
        <Button
          variant="outline"
          onClick={() => onPick('create')}
          className="h-auto w-full flex-col items-start gap-0.5 whitespace-normal p-4 text-left"
        >
          <span className="font-semibold">Create My Own</span>
          <span className="text-sm font-normal text-muted-foreground">
            Start fresh with a new server
          </span>
        </Button>
        <Button
          variant="outline"
          onClick={() => onPick('join')}
          className="h-auto w-full flex-col items-start gap-0.5 whitespace-normal p-4 text-left"
        >
          <span className="font-semibold">Join a Server</span>
          <span className="text-sm font-normal text-muted-foreground">
            Enter an invite code to join
          </span>
        </Button>
      </div>
    </>
  )
}

function CreateMode({
  onBack,
  mutation,
  onSuccess,
}: {
  onBack: () => void
  onClose: () => void
  mutation: ReturnType<typeof useCreateServer>
  onSuccess: (serverId: number) => void
}) {
  const [name, setName] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPreviewUrl(URL.createObjectURL(file))
    setUploadedUrl(null)
    setIsUploading(true)
    try {
      const resp = await serverService.uploadFile(file)
      setUploadedUrl(resp.url)
    } catch (err) {
      setPreviewUrl(null)
      if (err instanceof ApiError) {
        toast.error(err.message)
      } else {
        toast.error('Failed to upload image')
      }
    } finally {
      setIsUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!name.trim()) return
    try {
      const server = await mutation.mutateAsync({
        name: name.trim(),
        ...(uploadedUrl ? { iconUrl: uploadedUrl } : {}),
      })
      toast.success(`Server "${server.name}" created!`)
      onSuccess(server.id)
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message)
      } else {
        toast.error('Failed to create server')
      }
    }
  }

  const isPending = isUploading || mutation.isPending
  const buttonLabel = isUploading
    ? 'Uploading...'
    : mutation.isPending
      ? 'Creating...'
      : 'Create'

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-center text-xl">
          Create a Server
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-4">
        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="group relative flex size-20 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-muted-foreground/40 bg-muted transition-colors hover:border-primary hover:bg-muted/80"
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Server icon preview"
                className="size-full object-cover"
              />
            ) : (
              <ImagePlus className="size-8 text-muted-foreground group-hover:text-primary" />
            )}
          </button>
          <span className="text-xs text-muted-foreground">
            {previewUrl ? 'Icon selected' : 'Click to upload icon (optional)'}
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        <Field>
          <FieldLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Server Name <span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My Awesome Server"
            maxLength={100}
            required
          />
        </Field>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1"
            disabled={isPending}
          >
            Back
          </Button>
          <Button
            type="submit"
            disabled={isPending || !name.trim()}
            className="flex-1"
          >
            {buttonLabel}
          </Button>
        </div>
      </form>
    </>
  )
}

function JoinMode({
  onBack,
  mutation,
  onSuccess,
}: {
  onBack: () => void
  onClose: () => void
  mutation: ReturnType<typeof useJoinServer>
  onSuccess: (serverId: number) => void
}) {
  const [inviteCode, setInviteCode] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!inviteCode.trim()) return
    try {
      const result = await mutation.mutateAsync({
        inviteCode: inviteCode.trim(),
      })
      toast.success('Joined server successfully!')
      onSuccess(result.serverId)
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message)
      } else {
        toast.error('Failed to join server')
      }
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-center text-xl">Join a Server</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-4">
        <Field>
          <FieldLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Invite Code <span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            placeholder="Enter invite code"
            required
          />
        </Field>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            type="submit"
            disabled={mutation.isPending || !inviteCode.trim()}
            className="flex-1"
          >
            {mutation.isPending ? 'Joining...' : 'Join'}
          </Button>
        </div>
      </form>
    </>
  )
}
