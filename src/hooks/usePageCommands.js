import { useEffect } from 'react'
import { useCommandPalette } from '../context/CommandPalleteContext'
import { Command } from '../context/CommandPalleteContext'

export const usePageCommands = (commands) => {
	const { register, unRegister } = useCommandPalette()

	useEffect(() => {
		register(commands)
		return () => unRegister(commands.map(c => c.id))
	}, [])
}
