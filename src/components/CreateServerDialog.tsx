import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { Input } from '#/components/ui/input'
import { Button } from '#/components/ui/button'
import { useCreateServer, useJoinServer } from '#/hooks/useServerQueries'
import { ApiError } from '#/lib/api'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
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
  const [iconUrl, setIconUrl] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!name.trim()) return
    try {
      const server = await mutation.mutateAsync({
        name: name.trim(),
        ...(iconUrl.trim() ? { iconUrl: iconUrl.trim() } : {}),
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

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-center text-xl">
          Create a Server
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Server Name <span className="text-destructive">*</span>
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My Awesome Server"
            maxLength={100}
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Icon URL (optional)
          </label>
          <Input
            value={iconUrl}
            onChange={(e) => setIconUrl(e.target.value)}
            placeholder="https://example.com/icon.png"
            type="url"
          />
        </div>
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
            disabled={mutation.isPending || !name.trim()}
            className="flex-1"
          >
            {mutation.isPending ? 'Creating...' : 'Create'}
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
        <DialogTitle className="text-center text-xl">
          Join a Server
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Invite Code <span className="text-destructive">*</span>
          </label>
          <Input
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            placeholder="Enter invite code"
            required
          />
        </div>
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
