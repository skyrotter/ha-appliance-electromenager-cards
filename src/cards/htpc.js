/* Carte « Home cinéma PC (HTPC) » — custom:appliance-htpc-card
 * Lecteur multimédia (Kodi, Plex, tout media_player) sur la photo détourée d'un boîtier HTPC SilverStone : les voyants de la façade suivent
 * l'état (bleu allumé, vert lecture, orange pause / veille), l'écran du boîtier affiche le titre en cours (qui défile s'il est long) et le temps,
 * la molette s'illumine en lecture. En dessous : affiche du film, titre, barre de lecture cliquable, précédent / lecture-pause / suivant /
 * aléatoire, marche-arrêt, volume, source. Les boutons ne s'affichent que si le lecteur les gère (supported_features).
 * Puissance d'une prise connectée sur le PC en option (entity_power).
 */
(() => {
  const TAG = 'appliance-htpc-card';
  if (customElements.get(TAG)) return;

  const T = /*@i18n htpc*/{};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

  // photo détourée du boîtier (527 × 197)
  const IMG = 'data:image/webp;base64,UklGRtAgAABXRUJQVlA4WAoAAAAQAAAADgIAxAAAQUxQSOEAAAABgNxse9vmV/mVJnCOHz6RiGfw0VrTN3EOM+htC5eTQaaHmeC7fBExASJNpxjYNfLvhfmAgN7GttLFZnuLgGlejZVbP50KBO5mUxG1ePzGwJx85VMGgXIbqnBb6D/6j/6j/+g/+o/+I2TulgMWvE0OCr6P0RQKcvJYUG4D/Uf/0X/0H/1H/9F/9B/9R//Rf/Qf/Ucv3S0HLHibHBR8H6MpFOTksaDcBpYpJ48Fx2iqPmUUKG+TE7V4RIF8cz2IuPXTqWDgbjYV0cVmewuBaV6NIiIX5gMEehvbqukUBLtGRAAAVlA4IMgfAAAQowCdASoPAsUAPkkgjkYioaEhIdC7eFAJCWlrt/nVz97D+/37NiEX+nuodm59bP4u0/8fTB/h+hyUjpfbIGCsb4QnXnpVcG/1DZL2jie55bBZuQb9L/+nnb+hf6nBifL3iT+/61L8L109wP7Z3Qf8/6I/o/9S9GWaz4K80fjcvpXqAfnD/r+0l/neeT6s9hb9d/+n2I/RoIJMM1TwPL1p1yMiqdof3alzjEu9Sj2SB29fLZ19W412CAFf3nASWyVJlp1gwPzRnX9mTSfdYG8Wv2XC9BAEn9e0UoxL8Y6NZp5wZFTC1i0E1Iaiddcs5N/gwzzw04qHwvwd/HAdJKVJfAUJbC9xhFt8dYN6cLdZtz7grbGdG5GfVm4zLeH339CWyK9+U18hO3dCL7zuuPmxBQ0wkRzk3+ymch0P/AlX34h8HxaNIxGIAFhsq4FaOO44HxzpxJObmUXWg1h7mEyZBkX2KkuXE/+IFiAK+rNzrf9qlxo5cBWCT9LpgG7VEXk4YnjjPYMI5JKQ2tNjeK0kCGsi25cKyPZPaJk5wYK+F6nhS1N6gFeGPpbs6koSmy37OuAWIAYxGXOUz5wnyqYC8f2554KPVhmGBvWaHR1U9uL/hRDUzvLdzP8pMhHV9RvMgaDdlu/4EMTFBhy6OqNp6clTvS0U89mSQAjLdmSogfKQKOOOQATIIjIflR0Ug58QmbGzpdo7lZ8xGaQK85737szvPVezWUShEIeUPGTE3QD+qK4nVh5uJw6gfxzerqyvHv/PzEVWsZArmIBp2Xm3bT/Hfyv9VR+vbPhd5YmJh2S0mMwFO3B5ZAMvQr1NtRk7fh+hUSFZhNMELSphqW0d8UBG7M/fMb+jXxSMNOW0lFBC6vXUXSk1iGV7mrw4FIYpwelkC6xcCoKMOI6SUuBh/j5EEGv6zNK16HVqKGY/cpMqq7gMHvK4oSHSKbPo/fkyj+crGmp7Jug4WX+40VsiDafpHmbDvAPdwCndvjbgFgmWE7oWd9SgWHBG9mEWVA33+bTkZaBW7JACq89PSCJTzS0aboU/G/jR5aVaBdrPsVnsRmA0/k8q8AkXSqQWhvDmJLNgQDcYfNYKvZngWua7nF/btY/4O9hwO8dZF88X6abahw2wBofj3FMScRI1t3dDXgS/E+Nm7sL0MKL3Qoaju69d/wM5rveGNjfyRjVUIEP5/+DlLdScI8EPxHVyrZ7gm4pDrTKQYRcQD0+CYj82L/5Ttmu89zY2qXzjQ7f8+U6WvIaGJo5kPyFIZIkCyNOrmuTFxIm+fRbbHx/ZW+tiuspIswEVVAOkbKnPUJHCCQQBK3gzVe36+IksXu2kjsMVWecO7qXHoAqLXV5Bx1JKltJtn4aQGsfr06oPVwiq4iLIffTcjCPl9a1CnPWdATC0V3jyZcyymCerCE5q02XewaB/7z11g85IzVLBhhi58Qxx7Lc7AMFBcbUqf/M38dLDiPqISFH52gMr0OJPxj97RcThSXrajxu11ZUnQW9afDhaNYcNziJ3D7mYYuGD4rWhviebwRVU9uiY4SvI8r8pOU8a5Y+R0XItJs6t5zQglLnMUrGAGjgwIhr1XBtfuhrAthOvCucfdccgcV7/sYQWZO1Fh7M3+e0ZqegjMTrrr/VObt0vUU2kbr0Vz4fzElT7zBLPFlv4QG06wHzrRLc/QN+pCFfXC1LrgZZDeM19+j2Z+GJmvI8hhSs/6T89ALy/Ey/GbCkDfxwxKV0MFvA3kAD+pQF4/n//4rX/w6edMviU4vf/GKI1/S6Dm4d6FVoCJe/vch1vyzblPsGdanxXuQkEQpe8qYDiOcz3hc1d0hi/+doaw61sUVe7QidS5gbEdxKuUIzXpSUChnm6ZEbuxn8b6PSlj+IQjS+GIky2sHKR08YhMbCTTYKcNWibxLouuu95v6jVU99Ovh6i57a96qMShGKfBRlR03zMraOVzHHd8nxzOoiNQAOYtq6Ippk9/uZPzFf/AfurYdMdmpFaqHBZWJp7aW2hD2IfIGUo35yA/DLr0aOMNJMZ3UGJ/9YqcCg/LtAZEZ8Old0lNk9kj8MN3/izx2bya8phSfFua5oW6fPP+PIpWTShigzYdRUxobgs2ueR7qf9kmXRR7gKF95yYu3NpD5IWQfltjKcB2vXou+U8B9XOZQvJTb435IS0zLy8fyRg+/FrklS0qjoCArOJo9XLvdzhb/ZHMV4QfRiAKwtipC0hOxqv2i54aaU2nYX1XPH2aIvU5/z2Tu0GtPnQSvOz6R50JeFADL/0iBKiRBCofGB9XlO6KKu5Ax8thhJIYu+Kg2MrFV9jrQUXN90XKG60bTpdj2yXfwtt01q/9+JwWs0pd9wNlQMQKe9bYXVrz56QxuVxfsgP7AbyIm/1MHAau8m6RxX/5Mqw+QD9HBAXqaNqCRo6OLG+lI3OoLgbC6q8XU6kZ4Y08MpvTzAwTPLWBLhwC5H642bjQfGDSkQOJ3jjOWkFPwKhQu9v8QIHrBhMZB3/IR6tRXK/VHr9R2h/2ovXtxviRP62Uo+q4LgVCTVJ6ZbGG0O/bL6dNvtSnCSwuvdnpfbS+k7ShBiYcS36W4pif/YLCOnb8RGjDbO1RGEpsoSyD+Gh88w7MBh1K2YwmLlem+obkpX1zCwg9GlTvy+A4BrhOSnYE42lfLtSzweLCVzEI8J3pWaZwt3HmXxcm8S7pmXSrETv+Bdko3XzB6QJqDdBe/QPitNdPu+raPWu10pDtitSRnTXOAl0iBO9bBjhdSHxx08Lv5Ey380ZPsyb16laX5CaFUxlGFpzAyXHhUzooI20keEMrjegyn+0fBKki1fJnhGpNeKAi6Cesaty830z+pe6aud9HTPgfrdO481bMAIEkcLa/sySOhv5eHT9JKuThsvDJmorC5Q8xykT5+LciVbYpasvfkH3OeGIeX8zzwc+g8P57g+WI5dcj13lO9BG1sh8TEH/x8s8Juc+h2dj0Y2BrqY47AcYBP/kq3MqXKfbR7vuF4DEYWgmh5I2fm60l9AkIjM3baRd0VBOvo2UJdgPcJdhWiwkVkRoL251jnQwj9RwOXY5BOBN40ZgQPJLNEYFlMP6of6We4iMn+5lhREhxDMua6cPkqj3LgQfYMP4E9Wt2KbYuHRdgbRoxXgWOmrK/Q93fqLpU1/I84T3fA13ZsEzjQ6Zc1nFczkLZDvoSZ6ZFn9Nul7t1vgOtdvsl3Fne/G746j+Ki9fGogGOdXsqmiui9QO2JzREoP1kgiWqa/IPe7d4MetdFwXMDLwMlDdHuX0MAxb6N8GAn35JY/xehoDkoNS8o+j+iAxG5Xx7/SsLZyd8UqBWkFxwriZH4qRrgtaJhnOCkT5dsYOYRkZWUr1JS4L6cYxxFjxiO9xZFuIiQSJxk9ojUghPykv8isuwQ/k9GOiOyn1Fp91tsUMq98UiBrU/ggqr51rnu73U35GKK25Zc2yAzQXNf8KuI0hkfA1oz7r8FbtMBVqe72pe6atZqLgzBElMbzKsK67mJbdr48huLFNyNX01elMjTAhEed1OwW/j7C6idUqTW9LEdfy9Y7YWIqXIgs9kGHOUa5XTWn/uKcO24Iy+7CkfbvRrtHkI3/ya7fK+pyFws4V1s03zvcjcUBsF0y+Rt26bjjRsFqbE9lI+0rZF6pM7z3XbyiWQLx+62SzIRqCt+a7n59d7iY6XoAoYjAiFcFCf1tutgwmVK3Onxxiz77Xnvyc9hjsqiT2aXRREPfNIp8uTnbnhGdcFPq/dTrQnlD3a5iKfd87ylu4dd2MotO3p9M2deNVQmqESM5BWRtyw3K40GuP/GtjfGWZX7lII5/JF29TUEjGqk/8qvWXgLCqdiTHraAPSYuJNYkeCpa+Ml2k7JdWbU3/HFt0NcM+rP/Ok1Ne0/faLaVd8taqb0DHe/3UP0drB3zzdOjnAwtvC45UzEk+wX+sbf8CQw4qrxwYgortfZwZfeWh+8ROuLGYpJUdXSrAcD+tD+s4/lUkZQT3dBDm2zG7myIW/q7eS9Nal6OVZGh61rWPzz1j3hSOMAYz52ayULI1z7LVX09R6Ye7OASIlEP2HVkUexD5TVGgJnFWtUENVa9QDldIohYkR6auRy/IF+FR4t1BkQyZYmW4q8Wi6xsjl7bzif3vCXqFMq53tohQSNawUs/Z46x2uPbzDp/Lq5naw5ANmVV+F2oLFNTlwK0+exohxoNl2Vjiq+GknuF8UG5SvlmFmpCmAWz7znIfwZ4J68tgFFi59Z1E5qs1sIZvcxlbcnBg1ExhNk9efzJlnnXyIkaWUMiaN1elqBtAlBAxXNtcRCzMe5pgC/sBkpbvFywxnFgpJFOWJ9WTd7sfqIHzd67ev4RdBf+EpdSCv94W/cRJVroPl66925BIyMvljshfBfuyGMacbR0Bi7Pm/Ze71QdKXEp/z9QpXzo1euHfnpCTHTCdg3khlckkO3QwXe40ul6HbR3SkK2mQhjPOfac/gDj/v1vv1WMLKPVqS/HSZMPUvHvJddfDxotokmEYAPdmY4vPQIgVEa0JXQTH+D3YBmb46t2WLXbmT29l7jne6wziCILsHEz+0c/9qDpgjH2gHllzMB6xcW3pmr/2MXzZplEvXVYW6r2OL5whoBm33vuyZS2S1Qp8JP08FtszP5IipD0LDssllr3CXYKjZwc97ll38F5gR2tL9Jzmo7sCIgfAYOmdjUb0HmWZLKr2JVoF9QW2MyYi+fZEXej/5kU+aHBi9fCDzNeVVwKpOWJmdWkWEuVDnSmysJwitcaKZdKY9q8QTStlZTOvzrTMl+8R6y2QufvlQA5UWGcGDTfAov1u5ufLZrN6d1Smi5aOEdtKlVujosJMPmSAFL07nc/dH7jxv3avnpMgi2v/Gzu4WXWDKuqAMF6t3P4WlFkVbjwIRuDeEsgkDFegGkpuGaaTrcUfMNhA1L/H1hqeTov4/MlLdMl45Kkp4grQAXvZ1cf1NOe3JpjRG0fyRMf57G++HlT58fNBjoCKVyKqQ5zxmHyU8pkk3MNH2h1+IREnThekm+j8KDYZm/qDRY8fk7yAaiw+5tL+roC1iXsnacVuZSM0D3kDigQJUTksspEydvz2EH5U+09Kc4oV0oU5qEVtH9bjeHuG9QMjJyy5pOOzZ8LlIQNqbyNVlG1oQxnHjNmy9YnrO3ZCOmCno9cGJ2ofBFF+8ePjK6q3TCTupQgwvSL6LObCp8uxJFf6774m/NSiU4lx7UBpmsiGrNZBi/6ai8L6SGn3XxirljF+Y4tK8YM4kayeV3HsBdKne4OzjMU6jM24UCguBEFnnniwdvuIwe7O6E25cqBWDglUHGnGQ0aHzM0IIRb/7JZpL1d03w0GrcuNqtObJeWR/lOLzu5H4NE3+S4gGaAMyQf6gIeMwBsGOhA3pVLiNgBZKZyfcTDJmi/ZUBDJeNZ0zqKw9w3V18NihRPkeE4r7ZZATZCoCcJc4tGe15ReWFGG7/PsRP5OYSxnpQQsw6oVrPVNRYBDQXBPu4k5fRayL9RLa6y6wL8ilOH8KkKZZxYCYYivfSUckX5cR3pI/EILhuu0K+10IfoGI4LRWLUFPjhs2KMjmL4vsdIkmK6iFRY1+zMbcfKzpf4XKvcerHct9YGN4COLnsK3uFWMsIzktA0JhMsnCMUHUm4f6Rlep3VXR7dGXjC7RO9zZO7K0W+23twzMr0yez5UYUR1HGcE1h8yAVIeTH6gGnwkVmq368DnJL8696wdLoeTvQFgiMY55/sLclbKTAysa7kxQxzOMRtJp5UQgZdtGj3w6x4kuDOEtHnm8aBnpqPC420rZsCa7rP/6PP7D9OYkQ6Pxt/3fGN1J1kJuoZvHYnGVduHgsWn+VwHf7EZxx5fw3Tz3kPKd3SbygII7oJunOwWJun7uLnfT2kFVdCNu+0FjljD3DfS/5fwdH4wB2LvOf83fyTmG7EhviSDeA4wLKg58NSMAiM4AZi1ri38k92OFhci4/9vXj1ZJi37ZO5+N1YpmZqhW/+nXr6Sv3cFgY2tjirgKBQ9dNKXoWFHEaf7usxC0pCKD5cPJG/gqgk1467fhLlRItIOeR0wnACsxsqZmRKMJiAl51ov9RrYt5C1/jkmrNbpjA4auD7+oGXRByCFGnGJ3PX2ho/Lka1bfAHDSoiyJnuUTvpOUFyf0meaFYD87A6vnze48zkJInU8KPSm3/QIgoik+l9SJS/7JCl3cNsziTHYJuY7w3/ia/T89ZwAzcb5agS4J91dEIJ5s1H12pF+oZFE3QIzIiWzdmqnJCnAk+Xf2HsxEltOu6qp9eZcw6XK/MCu048vmQlVsrG3/8vqSSP7aJQdVdDiY8TG9/e0SQxQpYvKDJX/6m1NK6q7M/XBrJQBPhQLAfv7wGPi/QC1yUpWdBZ2/9zXySfwHXaewxL77vyjGhlK4D1VA7MUBJn6+zpEYLNoibshTE1HBXqTwh8mtSoKcPu7FijNzG7I6/NP1xU9d8wPFjS/AArWUsNucCfZLhntKMX0SrGuo2O+vzChTdEFTbw/dcaumIC/FIGYm9c5VGOcc4skWVF2Xf8r3CiL4wKgRQvpvK4KXxVmAb0+EqYMwEMaBfY+fSUfnEvpq3VYJ4S+knSx8NtSZUP8bH81H7HrfV3qpUqFm89s4qPhVM2njrrDW7WUSjRbGK++YrLgRUQ7+QGCY0vsI7CXxE9z9sV3vxq5+ggC6o70gNhaVqKBK/Vw2FW/dkRY82EXsMZSGEhbNqVOtSMpUT8rLIko3ZnTw2ncaziTQTUVSLb52LDlEWr7GLJW8MIS60Wwm8lZFiWk3W0OnPmR/Lmc19r+Zv9Bh8ibjBZAS74nOHQK/CSvRwIxtRiy+1n0plbbimdhLDSFGChlxrZ1lexJNvDGRQsY2Z3acRoknHqO9ZVmix7d1jl+WYepiOfx/UR2+K9v8Q17E2/DdojFOs63o0+m0dT0KF8d/OcdlDsSmjVH92vZqlzPm1tDuSVH+nKOHk1Fl+L7dx6wVl9PPQH0GeSJ+aaZZBTyDG8moyheU81b66NTwVP4/gmqo6yocPaDy4rBHDxSIGmzpGfrXHpKXhm2y9tW4FwLG2tKgX40fMKzmMQJ+ZHDC5i9hKCzCOCTiR2AiWO7Aid4aBCLGEe4KVS/ja2igDq7F7cI1qMKNnpRxBAG6pyO6SsyVl7OvjNh7qh4M0RFOAjYzi9srEzHg2i+W78XxphtgGr9+tJktfAxACtHnxrkmKObEJMfRy7ZhQAnNde6e03zdB/351OcNB/k7SgW0Lj/LBdDE4P0UA678LZS3VoAEy/YssQRYp80GsEMWUoirqpzf3ec3BaeYkcWdYSzH0Hfd8hwpNba4spxmW+oYQvZpPJobbUtkFnjdkQf9la/jwWKuOVY3UBDXxSX+dsdWT+2T3rbnetVxwJLqN4WkHTYIjfGEjU3NdgKbJlF2/OeUm2zg+mblMZZvfwUgl/mHIt9ZajilUN0pV6V4XEP1usNjpwB4Pq8nEqph9KtB/ATvl9ghYm5gmRpm7XD2z8vKg1/PfznzhdOm8Fs5nBpmIW4E5ANZlUzxcv6cH040m3uvp3PTW56WkFJYPeD365ACPOrbX444d4VwpVAP2Y7jO5rm3OqHX8Cacm+Mu+6ezbhobN52mDoUtJaGY8KuUhLaU62J/VjAtWSIhEVJba3MZKRa/jGQ7H0zufvaClrCHAFOj4T4OExMaC1dF9jfQYtRGO7lTtJxUM9XNnv9N0fMJiqs90rMV8zvLIFyhKVcvfle1KE5clS5ovcCsMil/hh7LgmKWy2PdFCLEyXqQKQRDrQKSTPuUWRAUjeTL+HesmPVys6TAs1O8qhDg9XSxAHsWGpxYiZZkbEXLdFkeH8dmM0jCZUbaDtSMMbdGAi4+1t6wBiFsG3m4DSwW9ZYAPN6XhAQsAz11HTWKcWbm1vHgLTjQ3elt6VKaElWGOMPK1FT8gK8V73bnHCvTZ/IufrluwaIlP8VybXvmZilaO9BJO/cMB+SbAOm+lTHHpgKpuqpwLohNJOIbPFC9hVoyZHqUZcOuanjmQu1fFXKVAHaDC4d23V8y/EiUz5uZznBk/l5zcU5fSafctbYDRQ98RmBNKpZkoGWX4JBS0YtRNTO88Il7TmZZ//5XKOEq2IGe2ppqjyt/khHo11RhBEd0uZSs1JJ+T2MpaBYvB4IiJES5wG5vQPZw2xUf8EP0HWyhfdnF/SnoiAakaEO/eDERDm0z77TRHN+etmYHuf4vwqX0NqROuVEqYFLHZbZOsTiW90s16cLSvHIm6h+SjRbFRn1PfFd+D//Lwzqn1gcjehGHfcrvQ0nqMGb3hAGgydOABF7JXyHBIu+N6DyepWHaxInHzu+fvzHMprY809wazRfd14SbAVeMru9v3YWd5jdRN4Bt4MmPO7sehEfEznHAw0qLquxq/dD+vXZGTiVdkQ8Fr5JHWIRlSa7F4xpeYvpRwibnMVii2ftZaFzQjQTbVtor/x8I7nooT0kNkG6L3g0HTu+cBvI4WlOtGlWK7l7jFVaugO2cxx1cWK8w6kuhf04D1Yc1UoCxz6H46jpu4gAALtQoHJtP5NME/jZFICtrgQWBUuepSiw/3RWqvMe94XwVsj1MXByOAiLp42LAuBg4upDbvp4dC6dC2SvunMig8eRgvmaLkeij1reCIi9erP1+0mdw45iC+H7BcvR+pcqLfVt2IEA0Yb9W7gXN9Yr1AkYOXIY9nCBCralfzEZo1xCeEMGmRqd9Zp38VwxaU4szI/crZocPEUFYwfk15fPG/zYV4bFkvwKZZA7p5/CMnEWrDeYi525dI7jWEBiwNHI5YoTWlIzhhbHnYtmbMTB3faqBby2PsJpr/YKRZ31ib60SpaBlfsnyCPdEcvmiDP87giXVUH5+00vzwyM4YlEdwDgBAgA4xOa7SUgct9LtrLmFgsheppY2OWsxEFhGcjS1wrKZt8kv9j1LZ22JBs0OIkvs94mXPSt+4MCKKywLdDjqZCm8DIQm0zGM3n64UZBnjrVcYLo/dcO0VklWXNqMmF09GbxEuS3VpKGXOFNe68rSfL8ZvEXXXWrCWk0bjW88N6vW+3TU/9mDoQ5tYw5BWW7ZRgYdFk1mMgkJ4zcDkuQusXoXkWYF0PwBIlj4LfCdt8heGlzMbcZGjesYeKIF8iOtq9dFvHHFRTcrSNRmmWlQxq252TmxjW+qCIE8edosqvUF8qjh/wKvD/No8OT5TDaGWCuXAboOXIWaitYO7EnjhPdJRK5YK4ekmHfwvT3lhQD12bRqS8Pdnn9O2APb2tn8+EPzlCauPgBUjx69yNjBk/KhMAIFP8bZ8qZz52WQxag+pLtgXofPt2BlAk7cHrRU0FMq8InMRJYCqOg2ujkticc1xwKaTNqY8fENAAH4Txvw6Lzv8lSEi584jqPx3ynVauBNhBHD4rjuPkBgHb/Bk760eceTbAmXVzV8Y/ZR8cBt0/vakTR55HsEB5ALPTmRz/D642q8sBqxvgut9Y8KQh9sem/EyRNQpngajL634O2fWKtWnx+Stfj9PFxgKaDS0cdRODu2kNJsc0PLtbA3zDdD/vIDHZ3XftXhD8gio23ZbnRDskJy6pFlGw1yfVAX/1n+582UA8xq1ssXhvljA4tJTDP4Cogl9StAvObcI0CpA/d+8UhKDvdTcN1IBcT+ZuafxTywtPX4NsqUoXA92/v1m6JdX2HqxbHEg0t49arCV6juwCXjqKu4x9eThJ33qlMYhFxO8YqmYQxPTgI+PGKMKrpmgM/lblBZmLCx1+FNUYQEH25M0ebiKozGMwEOb7KBmiaCBJosU2Fz7/Ms+TTLcLXJM5RLX3LCRdpgdZkhwXwLdC78NpHpRlmu/qzd3wELTyBNOxJwofAs9JyeT3GoxiOu7HDYIml4GxBmF/SHbUakHsxtRfmvNSy+WdGy4bg1TcY3Y5bhiwE8vUn5xncH3O5kE0a1nsGI2wGon8NNOd+sQ1P3e/nzSpTaI3isjEKJKkCoYGCSKvh5R85tNgzawX1ZQNvw85YDVMO/ABB63uxuh5txFoQ8mfknvDlo48aZH9tdua5RIykIgb38D8VnMbu40Tik7oq4GwAzqKYp+6iCjc4Jgxrv2Oz5PxKWhurNV43bcVYuhXfq6SBO/nD9KzP2Us6cJyqqW6flpDJWSNzbVM4w/87hB6XfvCxpcprC2RjlSS+pZknqbx5VovSznBy9OR5Ky3KrTnbC5nCHkBoHHjK+eD4NAS+Nl+gbn/nMH9w0LPbMEj9kyyPpFpdUqiSU5ZjJ39Xh8KKMNH5BUCvcbUchm/lBFpg90rWbeZQA4DOMUX3eAWHxIccWMv1h4XcGc1PlCtwsM1xvp9Q6OhH/cpMq+9nhTDIjohPT4NO4D8vNfARl4fESQ/2cY3HM2v+jeQCHIn+F+/38j/4u1gh3WJS8qy1//LcTjXhhMhf3yfwxj5RbHg5XGQWECmq3wj9kPP/J0wAdKSo+NrIqj0rakPCbL2yM89EPXnf9mKu988phfc0Yr3LkHqohIk4Kt0EaUFwkMhXYqphkjSBAe217J9phvGhxcIJsE8r+UhtidNQzNDiZeURirW+4UQPc8JB7Su+dRtcSyJMLJ/Rg0MQ+XAey5McP6ER3gKxc2yd6FFFICnPzzotFjtwrBhHwSnOLqshSq2fbDpxmUk7WKwWKd7QTLXo80kMZt+Bz7nEgkjdW9161kx1klAAuv5f6w+AajaK9QF8mkJszAN4ff6yJ2cavpqdxJF4n66Jk68st+lvQBRAEzhUkGoHAw93RKmbKdhuC1P+USH/9JX+lMQwnZTf1P4AAAAA=';
  // fonctions gérées par un media_player (supported_features)
  const F = { PAUSE: 1, SEEK: 2, VOLUME_SET: 4, VOLUME_MUTE: 8, PREV: 16, NEXT: 32, TURN_ON: 128, TURN_OFF: 256, SELECT_SOURCE: 2048, PLAY: 16384, SHUFFLE: 32768 };

  const CSS = `
:host{display:block;height:100%}ha-card{height:100%;box-sizing:border-box;display:block;padding:10px 12px 12px;overflow:hidden;--ht-on:#3ba7ff;--ht-play:#3ddc84;--ht-warn:#ffb300}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.playing .badge{background:color-mix(in srgb,var(--ht-play) 22%,transparent);color:var(--ht-play)}
.paused .badge,.standby .badge{background:color-mix(in srgb,var(--ht-warn) 24%,transparent);color:var(--ht-warn)}
.on .badge,.idle .badge{background:color-mix(in srgb,var(--ht-on) 22%,transparent);color:var(--ht-on)}
svg{display:block;width:calc(100% * var(--illus-scale,1));max-width:100%;height:auto;margin:6px auto 4px;cursor:pointer;overflow:visible}
.scr{font-family:"Courier New",ui-monospace,monospace;font-weight:700;fill:#9aeaff;filter:drop-shadow(0 0 2px rgba(120,225,255,.7))}
.led{transition:fill .3s}
.marq{animation:htmarq var(--d,10s) linear infinite}
.ring{fill:none;stroke-width:1.6}.pulse{animation:htpulse 2.2s ease-in-out infinite}
.now{display:none;align-items:center;justify-content:center;gap:10px;margin-top:6px}.now.show{display:flex}
.now.left{justify-content:flex-start}.now.right{justify-content:flex-start;flex-direction:row-reverse}.now.right .tx{text-align:right}
.now .tx{max-width:calc(100% - 76px)}
.now img{width:64px;height:64px;object-fit:cover;border-radius:8px;flex:none;background:rgba(127,127,127,.15)}
.now .tx{min-width:0}.now .t{font-size:14px;font-weight:600;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.now .s{font-size:12px;color:var(--secondary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px}
.seek{display:none;margin-top:8px}.seek.show{display:block}
.seek input,.vol input{width:100%;margin:0;height:20px;accent-color:var(--primary-color,#03a9f4);cursor:pointer}
.seek .tm{display:flex;justify-content:space-between;font-size:11px;color:var(--secondary-text-color);margin-top:-2px}
.ctl{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:8px;flex-wrap:wrap}
.ctl button{display:flex;align-items:center;justify-content:center;border:0;cursor:pointer;width:42px;height:42px;border-radius:50%;background:var(--secondary-background-color);color:var(--primary-text-color)}
.ctl button.big{width:52px;height:52px;background:color-mix(in srgb,var(--primary-color,#03a9f4) 22%,transparent)}
.ctl button.on{color:var(--primary-color,#03a9f4)}.ctl button.hide,.vol.hide,.src.hide,.tiles.hide{display:none}
.ctl button:disabled{opacity:.4;cursor:default}.ctl button ha-icon{--mdc-icon-size:22px}
.vol{display:flex;align-items:center;gap:6px;margin-top:6px}.vol button{border:0;background:none;cursor:pointer;color:var(--secondary-text-color);padding:0;display:flex}
.src{margin-top:6px}.src select{width:100%;box-sizing:border-box;padding:8px;border-radius:10px;border:0;background:var(--secondary-background-color);color:var(--primary-text-color);font:inherit}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(88px,1fr));gap:6px;margin-top:8px}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color)}
.tile .l ha-icon{--mdc-icon-size:13px}.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px}.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.unavailable svg{filter:grayscale(.85) opacity(.6)}
.noanim *{animation:none!important}
@keyframes htmarq{from{transform:translateX(0)}to{transform:translateX(calc(-1 * var(--w,200px) - 140px))}}
@keyframes htpulse{50%{opacity:.35}}
`;

  const hms = (s) => { s = Math.max(0, Math.round(s)); const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60; return `${h ? h + ':' + String(m).padStart(2, '0') : m}:${String(x).padStart(2, '0')}`; };

  class ApplianceHtpcCard extends HTMLElement {
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      return { entity: ids.find((i) => /^media_player\./.test(i) && /(kodi|htpc|cine|cinema|salon)/i.test(i)) || ids.find((i) => /^media_player\./.test(i)) || '' };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { poster_position: 'center', show_poster: true, show_seek: true, show_volume: true, show_source: true, ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    connectedCallback() { this._timer = setInterval(() => { if (this._built && this._hass && this._playing) this._tick(); }, 1000); }
    disconnectedCallback() { clearInterval(this._timer); }
    getCardSize() { return 6; }
    getGridOptions() { return { columns: 6, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _st() { return this._c.entity && this._hass.states[this._c.entity]; }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }
    _svc(s, d = {}) { this._hass.callService('media_player', s, { entity_id: this._c.entity, ...d }); }

    // état affichable : unavailable, off, standby, idle, on, playing, paused
    _state(st) {
      const s = st ? String(st.state).toLowerCase() : 'unavailable';
      return /^(playing|paused|idle|standby|off|on|unavailable)$/.test(s) ? s : s === 'buffering' ? 'playing' : s === 'unknown' ? 'unavailable' : 'on';
    }
    // position de lecture en secondes, avancée depuis la dernière mise à jour quand ça joue
    _pos(a, state) {
      let p = Number(a.media_position);
      if (!isFinite(p)) return NaN;
      if (state === 'playing' && a.media_position_updated_at) p += (Date.now() - new Date(a.media_position_updated_at).getTime()) / 1000;
      const d = Number(a.media_duration);
      return isFinite(d) && d > 0 ? Math.min(p, d) : p;
    }
    _titles(a) {
      const t = a.media_title || a.media_series_title || '';
      const sub = [a.media_series_title && a.media_title ? a.media_series_title : '', a.media_season != null && a.media_episode != null ? `S${String(a.media_season).padStart(2, '0')}E${String(a.media_episode).padStart(2, '0')}` : '', a.media_artist || '', a.media_album_name || ''].filter(Boolean).join(' · ');
      return { t: String(t), sub };
    }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="httitle"></div><div class="badge" id="htbadge"></div></div>
        <svg viewBox="0 0 527 197" role="img" aria-label="${esc(this._c.name || this._t('name'))}"><defs><clipPath id="htclip"><rect x="194" y="84" width="132" height="42"/></clipPath></defs>
          <ellipse cx="263" cy="193" rx="240" ry="6" fill="#000" opacity=".28"/>
          <image href="${IMG}" width="527" height="197"/><g id="htov"></g></svg>
        <div class="now" id="htnow"><img id="htpic" alt=""><div class="tx"><div class="t" id="htt"></div><div class="s" id="hts"></div></div></div>
        <div class="seek" id="htseek"><input type="range" id="htsk" min="0" max="1000" value="0"><div class="tm"><span id="htp">0:00</span><span id="htd">0:00</span></div></div>
        <div class="ctl" id="htctl">
          <button data-a="power" title=""><ha-icon icon="mdi:power"></ha-icon></button><button data-a="prev"><ha-icon icon="mdi:skip-previous"></ha-icon></button>
          <button data-a="play" class="big"><ha-icon icon="mdi:play"></ha-icon></button><button data-a="next"><ha-icon icon="mdi:skip-next"></ha-icon></button><button data-a="shuffle"><ha-icon icon="mdi:shuffle-variant"></ha-icon></button></div>
        <div class="vol" id="htvol"><button data-a="mute"><ha-icon icon="mdi:volume-high"></ha-icon></button><input type="range" id="htv" min="0" max="100" value="0"></div>
        <div class="src" id="htsrc"><select id="htsel"></select></div>
        <div class="tiles hide" id="httiles"></div></ha-card>`;
      window.applianceBindIllus(this, root.querySelector('svg'), () => this._more(this._c.entity));
      const $ = (id) => root.getElementById(id);
      root.querySelectorAll('#htctl button,#htvol button').forEach((b) => b.addEventListener('click', () => {
        const st = this._st(), a = (st && st.attributes) || {}, s = this._state(st), k = b.dataset.a;
        if (k === 'power') this._svc(s === 'off' || s === 'standby' ? 'turn_on' : 'turn_off');
        else if (k === 'prev') this._svc('media_previous_track');
        else if (k === 'next') this._svc('media_next_track');
        else if (k === 'play') this._svc('media_play_pause');
        else if (k === 'shuffle') this._svc('shuffle_set', { shuffle: !a.shuffle });
        else if (k === 'mute') this._svc('volume_mute', { is_volume_muted: !a.is_volume_muted });
      }));
      const sk = $('htsk'); sk.addEventListener('input', () => { this._seeking = true; });
      sk.addEventListener('change', () => { const st = this._st(), d = Number(st && st.attributes.media_duration); if (isFinite(d) && d > 0) this._svc('media_seek', { seek_position: Math.round((sk.value / 1000) * d) }); this._seeking = false; });
      $('htv').addEventListener('change', (e) => this._svc('volume_set', { volume_level: Number(e.target.value) / 100 }));
      $('htsel').addEventListener('change', (e) => this._svc('select_source', { source: e.target.value }));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    // écran du boîtier + voyants (redessinés chaque seconde en lecture, pour le temps)
    _overlay(state, a) {
      const on = !/^(off|unavailable)$/.test(state), play = state === 'playing', pause = state === 'paused', stand = state === 'standby';
      const led = (x, col, glow) => `<circle class="led" cx="${x}" cy="151" r="3" fill="${col}" ${glow ? `style="filter:drop-shadow(0 0 4px ${col})"` : ''}/>`;
      const l1 = on && !stand ? '#3ba7ff' : stand ? '#ffb300' : '#2a2d31', l2 = play ? '#3ddc84' : pause ? '#ffb300' : '#2a2d31';
      let scr = '';
      if (on && !stand) {
        const { t } = this._titles(a), p = this._pos(a, state), d = Number(a.media_duration);
        const line1 = play || pause ? (t || '...').toUpperCase() : 'READY';
        const w = line1.length * 8.4, tm = play || pause ? `${isFinite(p) ? hms(p) : ''}${isFinite(d) && d > 0 ? ' / ' + hms(d) : ''}` : '';
        scr = `<g class="scr" clip-path="url(#htclip)">
          ${w > 126 ? `<text class="marq" x="326" y="102" font-size="14" style="--w:${Math.round(w)}px;--d:${Math.max(8, Math.round(w / 22))}s">${esc(line1)}</text>` : `<text x="260" y="102" font-size="14" text-anchor="middle">${esc(line1)}</text>`}
          <text x="198" y="120" font-size="10" opacity=".9">${play ? '▶' : pause ? '❚❚' : ''}</text><text x="322" y="120" font-size="10" text-anchor="end">${esc(tm)}</text></g>`;
      }
      return `${led(50, l1, on)}${led(75, l2, play || pause)}${led(98, '#2a2d31', false)}
        ${on && !stand ? '<circle class="ring" cx="74" cy="125" r="11.5" stroke="#3ba7ff" opacity=".8"/>' : ''}
        ${play ? '<circle class="ring pulse" cx="430" cy="81" r="29" stroke="#3ba7ff" opacity=".7"/>' : ''}${scr}`;
    }

    _tick() {
      const st = this._st(); if (!st) return;
      const a = st.attributes || {}, state = this._state(st), r = this._root;
      r.getElementById('htov').innerHTML = this._overlay(state, a);
      const d = Number(a.media_duration), p = this._pos(a, state);
      if (!this._seeking && isFinite(d) && d > 0 && isFinite(p)) { r.getElementById('htsk').value = String(Math.round((p / d) * 1000)); r.getElementById('htp').textContent = hms(p); }
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card, hass = this._hass, st = this._st();
      const a = (st && st.attributes) || {}, state = this._state(st), $ = (id) => r.getElementById(id);
      this._playing = state === 'playing';
      card.className = `${state}${c.animations === false ? ' noanim' : ''}`;
      $('httitle').textContent = c.name || (a.friendly_name || this._t('name'));
      const badge = $('htbadge'); badge.textContent = this._t(state); badge.style.display = c.show_status === false ? 'none' : '';
      const sf = a.supported_features == null ? 0x7fffffff : Number(a.supported_features), has = (f) => (sf & f) !== 0, active = state === 'playing' || state === 'paused';
      // affiche, titre, sous-titre
      const { t, sub } = this._titles(a), pic = a.entity_picture_local || a.entity_picture;
      const now = $('htnow'); now.classList.toggle('show', active && (c.show_poster !== false || !!t));
      now.classList.toggle('left', c.poster_position === 'left'); now.classList.toggle('right', c.poster_position === 'right');
      const img = $('htpic'); img.style.display = c.show_poster !== false && pic ? '' : 'none';
      if (pic) { const u = String(pic).startsWith('/') && hass.hassUrl ? hass.hassUrl(pic) : pic; if (img.dataset.u !== u) { img.dataset.u = u; img.src = u; } }
      $('htt').textContent = t; $('hts').textContent = sub;
      // barre de lecture
      const d = Number(a.media_duration), seek = $('htseek'); seek.classList.toggle('show', c.show_seek !== false && active && isFinite(d) && d > 0);
      $('htd').textContent = isFinite(d) && d > 0 ? hms(d) : ''; $('htsk').disabled = !has(F.SEEK);
      // boutons
      const b = (k) => r.querySelector(`#htctl button[data-a="${k}"]`), pw = b('power'), off = state === 'off' || state === 'standby';
      pw.classList.toggle('hide', !(has(F.TURN_ON) || has(F.TURN_OFF))); pw.classList.toggle('on', !off && state !== 'unavailable'); pw.title = this._t('btn_power');
      b('prev').classList.toggle('hide', !has(F.PREV)); b('next').classList.toggle('hide', !has(F.NEXT)); b('prev').title = this._t('btn_prev'); b('next').title = this._t('btn_next');
      const pl = b('play'); pl.classList.toggle('hide', !(has(F.PAUSE) || has(F.PLAY))); pl.title = this._t('btn_play'); pl.querySelector('ha-icon').setAttribute('icon', state === 'playing' ? 'mdi:pause' : 'mdi:play');
      const sh = b('shuffle'); sh.classList.toggle('hide', !has(F.SHUFFLE) || !active); sh.classList.toggle('on', !!a.shuffle); sh.title = this._t('btn_shuffle');
      r.querySelectorAll('#htctl button').forEach((x) => { x.disabled = state === 'unavailable'; });
      // volume, source
      const vol = $('htvol'); vol.classList.toggle('hide', c.show_volume === false || !has(F.VOLUME_SET) || off);
      if (a.volume_level != null) $('htv').value = String(Math.round(Number(a.volume_level) * 100));
      const mu = vol.querySelector('button ha-icon'); mu.setAttribute('icon', a.is_volume_muted ? 'mdi:volume-off' : 'mdi:volume-high'); vol.querySelector('button').title = this._t('btn_mute');
      const src = $('htsrc'), list = Array.isArray(a.source_list) ? a.source_list : [];
      src.classList.toggle('hide', c.show_source === false || !has(F.SELECT_SOURCE) || !list.length || off);
      const sel = $('htsel'), key = list.join('|'); if (sel.dataset.k !== key) { sel.dataset.k = key; sel.innerHTML = list.map((s) => `<option value="${esc(s)}">${esc(s)}</option>`).join(''); } if (a.source) sel.value = a.source;
      // tuile de puissance (prise connectée sur le PC)
      const tiles = $('httiles'), pwId = c.entity_power, ps = pwId && hass.states[pwId], ok = ps && !/^(unavailable|unknown)$/i.test(String(ps.state));
      tiles.classList.toggle('hide', !ok);
      if (ok) { const n = parseFloat(String(ps.state).replace(',', '.')); tiles.innerHTML = `<div class="tile" data-e="${esc(pwId)}"><div class="l"><ha-icon icon="mdi:flash"></ha-icon><span>${esc(this._t('power'))}</span></div><div class="v">${isFinite(n) ? n.toLocaleString(window.applianceLocale(c, hass), { maximumFractionDigits: n < 10 ? 1 : 0 }) : esc(ps.state)}<small>${esc((ps.attributes && ps.attributes.unit_of_measurement) || 'W')}</small></div></div>`; tiles.querySelector('.tile').onclick = () => this._more(pwId); }
      this._tick();
    }
  }
  customElements.define(TAG, ApplianceHtpcCard);

  /* ---- éditeur visuel ---- */
  class ApplianceHtpcCardEditor extends HTMLElement {
    setConfig(c) { this._c = c; this._draw(); }
    set hass(h) { this._hass = h; if (this._form) this._form.hass = h; }
    _draw() {
      if (!this._form) {
        this._form = document.createElement('ha-form');
        this._form.addEventListener('value-changed', (e) => {
          this._c = e.detail.value;
          this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: this._c }, bubbles: true, composed: true }));
        });
        this.appendChild(this._form);
      }
      const bool = (name, def = true) => ({ name, selector: { boolean: {} }, default: def });
      const tr = { ...T.en, ...T[window.applianceLang(T, this._c, this._hass)] }; // repli par clé sur l'anglais
      this._form.hass = this._hass; this._form.data = { ...this._c };
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'entity', selector: { entity: { domain: 'media_player' } } },
        { name: 'entity_power', selector: { entity: { domain: 'sensor' } } },
        { name: 'poster_position', selector: { select: { mode: 'dropdown', options: ['center', 'left', 'right'].map((value) => ({ value, label: tr[`poster_${value}`] || value })) } } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [bool('show_status'), bool('show_poster'), bool('show_seek'), bool('show_volume'), bool('show_source'), bool('animations')] },
      ];
      this._form.computeLabel = (s) => tr[`f_${s.name}`] || window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceHtpcCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Home cinéma PC (Kodi…) sur la photo d\'un boîtier HTPC : voyants et écran du boîtier qui suivent la lecture, affiche, barre de lecture, commandes, volume et source.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/htpc.md',
  });
})();
