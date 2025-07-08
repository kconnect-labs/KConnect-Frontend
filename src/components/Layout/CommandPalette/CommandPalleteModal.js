import React, { useEffect, useMemo, useState } from 'react'
import { useCommandPalette } from '../../../context/CommandPalleteContext'
import {
	Dialog,
	DialogContent,
	TextField,
	Typography,
	ListItemButton,
	ListItemIcon,
	List,
	ListItemText,
} from '@mui/material'
import { useCallback } from 'react'

import { createGlobalCommands } from './GlobalCommands'
import { styled } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../../context/LanguageContext'
import { useMusic } from '../../../context/MusicContext'
import apiClient from '../../../services/axiosConfig'

const StyledDialog = styled(Dialog)({
	'& .MuiDialog-paper': {
		background: 'rgba(255, 255, 255, 0.03)',
		backdropFilter: 'blur(20px)',
		border: '1px solid rgba(255, 255, 255, 0.1)',
		borderRadius: 16,
		overflow: 'hidden',
		width: '700px',
		height: '40vh',
		maxWidth: 'none',
		maxHeight: 'none',
		'@media (max-width: 768px)': {
			margin: 0,
			width: '100vw',
			height: '100vh',
			borderRadius: 0,
		},
	},
})

const StyledListButton = styled(ListItemButton)({
	borderRadius: 8,
	'&:hover': {
		background: 'rgba(255, 255, 255, 0.1)',
	},
})

export const CommandPalleteModal = () => {
	const { isOpen, open, close, commands, register, unRegister } =
		useCommandPalette()
	const [query, setQuery] = useState('')
	const [selectedIndex, setSelectedIndex] = useState(0)
	const navigate = useNavigate()
	const { t } = useLanguage();
	const { currentSection, playTrack, isPlaying, togglePlay } = useMusic()
const playMyVibe = useCallback(async () => {
	console.log('метод запустился')
		const isVibePlaying = isPlaying && currentSection === 'my-vibe';
		console.log('isVibePlaying', isVibePlaying)
		if (isVibePlaying) {
			togglePlay();
			return;
		}
		
		try {
			const response = await apiClient.get('/api/music/my-vibe');
			console.log('My Vibe response:', response.data);
			
			if (response.data && response.data.success && response.data.tracks && response.data.tracks.length > 0) {
				// Воспроизводим первый трек из плейлиста "Мой Вайб"
				const firstTrack = response.data.tracks[0];
				playTrack(firstTrack, 'my-vibe');
			} else {
				console.log('No tracks found in response:', response.data);
			}
		} catch (err) {
			console.error("Failed to fetch My Vibe playlist:", err);

		} 
	}, [ playTrack, isPlaying, currentSection, togglePlay]);
	const GlobalCommands = useMemo(() => createGlobalCommands(navigate, t, playMyVibe), [])

	const filtered = useMemo(() => {
		const q = query.toLowerCase()
		return commands.filter(c => {
			if (c.visible && !c.visible()) return false
			return (
				c.title.toLowerCase().includes(q) ||
				c.description?.toLowerCase().includes(q) ||
				c.keywords?.some(k => k.toLowerCase().includes(q))
			)
		})

		
	}, [commands, query])

	useEffect(() => {
		setSelectedIndex(0)
	}, [filtered])

	useEffect(() => {
		console.log('GlobalCommands', GlobalCommands)
		register(GlobalCommands)
		return () => unRegister(GlobalCommands.map(c => c.id)) // <-- эт кароче что бы при размонтировании они удалялись
	}, [])

	useEffect(() => {
		const handler = e => {
			if (!isOpen) return

			if (e.key === 'ArrowDown') {
				e.preventDefault()
				setSelectedIndex(i => Math.min(i + 1, filtered.length - 1))
			}
			if (e.key === 'ArrowUp') {
				e.preventDefault()
				setSelectedIndex(i => Math.max(i - 1, 0))
			}
			if (e.key === 'Enter') {
				e.preventDefault()
				const selected = filtered[selectedIndex]
				if (selected) {
					selected.action()
					close()
				}
			}
		}

		window.addEventListener('keydown', handler)
		return () => window.removeEventListener('keydown', handler)
	}, [isOpen, filtered, selectedIndex, close])

	useEffect(() => {
		const onKeyDown = e => {
			if ((e.key === 'j' || e.key === 'о') && (e.metaKey || e.ctrlKey)) {
				e.preventDefault()
				console.log('open command pallete')
				isOpen ? close() : open()
			}
		}
		window.addEventListener('keydown', onKeyDown, { capture: true })
		return () => {
			console.log('remove keydown')
			window.removeEventListener('keydown', onKeyDown)
		}
	}, [isOpen])

	return (
		<StyledDialog
			open={isOpen}
			onClose={close}
			fullWidth
			maxWidth='sm'
			TransitionProps={{ appear: true }}
		>
			<DialogContent>
				<TextField
					autoFocus
					fullWidth
					label='Поиск команд'
					variant='outlined'
					value={query}
					onChange={e => setQuery(e.target.value)}
				/>

				{filtered.length === 0 && (
					<Typography variant='body2' sx={{ mt: 2 }}>
						Команды не найдены
					</Typography>
				)}

				<List>
					{filtered.map((cmd, index) => (
						<StyledListButton
							key={cmd.id}
							selected={index === selectedIndex}
							ref={el => {
								if (index === selectedIndex && el) {
									el.scrollIntoView({ block: 'nearest' })
								}
							}}
							onClick={() => {
								cmd.action()
								close()
							}}
							onMouseEnter={() => setSelectedIndex(index)}
						>
							{cmd.icon && <ListItemIcon>{cmd.icon}</ListItemIcon>}
							<ListItemText primary={cmd.title} secondary={cmd.description} />
						</StyledListButton>
					))}
				</List>
			</DialogContent>
		</StyledDialog>
	)
}
