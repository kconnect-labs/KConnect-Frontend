import AccountSwitcher from './AccountSwitcher';

                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  
                  {user ? (
                    <>
                      
                      <AccountSwitcher />
                      
                      
                    </>
                  ) : (
                    // ... код для неавторизованного пользователя ...
                  )}
                </Box> 